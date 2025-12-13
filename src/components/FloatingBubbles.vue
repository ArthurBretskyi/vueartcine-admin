<template>
    <div class="floating-bubbles">
        <div class="left">
            <!-- Флаги -->
            <div v-for="(flag, index) in flags" :key="index" class="bubble bubble--flag" :class="`bubble--${flag.lang}`"
                @click="switchLanguage(flag.lang)" ref="flagRefs">
                <img :src="flag.src" :alt="flag.lang" />
            </div>

            <!-- Telegram / Viber -->
            <div class="bubble bubble--messenger" ref="messengerRef" @click="openMessenger">
                <font-awesome-icon :icon="currentMessenger" />
            </div>
        </div>

        <div class="right">
            <div v-for="(s, i) in socials" :key="i" class="bubble bubble--social" ref="socialRefs" @click="openSocial(s)">
                <font-awesome-icon :icon="s.icon" />
            </div>
        </div>


    </div>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLocales } from '@/i18n/useLocales'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTelegram, faViber } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)
library.add(faTelegram, faViber)

import ukFlag from '@/assets/svg/flags/uk.svg'
import gbFlag from '@/assets/svg/flags/gb.svg'

const { locale, setLocale } = useLocales()

const flags = [
    { lang: 'uk', src: ukFlag },
    { lang: 'en', src: gbFlag }
]

function switchLanguage(lang) {
    setLocale(lang)
}

const messengerIcons = ['fa-brands fa-telegram', 'fa-brands fa-viber']
const currentMessenger = ref(messengerIcons[0])
let messengerInterval = null

function openMessenger() {
    if (currentMessenger.value.includes('telegram')) {
        window.open('https://t.me/', '_blank')
    } else {
        window.open('viber://chat?number=', '_blank')
    }
}

const socials = [
    { icon: ['fab', 'facebook'], url: "https://www.facebook.com/" },
    { icon: ['fab', 'instagram'], url: "https://www.instagram.com/" },
    { icon: ['fab', 'x-twitter'], url: "https://twitter.com/" }
]

function openSocial(s) {
    if (!s.url) return
    window.open(s.url, '_blank')
}


// 🌊 GSAP refs
const flagRefs = ref([])
const messengerRef = ref(null)
const socialRefs = ref([])


onMounted(() => {
    // Початкова анімація появи
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 1 } })
    tl.from('.bubble', { opacity: 0, scale: 0.5, stagger: 0.2 })

    // Органічне плавання
    flagRefs.value.forEach((el, i) => {
        gsap.to(el, {
            y: `random(-15, 15)`,
            x: `random(-10, 10)`,
            duration: 3 + Math.random() * 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
        })
    })

    gsap.to(messengerRef.value, {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        duration: 4 + Math.random() * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
    })
    gsap.to(socialRefs.value, {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        duration: 4 + Math.random() * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
    })

    // ScrollTrigger рух при скролі
    gsap.to('.floating-bubbles', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
        },
    })

    // Зміна іконки месенджера
    messengerInterval = setInterval(() => {
        currentMessenger.value =
            currentMessenger.value.includes('telegram')
                ? messengerIcons[1]
                : messengerIcons[0]
    }, 3500)

    // 🧲 Ефект магнітного поля
    const allBubbles = [...flagRefs.value, messengerRef.value, ...socialRefs.value]
    const radius = 150 // пікселі чутливості
    const strength = 20 // наскільки сильно відхиляється

    const handleMouseMove = (e) => {
        allBubbles.forEach((bubble) => {
            const rect = bubble.getBoundingClientRect()
            const bubbleX = rect.left + rect.width / 2
            const bubbleY = rect.top + rect.height / 2
            const dx = e.clientX - bubbleX
            const dy = e.clientY - bubbleY
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < radius) {
                const angle = Math.atan2(dy, dx)
                const offsetX = -Math.cos(angle) * (strength * (1 - distance / radius))
                const offsetY = -Math.sin(angle) * (strength * (1 - distance / radius))

                gsap.to(bubble, {
                    x: offsetX,
                    y: offsetY,
                    duration: 0.4,
                    ease: 'sine.out',
                })
            } else {
                gsap.to(bubble, { x: 0, y: 0, duration: 1.5, ease: 'sine.inOut' })
            }
        })
    }

    window.addEventListener('mousemove', handleMouseMove)

    onBeforeUnmount(() => {
        clearInterval(messengerInterval)
        window.removeEventListener('mousemove', handleMouseMove)
    })
})
</script>

  
<style lang="scss" scoped>
.floating-bubbles {
    position: fixed;
    bottom: 1.5rem;
    left: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: space-around;
    // flex-direction: column;
    align-items: center;
    gap: 1rem;
    z-index: 50;
    pointer-events: auto;

    .left,
    .right {
        display: flex;
        flex: 0 1 50%;
        gap: 25px;
    }

    .right {
        justify-content: flex-end;
        margin-right: 2rem;
    }

    .bubble {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(6px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.4s ease, box-shadow 0.4s ease;
        will-change: transform;

        &:hover {
            transform: scale(1.12);
            box-shadow: 0 0 12px rgba(61, 244, 70, 0.5);
        }

        &--flag img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }

        svg {
            width: 30px;
            height: 30px;

        }

        &--social {
            font-size: 1.6rem;
            color: #fff;
            background: linear-gradient(145deg, #7a4fff, #4f9fff);
            box-shadow: 0 0 10px rgba(124, 86, 255, 0.4);
        }

        &--messenger {
            font-size: 1.6rem;
            color: #fff;
            background: linear-gradient(145deg, #7a4fff, #4f9fff);
            box-shadow: 0 0 10px rgba(124, 86, 255, 0.4);
        }


    }
}
</style>
  