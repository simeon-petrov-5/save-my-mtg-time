import intersectionBy from "lodash.intersectionby";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

type CardItem = {
  name: string;
  count: string;
  id: string;
  urlId: string;
  cardUrl: string;
};

type CardResp = { userId: string; cards: CardItem[] };

const getLastPage = ($cheerio: cheerio.CheerioAPI) => {
  const href = $cheerio(".controls a:last-child").attr("href") ?? "";
  const matched = href.match(/p=(\d+)/) ?? ["", 0];
  return Number(matched[1]);
};

const getCards = ($cheerio: cheerio.CheerioAPI) => {
  const cardsList: CardItem[] = [];
  const cards = $cheerio("#set_cards_table_details tr[id]");

  cards.each(function () {
    const listedCard = $cheerio(this);

    const cardData: CardItem = {
      name: "",
      count: "",
      id: "",
      urlId: "",
      cardUrl: "",
    };
    cardData.id = listedCard.attr("id") ?? "";
    cardData.name =
      listedCard.find("td:nth-child(2)").text().trim() ?? "FAILED TO GET";
    cardData.count = listedCard.find(".tradelist_count").text() ?? "?";
    cardData.cardUrl = listedCard.find("td > a").attr("href") ?? "";
    const idMatch = cardData.cardUrl.match(/printing=(\d+)/) ?? ["", ""];
    cardData.urlId = idMatch[1];

    cardsList.push(cardData);
  });

  return cardsList;
};

function isOutdated(cacheDate: Date, targetDate: Date) {
  return false;
  // For now let's not scrape again
  // const thirtyMinutesInMilliseconds = 30 * 60 * 1000; // 30min
  // const timeDifference = targetDate.getTime() - new Date(cacheDate).getTime();

  // return timeDifference >= thirtyMinutesInMilliseconds;
}

const scrapeDeckbox = async (id: string) => {
  console.info("Starting to scrape for ", id);
  const cardsList: CardItem[] = [];

  const p = 1;
  const initUrl = `https://deckbox.org/sets/${id}?p=${p}&v=l`;
  const { data } = await axios.get(initUrl);
  let $ = cheerio.load(data);

  const lastPage = getLastPage($);

  for (let index = 1; index < lastPage + 1; index++) {
    const targetUrl = `https://deckbox.org/sets/${id}?p=${index}&v=l`;
    if (initUrl !== targetUrl) {
      const { data } = await axios.get(targetUrl);
      $ = cheerio.load(data);
    }

    const list = getCards($);
    cardsList.push(...list);
    console.info(
      `Scraped for ID ${id} page ${index}. Current count ${cardsList.length}`
    );
  }
  return cardsList;
};

const scrapeMoxfield = async (id: string) => {
  console.info("Starting to scrape for ", id);
  const { data } = await axios.get(
    `https://api2.moxfield.com/v3/decks/all/${id}`
  );

  const cardsList: CardItem[] = [];

  Object.keys(data.boards).forEach((boardType) => {
    const { cards } = data.boards[boardType];

    Object.keys(cards).forEach((cardId) => {
      const entry = cards[cardId];
      const cardData: CardItem = {
        id: cardId,
        name: entry.card.name,
        count: entry.quantity,
        urlId: cardId,
        cardUrl: `https://assets.moxfield.net/cards/card-${cardId}-normal.webp`,
      };
      cardsList.push(cardData);
    });
  });
  return cardsList;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const deckboxResults: CardResp[] = [];
  const moxfieldResults: CardResp[] = [];

  for (const deckId of body.moxfield) {
    const scrapedData = await prisma.scrapedEntry.findFirst({
      where: { userId: { equals: deckId } },
    });

    if (scrapedData === null || isOutdated(scrapedData.createdAt, new Date())) {
      const cardsList = await scrapeMoxfield(deckId);
      try {
        await prisma.scrapedEntry.create({
          data: {
            userId: deckId,
            cards: JSON.stringify(cardsList),
          },
        });
      } catch (e) {
        console.error("Prisma failed", e);
      }
    }

    moxfieldResults.push({
      userId: deckId,
      cards: scrapedData?.cards ? JSON.parse(scrapedData?.cards) : [],
    });
  }

  for (const userId of body.deckbox) {
    console.log("itterate for", userId);
    const scrapedData = await prisma.scrapedEntry.findFirst({
      where: { userId: { equals: userId } },
    });
    if (scrapedData === null || isOutdated(scrapedData.createdAt, new Date())) {
      const cardsList = await scrapeDeckbox(userId);
      try {
        await prisma.scrapedEntry.create({
          data: {
            userId: userId,
            cards: JSON.stringify(cardsList),
          },
        });
      } catch (e) {
        console.error("Prisma failed", e);
      }
    }

    deckboxResults.push({
      userId,
      cards: scrapedData?.cards ? JSON.parse(scrapedData?.cards) : [],
    });
  }

  const search = body.cards.map((card: string) => ({
    name: card.trim(),
  }));

  const findings: { deckbox: CardResp[]; moxfield: CardResp[] } = {
    deckbox: [],
    moxfield: [],
  };

  deckboxResults.forEach((userEntry) => {
    const finds = intersectionBy(userEntry.cards, search, "name");
    if (finds.length > 0) {
      findings.deckbox.push({ userId: userEntry.userId, cards: finds });
    }
  });

  moxfieldResults.forEach((userEntry) => {
    const finds = intersectionBy(userEntry.cards, search, "name");
    if (finds.length > 0) {
      findings.moxfield.push({ userId: userEntry.userId, cards: finds });
    }
  });

  return findings;
});
