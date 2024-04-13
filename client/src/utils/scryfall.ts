import type { Card } from '../../../api/src/models/Card';

export type ScryfallInfo = {
  name: string
  usd: string
  eur: string
  cardmarket: string
  tcgplayer: string
};

export async function fetchScryfallCollection(cards: Card[]): Promise<{ [k: string]: ScryfallInfo }> {
  const payload = {
    identifiers: cards.map(card => ({ name: card.name }))
  };
  const resp = await fetch('https://api.scryfall.com/cards/collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();

  const info: { [k: string]: ScryfallInfo } = {};
  data.data.forEach((entry: any) => {
    info[entry.name] = {
      name: entry.name,
      usd: entry.prices.usd,
      eur: entry.prices.eur,
      cardmarket: entry.purchase_uris.cardmarket,
      tcgplayer: entry.purchase_uris.tcgplayer
    };
  });

  return info;
}
