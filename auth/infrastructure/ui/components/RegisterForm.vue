<template>
  <v-form ref="register-form" @submit.prevent="register">
    <v-row align="center" justify="center" class="mt-12">
      <v-col cols="12" md="8">
        <v-row class="mt-md-8 ga-0">
          <v-col cols="12" md="6" class="py-0">
            <v-text-field label="First Name" outlined density="compact" color="primary" autocomplete="false"
                          prepend-inner-icon="mdi mdi-account-arrow-right" :rules="nameRules"
                          v-model="registerCredentials.firstName"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="py-0">
            <v-text-field label="Last Name" outlined density="compact" color="primary" autocomplete="false"
                          prepend-inner-icon="mdi mdi-account-arrow-right-outline" :rules="nameRules"
                          v-model="registerCredentials.lastName"></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-text-field label="Email" outlined density="compact" color="primary" autocomplete="false"
                          prepend-inner-icon="mdi mdi-email-arrow-right" :rules="emailRules"
                          v-model="registerCredentials.email"></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-text-field label="Password" outlined density="compact" color="primary" autocomplete="false"
                          type="password" prepend-inner-icon="mdi mdi-key-arrow-right" :rules="passwordRules"
                          v-model="registerCredentials.password"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col cols="6">
            <v-checkbox label="Accept terms" class="mt-n1" color="primary" density="compact"></v-checkbox>
          </v-col>
          <v-col cols="6" class="pt-4" style="font-size: 17px;">
            <span class="caption text-primary">Terms & Conditions</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" dark block rounded :loading="isLoading" type="submit">Sign up</v-btn>
            <v-dialog v-model="dialog" width="auto">
              <Alert
                  title="Register Failed"
                  :text="errorText"
                  dialog-type="error"
                  @dialog-close="dialog = false"
              />
            </v-dialog>
          </v-col>
        </v-row>
        <h5 class="text-center grey--text mt-6 mb-4">Or Sign up using</h5>
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
const { loggedIn, user, fetch: refreshSession } = useUserSession()

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(20),
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
});

const isLoading = ref(false);
const dialog = ref(false);
const errorText = ref('Register failed. Please try again.');
const registerForm = useTemplateRef('register-form');

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v.length >= 2 && v.length <=20) || 'Names must be >= 2 and <= 20 characters long',
];
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => registerSchema.shape.email.safeParse(v).success || 'Invalid email address',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => registerSchema.shape.password.safeParse(v).success || 'Password must be >= 6 and <= 20 characters long',
];

const registerCredentials = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

async function register() {
  try {
    isLoading.value = true;
    await $fetch('/api/register', {
      method: 'POST',
      body: registerCredentials
    });
    await refreshSession();
    await navigateTo('/');
  } catch (error) {
    if (error.response?._data) {
      errorText.value = error.response?._data.message || 'Register failed. Please try again.';
    } else {
      errorText.value = 'Register failed. Please try again.';
    }
    console.error('Register failed:', error);
    dialog.value = true;
    registerForm.value.validate();
  } finally {
    isLoading.value = false;
  }
}
</script>
