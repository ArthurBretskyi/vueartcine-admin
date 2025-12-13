<template>
    <div class="wrapper">
        <!-- <HeaderComponent v-if="!['Register', 'Login'].includes(route.name)" /> -->
        <HeaderComponent />
        <main class="main">
            <router-view />
        </main>
        <FloatingBubbles />
        <FooterComponent />
    </div>
</template>

<script setup>
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import FloatingBubbles from '@/components/FloatingBubbles.vue';
import FooterComponent from '@/components/FooterComponent.vue';
</script>
  
<style lang="scss">
.wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: clip;
}

.wrapper>main {
    flex-grow: 1;
}
</style>
  