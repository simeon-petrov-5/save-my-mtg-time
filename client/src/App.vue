<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ReqBody } from "../../api/src/models/ReqBody";
import { CardsResp } from "../../api/src/models/CardsResp";

const form = reactive({
  sources: [
    "https://www.moxfield.com/decks/C7cMWK5PzE6jbVuTFh916g",
    "https://www.moxfield.com/decks/0Vqrb1PCT06gr7hsq-4u0A",
    "https://deckbox.org/sets/2205627?s=i&o=d"
  ].join('\n'),
  cards: [
    "Negate",
    "Abhorrent Overlord",
    "Elspeth, Sun's Champion",
    "Don't Move",
    "Dragonlord's Servant"
  ].join('\n'),
});
const searchData = ref<CardsResp | null>(null)

const stringToArr = (string: string) => string.split("\n").filter(Boolean);

const onSubmit = async () => {
  const body: ReqBody = {
    sources: stringToArr(form.sources),
    cards: stringToArr(form.cards),
  };

  const resp = await fetch("http://0.0.0.0:8888/api/cards", { method: "POST", body: JSON.stringify(body) });
  const data = await resp.json();
  console.log(data);
  searchData.value = data ?? {};
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-6 max-w-3xl w-full mx-auto">
    <div>
      <label for="sourcess" class="w-full">
        Links to Deckbox or Moxfield decks and pages
      </label>
      <textarea v-model="form.sources" name="sourcess" id="sourcess" cols="30" rows="5" resize="none"
        placeholder="List each ID on a new row ..." class="resize-none w-full"></textarea>
    </div>


    <div>
      <label for="cards">
        Card names
        <textarea v-model="form.cards" name="cards" id="cards" cols="30" rows="10" resize="none"
          placeholder="List each card name on a new row ..." class="resize-none" required></textarea>
      </label>
    </div>
    <button class="w-48 mx-auto" type="submit">Submit</button>
  </form>

  <template v-if="searchData">
    <h2>These cards were found:</h2>

    <article v-for="(cards, sourceLink) in searchData">
      <h2>{{ sourceLink }}</h2>
      <ul>
        <li v-for="card in cards" :key="card.id">{{ card.name }}</li>
      </ul>
    </article>
  </template>
</template>