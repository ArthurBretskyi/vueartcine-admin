<template>
    <div class="logo" ref="logoRef">
        <div class="logo__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="camera-svg">
                <!-- корпус -->
                <rect x="6" y="18" width="36" height="28" rx="3" ry="3" fill="currentColor" />
                <polygon points="50,24 58,20 58,44 50,40" fill="currentColor" />

                <!-- об'єктив -->
                <circle cx="24" cy="32" r="10" fill="none" stroke="$decor-color-first" stroke-width="2" />

                <!-- внутрішнє колесико -->
                <g class="lens" ref="lensRef">
                    <circle cx="24" cy="32" r="6" fill="$decor-color-first" opacity="0.5" />
                    <path d="M24 26 L26 28 L22 30 Z" fill="$decor-color-second" opacity="0.7" />
                    <path d="M24 38 L22 36 L26 34 Z" fill="$decor-color-second" opacity="0.7" />
                </g>
            </svg>
        </div>

        <div class="logo__text" ref="textRef">
            <span>VUE</span>
            <span class="highlight">ART</span>
            <span class="highlight-third">CINE</span>
        </div>

        <div class="light-beam" ref="beamRef"></div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const lensRef = ref(null)
const textRef = ref(null)
const beamRef = ref(null)

let intervalId

onMounted(() => {
    // Постійне обертання лінзи
    gsap.to(lensRef.value, {
        rotation: '+=360',
        transformOrigin: 'center',
        duration: 2,
        ease: 'linear',
        repeat: -1,
    })

    const playSequence = () => {
        const tl = gsap.timeline()

        // Початкове коротке блимання
        tl.to(beamRef.value, { opacity: 1, duration: 0.1 })
            .to(beamRef.value, { opacity: 0.3, duration: 0.1 })
            .to(beamRef.value, { opacity: 1, duration: 0.1 })
            .to(beamRef.value, { opacity: 0.4, duration: 0.1 })
            .to(beamRef.value, { opacity: 1, duration: 0.3 })
            // Промінь з’являється
            .to(beamRef.value, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            // Текст м’яко проявляється
            .to(
                textRef.value,
                {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power2.out',
                },
                '-=0.3'
            )
            // Потім усе трохи "засинає"
            .to(beamRef.value, { opacity: 0.6, duration: 1, delay: 1 })
            .to(textRef.value, { opacity: 0.7, duration: 1 }, '-=1')
            .to(beamRef.value, { scaleX: 0, duration: 0.8, ease: 'power1.in' })
    }

    // Запуск першого ефекту
    playSequence()

    // Повторюємо цикл кожні 6 секунд
    intervalId = setInterval(playSequence, 6000)
})

onUnmounted(() => clearInterval(intervalId))
</script>
  
<style lang="scss" scoped>
.logo {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: $text-color;
    overflow: visible;

    .logo__icon {
        width: 3rem;
        height: 3rem;
        color: $text-color;
        position: relative;
        z-index: 3;
    }

    .logo__text {
        display: flex;
        gap: 0.3rem;
        font-size: 1.8rem;
        font-weight: 700;
        letter-spacing: 1px;
        opacity: 0.5;
        filter: blur(2px);
        color: transparent;
        -webkit-text-stroke: 1px $decor-color-first;
        z-index: 3;

        .highlight {
            -webkit-text-stroke: 1px $decor-color-second;
        }

        .highlight-third {
            -webkit-text-stroke: 1px $decor-color-third;
        }
    }

    .light-beam {
        position: absolute;
        left: 2.8rem;
        top: -0.6rem;
        width: 20rem;
        height: 4rem;
        background: linear-gradient(to right,
                rgba($decor-color-first, 0.6),
                rgba($decor-color-first, 0.1),
                transparent);
        clip-path: polygon(0 20%, 100% 0%, 100% 100%, 0 80%);
        opacity: 0;
        transform: scaleX(0);
        transform-origin: left center;
        filter: blur(10px);
        pointer-events: none;
        z-index: 1;
    }
}
</style>
 
