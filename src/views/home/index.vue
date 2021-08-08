<template>
  <el-container>
    <el-main class="home-main">
      <div class="home-info">
          <h2>{{title}}</h2>
          <el-row class="home-row">
            <el-col :span="4">{{ $t('home.version') }}: </el-col>
            <el-col :span="20">{{version}}</el-col>
          </el-row>
          <el-row class="home-row">
            <el-col :span="4">{{ $t('home.total') }}: </el-col>
            <el-col :span="20">{{total}}</el-col>
          </el-row>
          <el-row class="home-row">
            <el-col :span="4">{{ $t('home.description') }}: </el-col>
            <el-col :span="20">{{description}}</el-col>
          </el-row>
        </div>
        <div class="home-table">
          <el-table
            :data="table"
            stripe
            style="width: 100%"
            :row-style="{cursor: 'pointer'}"
            @row-click="handleRowClick">
            <el-table-column
              prop="module"
              :label="$t('home.column.module')">
            </el-table-column>
            <el-table-column
              prop="summary"
              :label="$t('home.column.summary')">
            </el-table-column>
            <el-table-column
              prop="path"
              :label="$t('home.column.path')">
            </el-table-column>
            <el-table-column
              prop="method"
              :label="$t('home.column.method')">
              <template slot-scope="scope">
                <el-tag :type="tagType(scope.row.method)">{{ scope.row.method.toUpperCase() }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              :label="$t('home.column.description')">
            </el-table-column>
          </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DocModule } from '@/store/modules/doc'
import { HomeTable, paths2HomeTable, tagType } from '@/utils/doc'

@Component({
  name: 'Doc'
})
export default class extends Vue {
  private tagType = tagType

  get title() {
    return DocModule.document.info.title
  }

  get version() {
    return DocModule.document.info.version
  }

  get description() {
    return DocModule.document.info.description
  }

  get table() {
    return paths2HomeTable(DocModule.document.paths)
  }

  get total() {
    return this.table.length
  }

  handleRowClick(row: HomeTable) {
    console.log(row)
    this.$router.push(row.route)
  }
}
</script>
<style lang='scss' scoped>
.home-main {
  margin: 0 40px 40px 40px;
  padding: 40px;
}
.home-row {
  height: 40px;
  line-height: 40px;
}
.home-info {
  overflow: hidden;
  margin: 0 0 40px 0;
}
</style>
