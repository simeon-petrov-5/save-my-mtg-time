<script setup lang="ts">
const foundData = ref<any>({ deckbox: [], moxfield: [] });
const form = reactive({
  deckboxIds: "444030\n1338250",
  moxfieldIds: "Izk3m_jdYUSohXfF62s8eA",
  cards: "Negate\nAbhorrent Overlord\nElspeth, Sun's Champion",
});

const transformIds = (string: string) => string.split("\n").filter(Boolean);

const onSubmit = async () => {
  const body = {
    deckbox: transformIds(form.deckboxIds),
    moxfield: transformIds(form.moxfieldIds),
    cards: form.cards.split("\n"),
  };

  const { data } = await useFetch("/api/mtg", { method: "post", body });
  console.log(data);
  foundData.value = data.value ?? {};
};
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="grid grid-cols-1 gap-6 max-w-3xl mx-auto"
  >
    <div class="grid grid-cols-2 gap-6">
      <label for="deckboxIds">
        Deckbox User IDs
        <textarea
          v-model="form.deckboxIds"
          name="deckboxIds"
          id="deckboxIds"
          cols="30"
          rows="5"
          resize="none"
          placeholder="List each ID on a new row ..."
          class="resize-none"
          required
        ></textarea>
      </label>

      <label for="moxfieldIds">
        Moxfield Decks IDs
        <textarea
          v-model="form.moxfieldIds"
          name="moxfieldIds"
          id="moxfieldIds"
          cols="30"
          rows="5"
          resize="none"
          placeholder="List each ID on a new row ..."
          class="resize-none"
        ></textarea>
      </label>
    </div>

    <div>
      <label for="cards">
        Card names
        <textarea
          v-model="form.cards"
          name="cards"
          id="cards"
          cols="30"
          rows="10"
          resize="none"
          placeholder="List each card name on a new row ..."
          class="resize-none"
          required
        ></textarea>
      </label>
    </div>
    <button class="w-48 mx-auto" type="submit">Submit</button>
  </form>

  <h2>Found:</h2>
  <ul>
    <li v-for="user of foundData.deckbox" :key="user.userId">
      <span>{{ user.userId }}</span>

      <ul>
        <li v-for="card in user.cards" :key="card.id">{{ card.name }}</li>
      </ul>
    </li>
  </ul>

  <ul>
    <li v-for="user of foundData.moxfield" :key="user.userId">
      <span>{{ user.userId }}</span>

      <ul>
        <li v-for="card in user.cards" :key="card.id">{{ card.name }}</li>
      </ul>
    </li>
  </ul>
</template>

<style scoped></style>
