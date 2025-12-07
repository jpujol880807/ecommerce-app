<template>
  <v-container fluid class="pa-0">
    <v-row class="hero-row">
      <v-col cols="12" sm="12" class="pa-0">
        <v-carousel hide-delimiters class="hero-carousel">
          <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" cover>
            <div class="hero-slide">
              <div class="hero-overlay"></div>
              <div class="hero-content">
                <h2 class="animated-title">
                  {{ item.title || 'Sample Title' }}
                </h2>
                <p class="animated-text">{{ item.text }}</p>
                <v-btn class="cta-btn" color="primary" elevation="6" rounded>
                  Buy Now
                </v-btn>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <v-row class="my-8">
      <v-col cols="12">
        <Popular/>
      </v-col>
    </v-row>

    <v-row class="my-8">
      <v-col cols="12">
        <v-sheet elevation="0" class="featured-wrapper pa-6">
          <Featured/>
        </v-sheet>
      </v-col>
    </v-row>

    <v-col cols="12" sm="12" class="mt-n10">
      <Client/>
    </v-col>

    <v-col cols="12" sm="12" class="mt-10">
      <v-row>
        <v-col cols="12" sm="4" v-for="n in 3" :key="n">
          <v-card class="mx-auto my-12 pb-4 card-hover" max-width="374">
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
                    <v-btn color="black" class="mini-cta" elevation="4">Buy Now</v-btn>
                  </div>
                </v-card-text>
              </v-col>
              <v-col cols="12" sm="6">
                <v-img height="250" class="mx-4 rounded-image" src="/image/13.jpg"></v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>
<script setup lang="ts">
import { definePageMeta } from '#imports';
  definePageMeta({
    middleware: ['auth'],
  });
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
/* Hero / Carousel */
.hero-row {
  position: relative;
  overflow: hidden;
}

.hero-carousel .v-carousel__controls {
  display: none; /* clean look */
}

.hero-slide {
  position: relative;
  width: 100%;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15,23,36,0.35) 0%, rgba(15,23,36,0.60) 60%, rgba(0,0,0,0.6) 100%);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.hero-content {
  position: relative;
  z-index: 5;
  text-align: center;
  color: var(--v-theme-onPrimary, #fff);
  max-width: 960px;
  padding: 24px;
}

/* Animated title and text */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

.animated-title {
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  animation: fadeUp 700ms cubic-bezier(.2,.9,.4,1) both;
  letter-spacing: -0.02em;
  text-shadow: 0 6px 18px rgba(0,0,0,0.45);
}

.animated-text {
  font-size: clamp(14px, 1.6vw, 18px);
  margin: 0 auto 18px auto;
  max-width: 820px;
  color: rgba(255,255,255,0.92);
  animation: fadeUp 900ms 120ms cubic-bezier(.2,.9,.4,1) both;
  line-height: 1.4;
}

/* CTA button micro-interactions */
.cta-btn {
  transform-origin: center;
  transition: transform 220ms cubic-bezier(.2,.9,.4,1), box-shadow 220ms;
  padding-left: 28px;
  padding-right: 28px;
}

.cta-btn:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0,0,0,0.32);
}

/* Cards hover */
.card-hover {
  transition: transform 300ms ease, box-shadow 300ms ease;
  will-change: transform;
}
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(12,17,43,0.12);
}

/* small ctas */
.mini-cta {
  transition: transform 180ms ease;
}
.mini-cta:hover {
  transform: translateY(-3px);
}

/* image rounding */
.rounded-image img {
  border-radius: 8px;
}

/* Featured wrapper spacing */
.featured-wrapper {
  background: transparent;
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-overlay { background: linear-gradient(180deg, rgba(15,23,36,0.25) 0%, rgba(15,23,36,0.5) 60%, rgba(0,0,0,0.5) 100%); }
}

@media (max-width: 600px) {
  .animated-title { font-size: 24px; margin-top: 8px; }
  .text { margin-left: 16px; margin-right: 16px; }
}
</style>
