<template>
    <div class="register-modal" @click.self="closePopup">
        <div class="register-modal__content">
            <button class="register-modal__close" @click="closePopup">×</button>

            <h1 class="register-modal__title">{{ $t('pages.register.title') }}</h1>

            <p class="register-modal__text">
                {{ $t('pages.register.alreadyHaveAccount') }}
                <router-link class="register-modal__link" :to="{ name: 'Login' }">Login</router-link>
            </p>

            <form class="register-modal__form" @submit.prevent="handleRegister">
                <input v-model="form.firstName" :placeholder="$t('pages.register.firstName')" class="register-modal__input"
                    required />
                <input v-model="form.lastName" :placeholder="$t('pages.register.lastName')" class="register-modal__input"
                    required />
                <input v-model="form.email" type="email" :placeholder="$t('pages.register.email')"
                    class="register-modal__input" required />
                <input v-model="form.password" type="password" :placeholder="$t('pages.register.password')"
                    class="register-modal__input" required />
                <input v-model="form.confirmPassword" type="password" :placeholder="$t('pages.register.confirmPassword')"
                    class="register-modal__input" required />

                <p v-if="localError" class="register-modal__error">{{ localError }}</p>
                <p v-if="hasError" class="register-modal__error">{{ $t('errors.smthWrong') }}</p>

                <button type="submit" class="register-modal__btn button">
                    {{ $t('buttons.submit') }}
                </button>
            </form>

            <!-- <div class="register-modal__divider">{{ $t('pages.register.or') }}</div> -->

            <button class="register-modal__btn register-modal__btn--google" @click="handleGoogleSignIn">
                {{ $t('pages.register.google') }}
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
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const localError = ref(null)
const authStore = useAuthStore()
const usersStore = useUsersStore()
const generalStore = useGeneralStore()

const { isLoading, hasError, generalApiOperation } = generalStore

const handleRegister = async () => {
    localError.value = null
    if (form.value.password !== form.value.confirmPassword) {
        localError.value = t('errors.passwords_not_match')
        return
    }

    await generalApiOperation({
        operation: async () => {
            const createdUser = await authStore.registerWithEmail(form.value.email, form.value.password)
            const userData = {
                uid: createdUser.uid,
                email: form.value.email,
                username: form.value.username,
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                role: 'user',
                createdAt: new Date().toISOString(),
                permissions: { isAdmin: false },
            }
            await usersStore.addItemWithCustomId({ id: createdUser.uid, data: userData })
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const handleGoogleSignIn = async () => {
    localError.value = null
    await generalApiOperation({
        operation: async () => {
            const userCredential = await authStore.loginWithGoogleAccount()
            const user = userCredential
            const exists = await usersStore.checkUserExists(user.uid)
            if (!exists) {
                await usersStore.addItemWithCustomId({
                    id: user.uid,
                    data: {
                        uid: user.uid,
                        email: user.email,
                        username: user.displayName,
                        firstName: '',
                        lastName: '',
                        role: 'user',
                        createdAt: new Date().toISOString(),
                        permissions: { isAdmin: false },
                    },
                })
            }
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const closePopup = () => router.push({ name: 'Home' })
</script>
  
<style lang="scss" scoped>
.register-modal {
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

    // &__divider {
    //     text-align: center;
    //     margin: 1rem 0;
    //     color: $text-color;
    // }
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
  