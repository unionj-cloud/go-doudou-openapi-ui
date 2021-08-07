<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Redirect'
})
export default class extends Vue {
  created() {
    const { query } = this.$route
    const path = this.$route.fullPath.replace('/redirect/', '')
    this.$router.replace({ path: '/' + path, query }).catch(err => {
      console.warn(err)
    })
  }

  render() {
    // Avoid warning for missing template
  }
}
</script>
