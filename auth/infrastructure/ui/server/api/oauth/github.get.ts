export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true
    },
    async onSuccess(event, { user, tokens }) {
        const oneHourMs = 1000 * 60 * 60;
        const thirtyDaysMs = 1000 * 60 * 60 * 24 * 30;
        const expiresAt = new Date(Date.now() + oneHourMs);

        // Guardar sesión en servidor (usa la función existente en el proyecto)
        await setUserSession(event, {
            user: {
                githubId: user.id,
                githubEmail: user.email
            },
            lastLoggedIn: new Date(),
            expiresAt
        });
        return sendRedirect(event, '/')
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/')
    },
})
