<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import local from './local'

@Component({
  name: 'I18n'
})
export default class extends Vue {
  private date = ''
  private value = ''
  private options: any[] = []
  private tableData = [{
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }]

  get lang() {
    return AppModule.language
  }

  set lang(lang) {
    AppModule.SetLanguage(lang)
    this.$i18n.locale = lang
    this.setOptions()
  }

  created() {
    const viewName = 'i18nView'
    if (!this.$i18n.getLocaleMessage('en')[viewName]) {
      this.$i18n.mergeLocaleMessage('en', local.en)
      this.$i18n.mergeLocaleMessage('zh', local.zh)
      this.$i18n.mergeLocaleMessage('es', local.es)
      this.$i18n.mergeLocaleMessage('ja', local.ja)
      this.$i18n.mergeLocaleMessage('ko', local.ko)
      this.$i18n.mergeLocaleMessage('it', local.it)
    }
    this.setOptions() // set default select options
  }

  private setOptions() {
    this.options = [
    ]
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  width: 700px;
  max-width: 100%;
  margin: 20px auto;
}

.item-btn {
  margin-bottom: 15px;
  margin-left: 0px;
}

.block {
  padding: 25px;
}
</style>
