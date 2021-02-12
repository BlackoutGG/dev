<template>
  <v-row>
    <v-col cols="12">
      <v-sheet>
        <v-list flat subheader three-line>
          <v-subheader>Front Page Settings</v-subheader>
          <v-list-item v-for="(setting, key) in settings" :key="key">
            <template #default="{ active }">
              <v-list-item-action>
                <v-checkbox
                  v-if="setting.hasOwnProperty('validator')"
                  v-model="setting.value"
                  :input-value="active"
                  :disabled="!setting.validator()"
                ></v-checkbox>
                <v-checkbox
                  v-else
                  v-model="setting.value"
                  :input-value="active"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ setting.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  setting.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-list-item>
          <slot name="url" />
        </v-list>
      </v-sheet>
    </v-col>
    <v-col cols="12">
      <v-btn @click="$emit('save')">Save</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FPSettingsBlock',

  props: {
    settings: {
      type: [Array, Object],
      default: () => [],
    },
  },
};
</script>
