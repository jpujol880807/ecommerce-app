<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12">
        <v-carousel hide-delimiters>
          <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" cover>
            <v-row>
              <v-col cols="12" sm="12" xs="6">
                <div class="d-flex fill-height justify-center align-center">
                  <h2 class="text-white top">
                    {{ item.title || 'Sample Title' }}
                  </h2><br/>
                </div>
                <div class="d-flex fill-height justify-center align-center">
                  <p class="text text-white">{{ item.text }}</p>
                </div>
                <div class="d-flex fill-height justify-center align-center">
                  <v-btn style="margin-top: -120px">Buy Now</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <Popular/>
      <Featured/>
      <v-col cols="12" sm="12" class="mt-n10">
        <Client/>
      </v-col>
      <v-col cols="12" sm="12" class="mt-10">
        <v-row>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto my-12 pb-4" max-width="374">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-card-item class="mt-10">
                    <v-card-title class="text-center">
                      Smart Watch
                    </v-card-title>
                  </v-card-item>
                  <v-card-text>
                    <div class="text-center">
                      Small paltes, salades & sandwiches
                    </div>
                    <div class="text-center mt-4">
                      <v-btn color="black">Buy Now</v-btn>
                    </div>
                  </v-card-text>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-img height="250" class="mx-4" src="/image/13.jpg"></v-img>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto my-12 pb-4" max-width="374" color="red">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-card-item class="mt-10">
                    <v-card-title class="text-center">
                      Smart Watch
                    </v-card-title>
                  </v-card-item>
                  <v-card-text>
                    <div class="text-center">
                      Small paltes, salades & sandwiches
                    </div>
                    <div class="text-center mt-4">
                      <v-btn color="black">Buy Now</v-btn>
                    </div>
                  </v-card-text>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-img height="250" class="mx-4" src="/image/14.jpg"></v-img>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="mx-auto my-12 pb-4" max-width="374">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-card-item class="mt-10">
                    <v-card-title class="text-center">
                      Smart Watch
                    </v-card-title>
                  </v-card-item>
                  <v-card-text>
                    <div class="text-center">
                      Small paltes, salades & sandwiches
                    </div>
                    <div class="text-center mt-4">
                      <v-btn color="black">Buy Now</v-btn>
                    </div>
                  </v-card-text>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-img height="250" class="mx-4" src="/image/15.jpg"></v-img>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import Popular from "../components/Popular.vue";
import Featured from "../components/Featured.vue";
import Client from "../components/Client.vue";
</script>

<script lang="ts">
export default {
  data() {
    return {
      items: [
        {
          title: 'Surface Studio',
          src: '7.jpg',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          title: 'Surface Studio',
          src: '1.jpg',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          title: 'Surface Studio',
          src: '2.jpg',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          title: 'Surface Studio',
          src: '3.jpg',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          title: 'Surface Studio',
          src: '4.jpg',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          title: 'Surface Studio',
          src: '5.jpg',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          title: 'Surface Studio',
          src: '6.jpg',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      ],
    };
  },
};
</script>

<style scoped>
.top {
  margin-top: 100px;
}

.text {
  margin-top: -40px;
  margin-left: 80px;
  margin-right: 80px;
}

.top-day {
  margin-top: 120px;
}

@media (max-width: 600px) {
  .top {
    margin-top: 40px;
  }
}
</style>
