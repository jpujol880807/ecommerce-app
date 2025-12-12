import {defineStore} from 'pinia';
import {ref, watch} from 'vue';
import {useTheme} from 'vuetify';

export const useThemeStore = defineStore('theme', () => {
    const theme = useTheme();
    const cookie = useCookie<{darkMode: string} | null>('theme');
    const initialTheme = cookie.value?.darkMode ? 'dark' : 'light';
    const darkMode =  ref(initialTheme === 'dark');
    theme.change(initialTheme);
    watch(darkMode, (newValue) => {
        theme.change(newValue ? 'dark' : 'light');
    });

    return {
        darkMode
    };
}, {
    persist: {
        storage: piniaPluginPersistedstate.cookies(),
    }
});
