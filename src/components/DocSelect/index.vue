<template>
  <el-select v-model="value" placeholder="请选择模块" @change="handleSetDoc">
    <el-option
    v-for="doc in docs"
      :key="doc.value"
      :label="doc.label"
      :value="doc.value">
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'DocSelect'
})
export default class extends Vue {
  value = ''

  get docs() {
    return (window as any).docs
  }

  get docUrls() {
    return (window as any).docUrls
  }

  public handleSetDoc(value: string) {
    window.location.href = value
  }
}
</script>
