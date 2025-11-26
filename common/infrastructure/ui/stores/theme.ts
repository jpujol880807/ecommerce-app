import {defineStore} from 'pinia';
import {ref, watch} from 'vue';
import {useTheme} from 'vuetify';

export const useThemeStore = defineStore('theme', () => {
    const theme = useTheme();
    const darkMode = ref(theme.global.current.value.dark);

    watch(darkMode, (newValue) => {
        theme.change(newValue ? 'dark' : 'light');
    });

    return {
        darkMode
    };
}, {
    persist: true
});
