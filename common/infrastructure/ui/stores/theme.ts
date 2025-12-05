import {defineStore} from 'pinia';
import {ref, watch} from 'vue';
import {useTheme} from 'vuetify';

export const useThemeStore = defineStore('theme', () => {
    const theme = useTheme();
    const cookie = useCookie('theme');
    const initialTheme = cookie.value?.darkMode ? 'dark' : 'light';
    const darkMode =  initialTheme === 'dark' ? ref(theme.global.current.value.dark) : ref(theme.global.current.value.ligth);
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
