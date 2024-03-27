export const urlExtractor = (url: string) => {
  const link = new URL(url);
  let pathToRemove = "";
  if (url.includes("moxfield.com")) {
    pathToRemove = "/decks/";
  } else if (url.includes("deckbox.org")) {
    pathToRemove = "/sets/";
  }
  return link.pathname.replace(pathToRemove, "");
};
