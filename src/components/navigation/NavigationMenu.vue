<template>
    <div v-if="isOpen" class="nav-menu">
        <div class="nav-menu__backdrop" @click="close" />

        <transition name="panel-slide" appear>
            <div class="nav-menu__panel" v-if="isOpen" ref="panel">
                <button class="close-btn" @click="close">✕</button>

                <router-link to="/" class="header__logo">
                    <LogoComponent />
                </router-link>

                <ul class="nav-menu__list">
                    <li><router-link @click="close" :to="{ name: 'NowInCinemas' }">{{
                        $t('components.navigationMenu.nowInCinema')
                    }}</router-link></li>
                    <li><router-link @click="close" to="/soon">{{ $t('components.navigationMenu.comingSoon')
                    }}</router-link></li>
                    <li><router-link @click="close" to="/popcorn">{{ $t('components.navigationMenu.buyPopcornOnline')
                    }}</router-link></li>
                    <li><router-link @click="close" :to="{ name: 'MapView' }">{{ $t('components.navigationMenu.cinemas')
                    }}</router-link></li>

                    <li class="nav-menu__auth">
                        <UserAuthComponent @close-menu="close" />
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import UserAuthComponent from '@/components/header/UserAuthComponent.vue'
import LogoComponent from '@/components/header/LogoComponent.vue'


const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

const panel = ref(null)

function close() {
    emit('close')
}

function handleClickOutside(e) {
    if (panel.value && !panel.value.contains(e.target)) close()
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style lang="scss" scoped>
/* =============================
   БАЗОВЕ — як CityCinemaOverlay
   ============================= */
.nav-menu {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-start;
}

.nav-menu__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(3px);
    opacity: 1;
    transition: opacity 0.5s ease;
    z-index: 200;
}

/* ПАНЕЛЬ */
.nav-menu__panel {
    position: relative;
    z-index: 2010;
    width: 30%;
    height: 100vh;
    background: $background-color;
    box-shadow: 2px 0 10px rgba(61, 244, 70, 0.25); // дзеркальна тінь
    padding: 2rem;
    overflow-y: auto;
}

/* Хрестик */
.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem; // ← теж дзеркально
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: $text-color;
    transition: color 0.3s ease;

    &:hover {
        color: $decor-color-first;
    }
}

/* =============================
   Анімація (адаптована)
   ============================= */
.panel-slide-enter-from {
    transform: translateX(-24px); // ← анімація зліва
    opacity: 0;
}

.panel-slide-enter-active {
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
}

.panel-slide-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.panel-slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.panel-slide-leave-active {
    transition: transform 0.6s ease, opacity 0.6s ease;
}

.panel-slide-leave-to {
    transform: translateX(-16px);
    opacity: 0;
}

/* =============================
   Контент
   ============================= */
.nav-menu__list {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.3rem;

    a {
        font-size: 1.2rem;
        color: $primary-color;
        text-decoration: none;
        transition: 0.5s ease-in-out;

        &:hover {
            color: $decor-color-third;
        }
    }
}
</style>
