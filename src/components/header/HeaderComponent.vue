<template>
    <header ref="headerRef" class="header">
        <div class="header__container container">
            <!-- Ліва частина -->
            <div class="header__left">
                <BurgerMenu @toggle-menu="isMenuOpen = !isMenuOpen" />
                <NavigationMenu :isOpen="isMenuOpen" @close="isMenuOpen = false" />
            </div>

            <div class="header__center">
                <nav class="header__menu menu">
                    <ul class="menu__list">
                        <li><router-link @click="close" :to="{ name: 'NowInCinemas' }" class="menu__item">{{
                            $t('components.navigationMenu.nowInCinema')
                        }}</router-link></li>
                        <li><router-link @click="close" to="/soon" class="menu__item">{{
                            $t('components.navigationMenu.comingSoon')
                        }}</router-link></li>
                        <li><router-link @click="close" to="/popcorn" class="menu__item">{{
                            $t('components.navigationMenu.buyPopcornOnline')
                        }}</router-link></li>
                        <li><router-link @click="close" :to="{ name: 'MapView' }" class="menu__item">{{
                            $t('components.navigationMenu.cinemas')
                        }}</router-link></li>
                    </ul>
                </nav>
            </div>

            <!-- Права частина -->
            <div class="header__right">
                <LocationSelectorComponent @update:location="selectedLocation = $event" />
                <UserAuthComponent v-if="!user" />
                <UserDropDownComponent v-else />
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'
import { useAuthStore } from '@/stores/auth'

import BurgerMenu from '@/components/header/BurgerMenu.vue'
import NavigationMenu from '@/components/navigation/NavigationMenu.vue'
import LogoComponent from '@/components/header/LogoComponent.vue'
import UserDropDownComponent from '@/components/header/UserDropDownComponent.vue'
import LocationSelectorComponent from '@/components/header/LocationSelectorComponent.vue'
import UserAuthComponent from '@/components/header/UserAuthComponent.vue'


const authStore = useAuthStore()
const user = computed(() => authStore.getUser())

const isMenuOpen = ref(false)
const selectedLocation = ref(null)

const headerRef = ref(null)
onMounted(() => {
    gsap.from(headerRef.value, { opacity: 0, y: -30, duration: 1.2, ease: 'power2.out' })
})
</script>

<style lang="scss" scoped>
.header {
    color: #fff;
    padding: 1.2rem 0;
    background-color: transparent;
    box-shadow: 0 2px 8px rgba(61, 244, 70, 0.5);
    position: relative;
    z-index: 10;
    transition: all 2s ease-in-out;

    &__container {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
    }

    &__center {
        display: flex;
        justify-content: center;
    }

    &__menu {
        overflow: hidden;
        white-space: nowrap;
        position: relative;
    }

    .menu {

        &__list {
            display: flex;
            flex-wrap: wrap;
            column-gap: 40px;
            align-items: center;
            animation: marquee 20s linear infinite;

            &:hover {
                animation-play-state: paused;
            }
        }

        &__item {
            text-transform: uppercase;
            color: $primary-color;
            transition: color 0.5s ease-in-out;

            &:hover {
                color: $decor-color-third;
            }
        }

        @keyframes marquee {
            0% {
                transform: translateX(-100%);
            }

            100% {
                transform: translateX(100%);
            }
        }
    }

    &__right {
        display: flex;
        align-items: center;
        justify-self: end;
        gap: 1.5rem;
    }
}
</style>

  