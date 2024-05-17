<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetDoc"
  >
    <div style="font-size: 14px;">
      模块
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
      v-for="(doc, i) in docs"
      :key="i"
      :command="i"
      >
        {{ doc.info.title }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'DocSelect'
})
export default class extends Vue {
  get docs() {
    return (window as any).docs
  }

  get docUrls() {
    return (window as any).docUrls
  }

  public handleSetDoc(value: number) {
    (window as any).doc = this.docs[value]
    (window as any).docUrl = this.docUrls[value]
  }
}
</script>
