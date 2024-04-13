<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import type { Card } from '../../../api/src/models/Card';
import type { ScryfallInfo } from '../utils/scryfall.ts';
import { fetchScryfallCollection } from '../utils/scryfall.ts';
import PhCalculator from '~icons/ph/calculator';
import Loader from './Loader.vue';

const props = defineProps<{ cards: Card[], sourceLink: string }>();
const { cards, sourceLink } = toRefs(props);

const priceData = ref<{ [k: string]: ScryfallInfo }>({});
const priceLoading = ref(false);
const priceEnabled = ref(false);

async function fetchScryfall() {
  priceLoading.value = true;
  try {
    const scryfallInfo = await fetchScryfallCollection(cards.value);
    priceData.value = scryfallInfo;
    priceEnabled.value = true;
  } finally {
    priceLoading.value = false
  }
}

const totalPrice = computed(() => {
  let eur = 0;
  let usd = 0;
  for (const card in priceData.value) {
    const eurPrice = Number(priceData.value[card].eur)
    eur += Number.isNaN(eurPrice) ? 0 : (eurPrice * 100);

    const usdPrice = Number(priceData.value[card].usd)
    usd += Number.isNaN(usdPrice) ? 0 : (usdPrice * 100);
  }
  return { eur: eur / 100, usd: usd / 100 }
})
</script>

<template>
  <article>
    <Transition>
      <div v-if="priceLoading" class="loadingOverlay">
        <Loader />
      </div>
    </Transition>
    <div class="head">
      <h2 class="title">
        <a :href="sourceLink.toString()" class="" target="_blank" rel="noopener noreferrer">{{ sourceLink }}</a>
      </h2>

      <VTooltip placement="top-center">
        <button :disabled="priceEnabled" class="scryfallBtn secondary" @click="fetchScryfall">
          <PhCalculator />
        </button>

        <template #popper>
          <span class="ttPadding">Get Scryfall prices</span>
        </template>
      </VTooltip>
    </div>
    <div class="body" :class="{ 'priceEnabled': priceEnabled }">
      <template v-for="card in cards" :key="card.id">
        <span>{{ card.count }}x</span>
        <VTooltip placement="top-start">
          <p class="name">{{ card.name }}</p>

          <template #popper>
            <div class="imgPreview">
              <img class="img" :src="card.imgUrl" alt="">
            </div>
          </template>
        </VTooltip>

        <template v-if="priceEnabled">
          <a :href="priceData[card.name]?.cardmarket ?? ''" target="_blank" class="price">
            {{ priceData[card.name]?.eur ?? '---' }} €
          </a>
          <a :href="priceData[card.name]?.tcgplayer ?? ''" target="_blank" class="price">{{ priceData[card.name]?.usd ??
        '---' }} $</a>
        </template>
      </template>

      <template v-if="priceEnabled" class="totalPrice">
        <p class="totalPriceLabel">Total price
        </p>
        <span class="price">{{ totalPrice.eur }} €</span>
        <span class="price">{{ totalPrice.usd }} $</span>

        <p class="info">
          🖐️ The prices are a rough approximation based on Scryfall's data and represent the price of a <b>single</b> card! The
          quantities from
          the user are ignored and should be used only as a rough indication if you need more than 1 card.</p>
      </template>
    </div>
  </article>
</template>

<style>
.v-popper {
  display: inline-block;
}

.v-popper--theme-tooltip .v-popper__inner {
  padding: 0 !important;
  border-radius: 12px;
}

.v-popper--theme-tooltip .ttPadding {
  padding: calc(var(--pico-form-element-spacing-vertical) / 6) calc(var(--pico-form-element-spacing-horizontal) / 4);
}


.imgPreview {
  border-radius: 12px;
  overflow: hidden;
  width: 210px;
  height: 292px;
  background-image: url('/mtg-back.webp');
  background-position: center;
  background-size: cover;
}

.imgPreview .img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<style lang="scss" scoped>
article {
  position: relative;
  overflow: hidden;

  * {
    margin: 0;
  }

  .loadingOverlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--pico-contrast-focus);
    backdrop-filter: blur(4px);
    font-size: 1.25rem;
  }

  .head {
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    margin-bottom: var(--pico-typography-spacing-vertical);

    .title {
      font-size: 0.875rem;
      line-height: 1.25rem;
      margin: 0;
    }

    .scryfallBtn {
      padding: calc(var(--pico-form-element-spacing-vertical) / 6) calc(var(--pico-form-element-spacing-horizontal) / 4);
    }

  }

  .body {
    display: grid;
    gap: 0.5rem 0.75rem;
    grid-template-columns: auto 1fr auto auto;
    padding: 0;



    &.priceEnabled :deep(.v-popper) {
      grid-column: span 1;
    }

    :deep(.v-popper) {
      grid-column: span 3;
    }

    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .price {
      text-align: right;
    }

    .totalPriceLabel {
      grid-column: span 2;
    }

    .info {
      grid-column: span 4;
      font-size: 0.75rem;
      font-style: italic;
    }
  }
}
</style>
