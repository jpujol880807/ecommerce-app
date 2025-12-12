<!-- auth/infrastructure/ui/pages/login.vue -->
<template>
  <div class="auth-bg">
    <div class="blobs" aria-hidden="true">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="blob b3"></div>
    </div>

    <v-row class="d-flex align-center justify-center fill-height px-0">
      <v-col cols="12" sm="10" md="9" lg="7">
        <v-card class="glass-card elevation-12">
          <div class="card-grid">
            <div class="promo-panel">
              <div class="promo-inner">
                <v-icon size="44" class="promo-icon">mdi-storefront</v-icon>
                <h2 class="promo-title">Welcome to Test E-Commerce</h2>
                <p class="promo-desc">Find deals, manage your cart, and securely complete your purchase.</p>
                <v-btn variant="tonal" class="promo-cta" @click="step = step === 1 ? 2 : 1">
                  <v-icon left>{{ step === 1 ? 'mdi-account-plus' : 'mdi-login' }}</v-icon>
                  {{ step === 1 ? 'Create Account' : 'Sign In' }}
                </v-btn>
              </div>
            </div>

            <div class="form-panel">
              <v-card-text>
                <v-window v-model="step" continuous transition="scale-transition">
                  <v-window-item :value="1">
                    <div class="form-wrap">
                      <h3 class="panel-title">Sign In</h3>
                      <p class="panel-desc">Sign in to continue your purchase and view orders.</p>
                      <LoginForm/>
                    </div>
                  </v-window-item>

                  <v-window-item :value="2">
                    <div class="form-wrap">
                      <h3 class="panel-title">Create Account</h3>
                      <p class="panel-desc">Join now to save your preferences and enjoy a better experience.</p>
                      <RegisterForm/>
                    </div>
                  </v-window-item>
                </v-window>
              </v-card-text>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'login',
  middleware: 'not-authenticated',
});
defineProps<{
  source?: string
}>();

const step = ref(1);
</script>

<style scoped>
/* Fondo y blobs decorativos */
.auth-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 12px;
  background: linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(0,212,255,0.04) 50%, rgba(255,101,132,0.03) 100%);
  overflow: hidden;
}
.blobs { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.blob {
  position: absolute;
  filter: blur(40px);
  opacity: 0.75;
  border-radius: 50%;
  animation: float 9s ease-in-out infinite;
  mix-blend-mode: screen;
}
.b1 { width: 420px; height: 420px; background: radial-gradient(circle at 20% 20%, #6C63FF, transparent 40%); top: -80px; left: -80px; }
.b2 { width: 320px; height: 320px; background: radial-gradient(circle at 80% 40%, #00D4FF, transparent 40%); bottom: -80px; right: -40px; animation-delay: 2s; }
.b3 { width: 240px; height: 240px; background: radial-gradient(circle at 30% 70%, #FF6584, transparent 40%); top: 20%; right: 10%; animation-delay: 4s; }
@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(6deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

/* Glass card layout */
.glass-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(8px) saturate(120%);
  padding: 0;
  transition: transform .28s cubic-bezier(.2,.9,.3,1), box-shadow .28s;
  z-index: 1;
}
.glass-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(20,22,30,0.12); }

/* Grid inside card */
.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 420px;
}
.promo-panel {
  background: linear-gradient(180deg, rgba(108,99,255,0.12), rgba(0,212,255,0.06));
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.promo-inner { text-align: center; color: var(--v-theme-on-background); }
.promo-icon { color: var(--v-theme-primary); background: rgba(255,255,255,0.06); border-radius: 12px; padding: 8px; }
.promo-title { margin: 16px 0 8px; font-size: 1.3rem; font-weight: 700; }
.promo-desc { margin: 0 0 18px; color: rgba(0,0,0,0.6); }

/* CTA microinteraction */
.promo-cta {
  transition: transform .18s ease, box-shadow .18s ease;
}
.promo-cta:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(108,99,255,0.12); }

/* Form side */
.form-panel { padding: 28px 32px; display: flex; align-items: center; }
.form-wrap { width: 100%; max-width: 520px; margin: 0 auto; }
.panel-title { margin: 0 0 6px; font-size: 1.125rem; font-weight: 700; }
.panel-desc { margin: 0 0 16px; color: rgba(0,0,0,0.56); }

/* Responsive */
@media (max-width: 960px) {
  .card-grid { grid-template-columns: 1fr; }
  .promo-panel { order: 2; padding: 28px; }
  .form-panel { order: 1; padding: 22px; }
}

/* Focus states */
.v-btn:focus { box-shadow: 0 0 0 6px rgba(108,63,255,0.08); outline: none; }

/* Dark mode adjustments using Vuetify CSS variables */
:root[data-theme='dark'] .glass-card { background: rgba(24,24,30,0.6); }
</style>
