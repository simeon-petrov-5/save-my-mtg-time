# Save-My-MTG-Time (WIP 🏗️)

If you're a Magic the Gathering player and fan you know the feeling of always having a "wishlist" and consistently opening multiple personal decks/lists to find and buy cards. I found myself in the same ongoing loop of searching the same cards in multiple pages, that's why I've created "Save-My-MTG-Time".

Save-My-MTG-Time is a simple app to help you with finding cards in multiple personal decks/lists from moxfield and deckbox. For now you can clone/download the app and run it locally with `bun` to find your favourite cards in multiple moxfield or deckbox lists.


## Starting the project
1) Install dependencies for each project (`/api` & `/client`)

```
cd ./api && bun install

cd ./client && bun install
```

2) Start the project under DEV mode
You can again go in each project's directory and run `bun dev`

For "easier" start you can simply open 2 terminals at the root of the project and run these two commands (each in a different terminal) and start the project withoud `cd` to the folders.

```
bun api
- - -
bun client
```

## Client
The client is a very simple and small `Vue` SPA with `TypeScript` & `PicoCSS` (+`SCSS`). For now the plans for the UI are pretty small - it should be very minimal and easy to use. The current features we support are:
- [x] Passing a list of Moxfield/Deckbox links
- [x] Passing a list of cards to search
- [x] Showing feedback to the user for the progress of crawling/fetching if it takes more than 3 sec.
- [x] Showing all matched cards from the provided links
- [x] Showing the card name, quantity from the user (only informative)
- [x] You can fetch Scryfall Prices, see them in both Eur and Usd and get the total sum for all cards (ignoring the quantities!)

## API
The API project is built on `Bun` with `Elysia` and `TypeScript`. Features:
- [X] Scrapping Moxfield and Deckbox pages/data
- [X] Server-Side-Events for when we scrape bigger chunks of data and it takes more than 3 sec (triggered by the client project)
- [X] Caching the fetched data for a certain time so we're good citizens and we don't wreak havok upon other people's services
- [X] Logging via pino
- [X] Validate the API's responses for any changes via [TypeBox](https://elysiajs.com/validation/primitive-type)

## Future updates
- [ ] Creating a user profile so you can create, save and manage wishlists
- [ ] Notifications in the UI
- [ ] Better error handling/catching if an extractor fails
- [ ] Support for Archidekt