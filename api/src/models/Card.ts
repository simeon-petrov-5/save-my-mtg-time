export type Card = {
  name: string;
  count: number;
  id: string;
  imgUrl: string;
};

export type UserCards = Map<string, Card>;