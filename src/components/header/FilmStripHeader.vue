<template>
    <div class="film-strip-header">
        <div class="film-strip-header__mask">
            <div class="film-strip-header__track">
                <!-- Frames (looped twice for infinite animation) -->
                <div v-for="(item, index) in repeatedFrames" :key="index" class="film-frame">
                    <div v-if="item.type === 'text'" class="film-frame__text">
                        {{ $t(item.value) }}
                    </div>

                    <div v-else class="film-frame__img">
                        <img :src="item.value" alt="film-icon" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "FilmStripHeader",

    props: {
        icons: {
            type: Object,
            required: false,
            default: () => ({
                ring: "@/assets/images/lord of the rings/ring.png", // тимчасово, замінимо на твоє PNG кільце
            }),
        },
    },

    computed: {
        frames() {
            return [
                { type: "text", value: "menu.nowInCinemas" },
                { type: "img", value: this.icons.ring },
                { type: "text", value: "menu.comingSoon" },
                { type: "img", value: this.icons.ring },
                { type: "text", value: "menu.buyPopcorn" },
                { type: "img", value: this.icons.ring },
                { type: "text", value: "menu.cinemas" },
                { type: "img", value: this.icons.ring },
            ];
        },

        repeatedFrames() {
            // множимо список щоб анімація йшла без стрибків
            return [...this.frames, ...this.frames];
        },
    },
};
</script>

<style lang="scss" scoped>
.film-strip-header {
    width: 100%;
    overflow: hidden;
    padding: 10px 0;
    background: #0e0e0e;

    display: flex;
    justify-content: center;

    .film-strip-header__mask {
        width: 100%;
        overflow: hidden;
        position: relative;
        border-top: 10px solid #000;
        border-bottom: 10px solid #000;

        /* perforation top */
        &::before {
            content: "";
            position: absolute;
            top: -10px;
            left: 0;
            width: 100%;
            height: 10px;
            background: repeating-linear-gradient(to right,
                    #000 0,
                    #000 20px,
                    transparent 20px,
                    transparent 40px);
        }

        /* perforation bottom */
        &::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 10px;
            background: repeating-linear-gradient(to right,
                    #000 0,
                    #000 20px,
                    transparent 20px,
                    transparent 40px);
        }
    }

    .film-strip-header__track {
        display: flex;
        align-items: center;
        gap: 0;
        animation: filmMove 18s linear infinite;
    }

    /* Film Frame */
    .film-frame {
        min-width: 180px;
        height: 80px;
        background: rgba(255, 255, 255, 0.08);
        border: 2px solid #000;
        margin: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        backdrop-filter: blur(3px);

        &__text {
            font-size: 20px;
            color: #fff;
            text-transform: uppercase;
            white-space: nowrap;
        }

        &__img img {
            height: 60px;
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0 0 4px #f5c77a);
        }
    }

    @keyframes filmMove {
        0% {
            transform: translateX(0);
        }

        100% {
            transform: translateX(-50%);
        }
    }
}
</style>
