export const Sites =  ['moxfield', 'deckbox'] as const;


export type Site = typeof Sites[number];
