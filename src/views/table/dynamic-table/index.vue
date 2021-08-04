<template>
  <div class="app-container">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FixedHeaderTable from './components/FixedHeaderTable.vue'
import UnfixedHeaderTable from './components/UnfixedHeaderTable.vue'

@Component({
  name: 'DynamicTable',
  components: {
    FixedHeaderTable,
    UnfixedHeaderTable
  }
})
export default class extends Vue {}
</script>
