<template>
    <section class="snacks-view">
        <div class="snacks-view__container">

            <header class="snacks-view__header">
                <h1 class="snacks-view__title">
                    {{ $t('pages.snacks.title') }}
                </h1>
            </header>

            <!-- Loading -->
            <div v-if="isLoading" class="snacks-view__state">
                {{ $t('common.loading') }}
            </div>

            <!-- Error -->
            <div v-else-if="hasError" class="snacks-view__state error">
                {{ errorMessage?.message || $t('common.error') }}
            </div>

            <!-- Empty -->
            <div v-else-if="!snacks.length" class="snacks-view__state">
                {{ $t('pages.snacks.empty') }}
            </div>

            <!-- Grid -->
            <div v-else class="snacks-view__grid">
                <SnackCardComponent v-for="snack in snacks" :key="snack.id" :snack="snack" @add-to-cart="handleAddToCart" />
            </div>
        </div>
    </section>
</template>
  
<script setup>
import { onMounted, computed } from 'vue'
import { useSnacksStore } from '@/stores/snacks'
import { useGeneralStore } from '@/stores/general'
import SnackCardComponent from '@/components/SnackCardComponent.vue'

const snacksStore = useSnacksStore()
const generalStore = useGeneralStore()

const snacks = computed(() => snacksStore.getItemsList)

const { isLoading, hasError, errorMessage } = generalStore

onMounted(async () => {
    await snacksStore.loadItemsList()
})

function handleAddToCart(snackPayload) {
    console.log('Add to cart:', snackPayload)
}
</script>
  
<style lang="scss" scoped>
.snacks-view {
    padding: 32px 0;

    &__header {
        margin-bottom: 24px;
    }

    &__title {
        font-size: 2rem;
        font-weight: 700;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 24px;
    }

    &__state {
        padding: 40px 0;
        text-align: center;
        opacity: 0.75;

        //   &.error {
        //     // color: $error-color;
        //   }
    }
}
</style>
  