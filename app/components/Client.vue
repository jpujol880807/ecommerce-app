<template>
  <v-row style="background-color: #080A21;">
    <v-col cols="12" sm="3">
      <v-card class="mx-auto my-12 pb-4" max-width="374" flat color="#080A21">
        <v-card-item class="top-day">
          <v-card-title class="text-center">Deals of the day</v-card-title>
        </v-card-item>
        <v-card-text>
          <div class="text-center">
            <h1>08:32:29</h1>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="3" v-for="(client, i) in clients" :key="i">
      <v-card class="mx-auto my-12 pb-4" max-width="374">
        <v-img height="250" class="mx-4" :src="client.img"></v-img>
        <v-card-item class="mt-n4">
          <v-card-title class="text-center">{{ client.title }}</v-card-title>
          <v-card-text>
            <div class="text-center">
              {{ client.bio }}
            </div>
            <v-row align="center" class="mx-0 mt-2">
              <v-rating :model-value="4.5" color="amber" density="compact" half-increments readonly size="small">
              </v-rating>
              <v-spacer></v-spacer>
              <div class="text-gray ms-4">
                {{ client.price }}
              </div>
            </v-row>
          </v-card-text>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
export default {
  name: 'Client',
  data: () => ({
    clients: [
      {
        img: 'image/9.png',
        title: 'Apple MacBook Pro',
        price: '$ 93.358.01',
        bio: 'The MacBook Pro is a line of Macintosh portable computers introduced in January 2006, by Apple Inc. It is the higher-end model of the MacBook family and is currently available in 13- and 16-inch screen sizes.'
      },
      {
        img: 'image/10.png',
        title: 'Microsoft Surface Laptop 4',
        price: '$ 68.458.99',
        bio: 'The Microsoft Surface Laptop 4 is a laptop computer developed by Microsoft. It is part of the Microsoft Surface line of personal computing devices, and was announced on April 13, 2021.'
      },
      {
        img: 'image/11.png',
        title: 'Dell XPS 13',
        price: '$ 78.123.45',
        bio: 'The Dell XPS 13 is a high-end laptop computer produced by Dell. It is part of the XPS line of laptops, which are known for their premium build quality, high-resolution displays, and powerful performance.'
      }
    ]
  })
};
</script>
