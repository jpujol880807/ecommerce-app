import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useUserSession } from '#imports';

export default defineNuxtRouteMiddleware(async () => {
    const session = useUserSession();

    if (session.loggedIn.value) {
        // Redirect authenticated users to the home page
        return navigateTo('/');
    }
});
