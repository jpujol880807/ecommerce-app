<template>
  <v-row class="d-flex align-center justify-center fill-height">
    <v-col cols="12" sm="10">
      <v-card class="elevation-6">
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-row>
              <v-col cols="12" md="6">
                <v-card-text class="mt-12">
                  <h3 class="text-center">Login to Your Account</h3>
                  <h5 class="text-center text-grey mt-4">Login to your account so you can continue building
                    <br> and your shopping cart and checkout
                  </h5>
                  <LoginForm/>
                </v-card-text>
              </v-col>
              <v-col cols="12" md="6" class="bg-primary rounded-bs-xl">
                <div style="text-align: center; padding: 180px 0;">
                  <v-card-text class="white--text">
                    <h3 class="text-center">
                      Dont have an account?
                    </h3>
                    <h5 class="mt-2">
                      Sign up now to start shopping!
                    </h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn variant="outlined" @click="step++" border>SIGN UP</v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="2">
            <v-row>
              <v-col cols="12" md="6" class="bg-primary rounded-be-xl">
                <div style="text-align: center; padding: 180px 0;">
                  <v-card-text class="white--text">
                    <h3 class="text-center">
                      Already signed up?
                    </h3>
                    <h5 class="mt-2">
                      Login to your account to continue shopping!
                    </h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn variant="outlined" @click="step--">SIGN IN</v-btn>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-card-text class="mt-12">
                  <h3 class="text-center">Sign up to an Account</h3>
                  <h5 class="text-center text-grey mt-4">Let's create ur account so you can start
                    <br> discovering amazing products!
                  </h5>
                  <RegisterForm/>
                </v-card-text>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {ref} from 'vue';

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
.rounded-bs-xl {
  border-bottom-left-radius: 240px !important;
}

.rounded-be-xl {
  border-bottom-right-radius: 240px !important;
}
</style>
