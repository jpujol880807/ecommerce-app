<template>
  <v-toolbar color="transparent">
    <v-toolbar-title style="min-width: 200px;">Featured Products</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon="mdi mdi-chevron-left" @click="this.$refs.slideFeaturedProductGroup.scrollTo('prev')"></v-btn>
    <v-btn icon="mdi mdi-chevron-right" @click="this.$refs.slideFeaturedProductGroup.scrollTo('next')"></v-btn>
  </v-toolbar>
  <v-col cols="12" sm="12" class="mt-n10">
    <v-slide-group
        ref="slideFeaturedProductGroup"
        center-active
        active-class="border-primary"
        min-width="100%"
    >
      <v-slide-group-item
          v-for="(feature, index) in featured"
          :key="index"
          class="ma-4"
      >
        <SliderProductCard :product="feature" custom-class="mr-4"/>
      </v-slide-group-item>
    </v-slide-group>
  </v-col>
</template>

<script>
export default {
  name: 'Featured',
  data: () => ({
    featured: [
      {
        img: 'image/5.png',
        title: 'Apple MacBook Pro',
        price: '$ 93,358.01',
        bio: 'The MacBook Pro is a line of Macintosh portable computers introduced in January 2006, by Apple Inc. It is the higher-end model of the MacBook family and is currently available in 13- and 16-inch screen sizes.'
      },
      {
        img: 'image/6.png',
        title: 'Microsoft Surface Laptop 4',
        price: '$ 68,458.99',
        bio: 'The Microsoft Surface Laptop 4 is a laptop computer developed by Microsoft. It is part of the Microsoft Surface line of personal computing devices, and was announced on April 13, 2021.'
      },
      {
        img: 'image/7.png',
        title: 'Dell XPS 13',
        price: '$ 78,123.45',
        bio: 'The Dell XPS 13 is a high-end laptop computer produced by Dell. It is part of the XPS line of laptops, which are known for their premium build quality, high-resolution displays, and powerful performance.'
      },
      {
        img: 'image/8.png',
        title: 'Dell XPS 13',
        price: '$ 78,123.45',
        bio: 'The Dell XPS 13 is a high-end laptop computer produced by Dell. It is part of the XPS line of laptops, which are known for their premium build quality, high-resolution displays, and powerful performance.'
      }
    ]
  })
};
</script>
