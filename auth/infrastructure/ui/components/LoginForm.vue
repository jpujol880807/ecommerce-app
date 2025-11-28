<template>
  <v-form @submit.prevent="login" ref="loginForm">
    <v-row align="center" justify="center" class="mt-8">
      <v-col cols="12" md="8">
        <v-text-field
            label="Email"
            outlined
            density="compact"
            color="primary"
            autocomplete="false"
            class="mt-16"
            prepend-inner-icon="mdi mdi-email-arrow-right"
            v-model="loginCredentials.email"
            :rules="emailRules"
        ></v-text-field>
        <v-text-field
            label="Password"
            outlined
            density="compact"
            color="primary"
            autocomplete="false"
            type="password"
            prepend-inner-icon="mdi mdi-key-arrow-right"
            v-model="loginCredentials.password"
            :rules="passwordRules"
        ></v-text-field>
        <v-row class="mt-4">
          <v-col cols="6">
            <v-checkbox label="Remember Me" class="mt-n1" color="primary" density="compact"></v-checkbox>
          </v-col>
          <v-col cols="6" class="pt-4">
            <span class="caption text-primary" style="font-size: 17px;">Forgot Password</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" dark block rounded type="submit" :loading="isLoading">Login</v-btn>
            <v-dialog v-model="dialog" width="auto">
              <Alert
                  title="Login Failed"
                  :text="errorText"
                  dialog-type="error"
                  @dialog-close="dialog = false"
              />
            </v-dialog>
          </v-col>
        </v-row>
        <h5 class="text-center grey--text mt-6 mb-4">Or Login using</h5>
        <div class="d-flex justify-space-evenly mx-lg-10 mx-md-4 mx-sm-4 mb-16">
          <v-btn outlined depressed>
            <v-icon color="blue darken-4">mdi-facebook</v-icon>
          </v-btn>
          <v-btn outlined depressed>
            <v-icon color="red darken-1">mdi-google</v-icon>
          </v-btn>
          <v-btn outlined depressed>
            <v-icon color="black lighten-2">mdi-github</v-icon>
          </v-btn>
        </div>
      </v-col>

    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import {reactive, ref, useTemplateRef} from 'vue';
import {z} from 'zod/v4';
import {useUserSession, navigateTo} from '#imports';

type FormWithValidate = { validate: () => boolean };

const isLoading = ref(false);
const dialog = ref(false);
const errorText = ref('Invalid email or password. Please try again.');
const formRef = useTemplateRef<FormWithValidate>('loginForm');
const {loggedIn, user, fetch: refreshSession} = useUserSession();
const loginCredentials = reactive({
  email: '',
  password: ''
});

const loginSchema = z.object({
  email: z.email({message: 'Invalid email address'}),
  password: z.string()
      .min(6, {message: 'Password must be at least 6 characters long'})
      .max(20, {message: 'Password must be at most 20 characters long'})
});

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => loginSchema.shape.email.safeParse(v).success || 'Invalid email address',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => loginSchema.shape.password.safeParse(v).success || 'Password must be at least 6 characters long',
];

async function login() {
  try {
    isLoading.value = true;
    await $fetch('/api/login', {
      method: 'POST',
      body: loginCredentials
    });
    await refreshSession();
    await navigateTo('/');
  } catch (err: unknown) {
    const e = err as any;
    if (e?.response?._data) {
      errorText.value = e.response._data.message || 'Login failed. Please try again.';
    } else if (err instanceof Error) {
      errorText.value = err.message || 'Login failed. Please try again.';
    } else {
      errorText.value = 'Login failed. Please try again.';
    }
    dialog.value = true;
    formRef.value?.validate(); // evita TS18047
    console.error('Login failed:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>
