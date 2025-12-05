import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#6200EE',
                    primaryVariant: '#3700B3',
                    secondary: '#03DAC6',
                    secondaryVariant: '#018786',
                    surface: '#F5F5F7',
                    background: '#FDFDFD',
                    error: '#B00020',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    onPrimary: '#FFFFFF',
                    onSecondary: '#000000',
                    onBackground: '#000000',
                    onSurface: '#000000',
                },
            },
            dark: {
                colors: {
                    primary: '#BB86FC',       // lighter purple for dark mode
                    primaryVariant: '#3700B3',
                    secondary: '#03DAC6',
                    secondaryVariant: '#03DAC6',
                    background: '#332940',    // standard Material dark background
                    surface: '#423E4F',
                    error: '#CF6679',
                    success: '#81C784',       // lighter green for dark mode
                    warning: '#FFB74D',       // softer amber for dark mode
                    onPrimary: '#000000',
                    onSecondary: '#000000',
                    onBackground: '#FFFFFF',
                    onSurface: '#FFFFFF',
                },
            },
        },
    },
})
