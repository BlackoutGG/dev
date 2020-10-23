<template>
  <v-container fill-height fluid class="pa-0">
    <video playsinline autoplay muted loop width="100%" height="100%">
      <source
        src="https://blackout-gaming.s3.amazonaws.com/video/0001-0876.webm"
        type="video/mp4"
      />
    </video>
  </v-container>
</template>

<script>
export default {
  name: 'VideoBanner',
};
</script>