<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
@Component({
  name: 'Login'
})
export default class extends Vue {
  get language() {
    return AppModule.language
  }
}
</script>
