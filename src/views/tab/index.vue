<template>
  <div class="tab-container">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TabPane from './components/TabPane.vue'

@Component({
  name: 'Tab',
  components: {
    TabPane
  }
})
export default class extends Vue {
  private tabMapOptions = [
    { label: 'China', key: 'CN' },
    { label: 'USA', key: 'US' },
    { label: 'Japan', key: 'JP' },
    { label: 'Eurozone', key: 'EU' }
  ]

  private activeName = 'CN'
  private createdTimes = 0

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    this.$router.push(`${this.$route.path}?tab=${value}`).catch(err => {
      console.warn(err)
    })
  }

  created() {
    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeName = tab
    }
  }

  private showCreatedTimes() {
    this.createdTimes = this.createdTimes + 1
  }
}
</script>

<style lang="scss" scoped>
.tab-container {
  margin: 30px;
}
</style>
