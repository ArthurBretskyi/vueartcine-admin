<template>
    <article class="snack-card" :class="{ 'snack-card--disabled': !snack.available }">
        <div class="snack-card__image">
            <img :src="snack.image.main" :alt="snack.name[currentLocale]" loading="lazy" />
        </div>

        <div class="snack-card__content">
            <h3 class="snack-card__title">
                {{ snack.name[currentLocale] }}
            </h3>

            <p class="snack-card__description">
                {{ snack.description.short[currentLocale] }}
            </p>

            <div class="snack-card__meta">
                <span v-if="snack.specs?.volumeMl">
                    {{ snack.specs.volumeMl }} ml
                </span>

                <span v-if="snack.specs?.weightG">
                    {{ snack.specs.weightG }} g
                </span>

                <span v-if="snack.specs?.abv">
                    {{ snack.specs.abv }}%
                </span>
            </div>

            <div class="snack-card__footer">
                <span class="snack-card__price">
                    {{ snack.price }} ₴
                </span>

                <button class="snack-card__button" :disabled="!snack.available" @click="addToCart">
                    {{ snack.available ? $t('buttons.addToCart') : $t('common.unavailable') }}
                </button>
            </div>
        </div>
    </article>
</template>
  
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    snack: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['add-to-cart'])

const { locale } = useI18n()
const currentLocale = computed(() => locale.value)

function addToCart() {
    emit('add-to-cart', {
        id: props.snack.id,
        price: props.snack.price,
        name: props.snack.name,
        image: props.snack.image,
        type: props.snack.type,
    })
}
</script>
  
<style lang="scss" scoped>
.snack-card {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(61, 244, 70, 0.5);
    transition: transform 0.3s ease, opacity 0.3s ease;
    cursor: pointer;
    padding: 15px;

    &:hover {
        transform: translateY(-6px);
    }

    &--disabled {
        opacity: 0.55;
        pointer-events: none;
    }

    &__image {
        height: 320px;
        width: 100%;

        img {
            width: 100%;
            height: 100%;
            border-radius: 1rem;
            object-fit: cover;
        }
    }

    &__content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
    }

    &__title {
        font-size: 1.1rem;
        font-weight: 600;
    }

    &__description {
        font-size: 0.9rem;
        opacity: 0.85;
    }

    &__meta {
        display: flex;
        gap: 12px;
        font-size: 0.85rem;
        opacity: 0.7;
    }

    &__footer {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }

    &__price {
        font-size: 1.1rem;
        font-weight: 600;
    }

    &__button {
        padding: 8px 14px;
        border-radius: 20px;
        background: none;
        color: $primary-color;
        box-shadow: 0 2px 8px rgba(61, 244, 70, 0.5);
        cursor: pointer;
        transition: all 0.5s ease-in-out;

        &:hover {
            background: $decor-color-third;

        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
}
</style>
  