import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#6C63FF',         // indigo-vibrant
                    primaryVariant: '#5048C8',
                    secondary: '#00D4FF',       // aqua
                    secondaryVariant: '#00A7C4',
                    surface: '#FFFFFF',
                    background: '#FAFBFF',
                    error: '#E53935',
                    success: '#4CAF50',
                    warning: '#FFB300',
                    accent: '#FF6584',          // coral accent
                    onPrimary: '#FFFFFF',
                    onSecondary: '#000000',
                    onBackground: '#0F1724',
                    onSurface: '#0F1724',
                },
            },
            dark: {
                colors: {
                    primary: '#A28BFF',         // softer purple for dark
                    primaryVariant: '#7E63FF',
                    secondary: '#33E8FF',       // brighter aqua
                    secondaryVariant: '#11B7D6',
                    surface: '#24232A',
                    background: '#0F1020',
                    error: '#FF6B6B',
                    success: '#66D19E',
                    warning: '#FFB86B',
                    accent: '#FF8DAA',          // warmer accent for dark
                    onPrimary: '#0F1020',
                    onSecondary: '#0F1020',
                    onBackground: '#FFFFFF',
                    onSurface: '#FFFFFF',
                },
            },
        },
    },
})
