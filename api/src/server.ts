import app from "./app";


const PORT = 8888;

app.listen(PORT, () => {
  console.info(`

  -----------------------------------------------------------

  Save My MTG Time started listening on port ${PORT}

  -----------------------------------------------------------
  
  `);
});