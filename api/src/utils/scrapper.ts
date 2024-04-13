import { Card } from "../models/Card";

const { parse } = require("node-html-parser");

const getQty = (parsedRow: any) => {
  return parsedRow.querySelector(".tradelist_count").text
    ? Number(parsedRow.querySelector(".tradelist_count").text)
    : 0;
};

export const getLastPage = (html: string) => {
  const parsedRow = parse(html);
  const href =
    parsedRow.querySelector(".controls a:last-child").getAttribute("href") ??
    "";
  const matched = href.match(/p=(\d+)/) ?? ["", 0];
  return Number(matched[1]);
};

export const scrapeDeckbox = async ({
  url,
  allCards,
  html
}: {
  url?: string;
  html?: string;
  allCards: Map<string, Card>;
}) => {
  let root = null;
  if (url) {
    const resp = await fetch(url);
    const _html = await resp.text();
    root = parse(_html);
  } else if (html) {
    root = parse(html);
  }
  const rows = await root.querySelectorAll("#set_cards_table_details tr[id]");
  rows.forEach((row: any) => {
    const parsedRow = parse(row);
    const name = parsedRow.querySelector("td:nth-child(2)").text.trim() ?? "";

    const existing = allCards.get(name);
    if (existing) {
      existing.count += getQty(parsedRow);
    } else {
      const card: Card = {
        name: "",
        count: 0,
        id: "",
        imgUrl: "",
      };
      card.id = row.id;
      card.name = name;
      card.count = getQty(parsedRow);

      const tooltipId =
        parsedRow.querySelector("td > a").getAttribute("data-tt") ?? "";
      card.imgUrl = `https://s.deckbox.org/system/images/mtg/cards/${tooltipId}.jpg`;
      allCards.set(name, card);
    }
  });
  return true;
};
