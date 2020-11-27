<template>
  <div class="fc-event-main-frame" v-if="isBlock">
    <div class="fc-event-time" v-if="isStart">{{ text }}</div>
    <div class="fc-event-title-container" v-if="isStart">
      {{ event.title }}
    </div>
  </div>
  <div class="d-flex align-center" v-else>
    <div
      class="fc-daygrid-event-dot"
      :style="{ 'border-color': event.color }"
    ></div>
    <div class="fc-event-time">{{ text }}</div>
    <div class="fc-event-title">{{ event.title }}</div>
  </div>
</template>

<script>
export default {
  name: 'EventContent',

  props: {
    isStart: {
      type: Boolean,
    },
    isEnd: {
      type: Boolean,
    },
    text: {
      type: String,
    },
    event: {
      type: Object,
    },
    view: {
      type: String,
    },
  },

  computed: {
    isBlock() {
      return this.event.extendedProps.isMultiDay || this.event.allDay;
    },
    color() {
      return { borderColor: this.event.color };
    },
  },
};
</script>
