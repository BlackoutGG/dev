<template>
  <div class="fp-list my-16">
    <div class="fp-top my-8">
      <div class="fp-column">
        <v-subheader>{{ title }}</v-subheader>
        <v-spacer></v-spacer>
      </div>
      <div class="fp-top-column">
        <v-btn class="mr-4" depressed tile @click="toggleSelectAll">{{
          toggleSelectLabel
        }}</v-btn>
        <v-btn class="mr-4" depressed tile>Delete</v-btn>
        <v-btn class="mr-4" depressed @click="$emit('create')">Create</v-btn>
        <v-btn depressed tile>Save</v-btn>
      </div>
    </div>
    <draggable
      :list="internalItems"
      group="items"
      class="fp-body"
      @end="resetSelectOnDrop"
    >
      <slot v-bind="{ items: internalItems }" />
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'FPList',

  components: { draggable },

  props: {
    title: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemKey: {
      type: String,
      default: 'id',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      internalItems: [],
      hideDefaultFooter: true,
      hideDefaultHeader: false,
      loading: false,
    };
  },

  watch: {
    items: {
      immediate: true,
      handler: function (items) {
        const internal = cloneDeep(items);
        this.internalItems = internal.map((item) => ({
          ...item,
          isSelected: false,
        }));
      },
    },

    selected: {
      deep: true,
      handler: function (selected) {
        this.$emit('input', selected);
      },
    },
  },

  computed: {
    selected() {
      return this.internalItems.reduce((output, item) => {
        if (item.isSelected) output.push(item[this.itemKey]);
        return output;
      }, []);
    },

    everyItemSelected() {
      return this.internalItems.every((item) => item.isSelected);
    },

    toggleSelectLabel() {
      return this.everyItemSelected ? 'DESELECT ALL' : 'SELECT ALL';
    },
  },

  methods: {
    resetSelectOnDrop() {
      this.internalItems.forEach((item) => (item.isSelected = false));
    },

    toggleSelectAll() {
      this.internalItems.forEach(
        (item) => (item.isSelected = !item.isSelected)
      );
    },
  },
};
</script>

<style lang="scss">
.fp-list {
  .fp-top-column {
    display: flex;
    flex: 1 0 50%;
    max-width: 50%;
  }
  .fp-body {
    display: flex;
    flex-direction: column;
    .fp-body-row {
      display: flex;
      align-items: center;
      width: 100%;
      border-bottom: 1px solid #e1e1e1;
      flex: 1;
      &:hover {
        background-color: #e5e5e5;
      }
    }
    // .fp-grow {
    //   width: 100%;
    //   flex-grow: 1;
    // }
    .fp-drag,
    .fp-select {
      flex: 0 1;
    }
    .fp-body-column {
      padding: 5px 16px;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
