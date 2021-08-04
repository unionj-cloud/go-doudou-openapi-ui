<template>
  <div class="errPage-container">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ErrorA from './components/ErrorTestA.vue'
import ErrorB from './components/ErrorTestB.vue'

@Component({
  name: 'ErrorLog',
  components: {
    ErrorA,
    ErrorB
  }
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.errPage-container {
  padding: 30px;
}
</style>
