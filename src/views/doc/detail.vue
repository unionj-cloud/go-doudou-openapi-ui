<template>
  <div>
    <h1>Detail</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      path: '1',
      method: '2'
    }
  },
  mounted() {
    this.path = decodeURIComponent(this.$route.path.split('/')[2])
    this.method = this.$route.path.split('/')[3]
  }
})
</script>
