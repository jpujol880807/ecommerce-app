import {defineNuxtRouteMiddleware, navigateTo} from 'nuxt/app';
import {useUserSession} from '../../../../.nuxt/imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = useUserSession();
  if (!session.loggedIn.value) {
    return navigateTo('/login');
  }
});
