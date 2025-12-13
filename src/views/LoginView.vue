<template>
    <div class="login-modal" @click.self="closePopup">
        <div class="login-modal__content">
            <button class="login-modal__close" @click="closePopup">×</button>

            <h1 class="login-modal__title">{{ $t('pages.login.title') }}</h1>

            <p class="login-modal__text">
                {{ $t('pages.login.noAccount') }}
                <router-link class="login-modal__link" :to="{ name: 'Register' }">Register</router-link>
            </p>

            <form class="login-modal__form" @submit.prevent="handleLogin">
                <input v-model="form.email" type="email" :placeholder="$t('pages.login.email')" class="login-modal__input"
                    required />
                <input v-model="form.password" type="password" :placeholder="$t('pages.login.password')"
                    class="login-modal__input" required />

                <p v-if="localError" class="login-modal__error">{{ localError }}</p>
                <p v-if="hasError" class="login-modal__error">{{ $t('errors.smthWrong') }}</p>

                <button type="submit" class="login-modal__btn button">
                    {{ $t('buttons.submit') }}
                </button>
            </form>

            <!-- <div class="login-modal__divider">{{ $t('pages.login.or') }}</div> -->

            <button class="login-modal__btn login-modal__btn--google" @click="handleGoogleSignIn">
                {{ $t('pages.login.google') }}
            </button>

            <LoadingComponent v-if="isLoading" />
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useGeneralStore } from '@/stores/general'

import LoadingComponent from '@/components/LoadingComponent.vue'

const { t } = useI18n()
const router = useRouter()

const form = ref({
    email: '',
    password: '',
})

const localError = ref(null)
const authStore = useAuthStore()
const usersStore = useUsersStore()
const generalStore = useGeneralStore()

const { isLoading, hasError, generalApiOperation } = generalStore

const handleLogin = async () => {
    localError.value = null

    await generalApiOperation({
        operation: async () => {
            const user = await authStore.loginWithEmail(form.value.email, form.value.password)

            const exists = await usersStore.checkUserExists(user.uid)
            if (!exists) {
                localError.value = t('pages.login.user_not_found')
                await authStore.logout()
                return
            }

            await authStore.fetchUserRole(user.uid)
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const handleGoogleSignIn = async () => {
    localError.value = null

    await generalApiOperation({
        operation: async () => {
            const user = await authStore.loginWithGoogleAccount()
            const uid = user?.uid
            if (!uid) throw new Error('Google login failed')

            const exists = await usersStore.checkUserExists(uid)
            if (!exists) {
                const userData = {
                    uid,
                    email: user.email || '',
                    username: user.displayName || '',
                    firstName: '',
                    lastName: '',
                    createdAt: new Date().toISOString(),
                }
                await usersStore.addItemWithCustomId({ id: uid, data: userData })
            }

            await authStore.fetchUserRole(uid)
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const closePopup = () => router.push({ name: 'Home' })
</script>
  
<style lang="scss" scoped>
.login-modal {
    @include flex-center;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 10px;
    z-index: 1000;
    overflow-y: auto;

    &__content {
        background-color: rgba(0, 0, 0, 0.5);
        color: $primary-color;
        border: 3px solid $decor-color-third;
        padding: 1rem 3rem;
        border-radius: 1rem;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        position: relative;
        animation: fadeIn 0.3s ease;
    }

    &__close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: $text-color;
        cursor: pointer;
    }

    &__title {
        text-align: center;
        margin-bottom: 1rem;
    }

    &__text {
        text-align: center;
        margin-bottom: 1rem;
        color: $text-color;
    }

    &__link {
        color: $decor-color-first;
        font-size: 18px;
        font-weight: bold;
        margin-left: 0.25rem;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    &__input {
        padding: 0.4rem;
        border: 1px solid $decor-color-third;
        border-radius: 0.5rem;
        color: $text-color;

        &::placeholder {
            font-size: .875rem;
            color: $primary-color;
        }
    }

    &__error {
        color: red;
        font-size: 0.875rem;
        text-align: center;
    }

    &__btn {
        width: 100%;
        margin-top: 1rem;
        background-color: transparent;
        color: $decor-color-third;
        border: 1px solid transparent;
        padding: 10px 20px;
        transition: all 0.5s ease-in-out;

        &:hover {
            border: 1px solid $decor-color-third;
            color: $primary-color;
        }

        &--google {
            border: none;
            color: #fff;

            &:hover {
                color: $decor-color-first;
                border: none;
            }
        }
    }

    &__divider {
        text-align: center;
        margin: 1rem 0;
        color: $text-color;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
  