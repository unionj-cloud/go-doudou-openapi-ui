<template>
  <el-container>
    <el-main class="doc-main">
      <el-card class="doc-card">
        <div slot="header" class="clearfix">
          <span>{{ $t('doc.basicInfo') }}</span>
        </div>
        <div>
          <el-row class="doc-row">
            <el-col :span="4">{{ $t('doc.description') }}: </el-col>
            <el-col :span="20">{{this.pathItem.description}}</el-col>
          </el-row>
          <el-row class="doc-row">
            <el-col :span="4">{{ $t('doc.path') }}: </el-col>
            <el-col :span="20"><el-tag>{{this.method.toUpperCase()}}</el-tag> {{this.path}}</el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="doc-card" v-if="hasParams">
        <div slot="header" class="clearfix">
          <span>{{ $t('doc.reqParams') }}</span>
        </div>
        <div class="doc-table">
          <el-table
            :data="params"
            style="width: 100%">
            <el-table-column
              prop="name"
              :label="$t('doc.column.name')">
            </el-table-column>
            <el-table-column
              prop="in"
              :label="$t('doc.column.in')">
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t('doc.column.type')">
            </el-table-column>
            <el-table-column
              prop="required"
              :label="$t('doc.column.required')">
            </el-table-column>
            <el-table-column
              prop="default"
              :label="$t('doc.column.default')">
            </el-table-column>
            <el-table-column
              prop="example"
              :label="$t('doc.column.example')">
            </el-table-column>
            <el-table-column
              prop="description"
              :label="$t('doc.column.description')">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card class="doc-card" v-if="hasReqBody">
        <div slot="header" class="clearfix">
          <span>{{ $t('doc.reqBody') }}</span>
        </div>
        <el-row class="doc-row">
          <el-col :span="4"> Content-Type: </el-col>
          <el-col :span="20"> {{this.reqContentTypes.join(', ')}}</el-col>
        </el-row>
        <div class="doc-table">
          <el-table
            :data="reqBody"
            style="width: 100%"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="name"
              :label="$t('doc.column.name')">
            </el-table-column>
            <el-table-column
              prop="type"
              :label="$t('doc.column.type')">
            </el-table-column>
            <el-table-column
              prop="required"
              :label="$t('doc.column.required')">
            </el-table-column>
            <el-table-column
              prop="default"
              :label="$t('doc.column.default')">
            </el-table-column>
            <el-table-column
              prop="example"
              :label="$t('doc.column.example')">
            </el-table-column>
            <el-table-column
              prop="description"
              :label="$t('doc.column.description')">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card class="doc-card">
        <div slot="header" class="clearfix">
          <span>{{ $t('doc.respBody') }}</span>
        </div>
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane v-for="(item, index) in respBody" :key="index" :label="item.code" :name="item.code">
            <el-row class="doc-row">
              <el-col :span="4"> Content-Type: </el-col>
              <el-col :span="20"> {{item.contentTypes.join(', ')}}</el-col>
            </el-row>
            <div class="doc-table">
              <el-table
                :data="item.body"
                style="width: 100%"
                row-key="id"
                border
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                  prop="name"
                  :label="$t('doc.column.name')">
                </el-table-column>
                <el-table-column
                  prop="type"
                  :label="$t('doc.column.type')">
                </el-table-column>
                <el-table-column
                  prop="required"
                  :label="$t('doc.column.required')">
                </el-table-column>
                <el-table-column
                  prop="default"
                  :label="$t('doc.column.default')">
                </el-table-column>
                <el-table-column
                  prop="example"
                  :label="$t('doc.column.example')">
                </el-table-column>
                <el-table-column
                  prop="description"
                  :label="$t('doc.column.description')">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DocModule } from '@/store/modules/doc'
import { OpenAPIV3 } from 'openapi-types'
import { v4 as uuidv4 } from 'uuid'

interface DocParam {
  name: string
  in: string
  type: string
  required: string
  example: string
  description: string
  default: string
}

interface DocBody {
  id: string
  name: string
  type: string
  required: string
  description: string
  default: string
  children?: DocBody[]
  example: string
}

interface DocResp {
  code: string
  contentTypes: string[]
  body: DocBody[]
}

function getTypeByRef():string {
  return 'object'
}

function schema2DocType(schema : OpenAPIV3.SchemaObject):string {
  const type = schema.type
  if (!type) {
    return getTypeByRef()
  }
  let result = ''
  switch (type) {
    case 'boolean': {
      result = 'boolean'
      break
    }
    case 'integer':
    case 'number': {
      result = 'number'
      break
    }
    case 'string': {
      result = 'string'
      const format = schema.format
      if (format != null && format === 'binary') {
        result = 'file'
      }
      break
    }
    case 'array': {
      const items = (schema as OpenAPIV3.ArraySchemaObject).items
      result = schema2DocType(items as OpenAPIV3.SchemaObject)
      result += '[]'
      break
    }
    case 'object': {
      result = 'object'
      break
    }
    default: {
      result = ''
    }
  }
  return result
}

function schema2Table(schema : OpenAPIV3.SchemaObject):DocBody[] {
  const requiredProps: string[] = schema.required || []
  if ((schema as OpenAPIV3.SchemaObject).type === 'array') {
    let items = (schema as OpenAPIV3.ArraySchemaObject).items
    const ref = (items as OpenAPIV3.ReferenceObject).$ref
    if (ref) {
      const key = ref.substring(ref.lastIndexOf('/') + 1)
      items = DocModule.document.components?.schemas?.[key] || {}
    }
    return schema2Table(items as OpenAPIV3.SchemaObject)
  } else if ((schema as OpenAPIV3.SchemaObject).properties) {
    return Object.keys(schema.properties || {}).map(key => {
      let propSchema = schema.properties?.[key]
      const ref = (propSchema as OpenAPIV3.ReferenceObject).$ref
      if (ref) {
        const key = ref.substring(ref.lastIndexOf('/') + 1)
        propSchema = DocModule.document.components?.schemas?.[key]
      }
      const row: DocBody = {
        id: uuidv4(),
        name: key,
        type: schema2DocType(propSchema as OpenAPIV3.SchemaObject),
        required: requiredProps.indexOf(key) >= 0 ? 'true' : 'false',
        description: (propSchema as OpenAPIV3.SchemaObject).description || '',
        default: (propSchema as OpenAPIV3.SchemaObject).default || '',
        example: (propSchema as OpenAPIV3.SchemaObject).example || '',
        children: schema2Table(propSchema as OpenAPIV3.SchemaObject)
      }
      return row
    })
  } else {
    return []
  }
}

function responseObject2DocResp(resp: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject, code: string):DocResp {
  const result:DocResp = {
    code,
    contentTypes: [],
    body: []
  }
  let ref = (resp as OpenAPIV3.ReferenceObject).$ref
  if (ref) {
    const key = ref.substring(ref.lastIndexOf('/') + 1)
    resp = (DocModule.document.components?.responses?.[key] || {}) as OpenAPIV3.ResponseObject
  }
  const content = (resp as OpenAPIV3.ResponseObject).content
  if (content) {
    result.contentTypes = Object.keys(content)
    const media: OpenAPIV3.MediaTypeObject = content[Object.keys(content)[0]] as OpenAPIV3.MediaTypeObject
    let schema = media.schema
    ref = (schema as OpenAPIV3.ReferenceObject).$ref
    if (ref) {
      const key = ref.substring(ref.lastIndexOf('/') + 1)
      schema = (DocModule.document.components?.schemas?.[key] || {}) as OpenAPIV3.SchemaObject
    }
    result.body = [{
      id: uuidv4(),
      name: 'root',
      type: schema2DocType(schema as OpenAPIV3.SchemaObject),
      required: 'true',
      description: (schema as OpenAPIV3.SchemaObject).description || '',
      default: (schema as OpenAPIV3.SchemaObject).default || '',
      example: (schema as OpenAPIV3.SchemaObject).example || '',
      children: schema2Table(schema as OpenAPIV3.SchemaObject)
    }]
  }
  return result
}

// TODO support response header
@Component({
  name: 'Doc'
})
export default class extends Vue {
  private path = ''
  private method = ''
  private pathItem: OpenAPIV3.OperationObject = {}
  private params: DocParam[] = []
  private reqBody: DocBody[] = []
  private respBody: DocResp[] = []
  private reqContentTypes: string[] = []
  private activeTab = ''

  mounted() {
    this.path = decodeURIComponent(this.$route.path.split('/')[2])
    this.method = this.$route.path.split('/')[3]
    this.pathItem = (DocModule.document.paths[this.path] as any)[this.method]
    const parameters = (this.pathItem.parameters || []) as OpenAPIV3.ParameterObject[]
    if (parameters.length) {
      this.params = parameters.map(param => {
        const type = schema2DocType((param.schema as OpenAPIV3.SchemaObject))
        const docParam: DocParam = {
          name: param.name,
          in: param.in,
          type,
          required: (param.required || false) + '',
          example: param.example || '',
          description: param.description || '',
          default: (param.schema as OpenAPIV3.SchemaObject).default || ''
        }
        return docParam
      })
    }
    let reqBody = this.pathItem.requestBody
    if (reqBody) {
      let ref = (reqBody as OpenAPIV3.ReferenceObject).$ref
      if (ref) {
        const key = ref.substring(ref.lastIndexOf('/') + 1)
        reqBody = DocModule.document.components?.requestBodies?.[key]
      }
      const content = (reqBody as OpenAPIV3.RequestBodyObject).content
      this.reqContentTypes = Object.keys(content)
      const media: OpenAPIV3.MediaTypeObject = content[Object.keys(content)[0]] as OpenAPIV3.MediaTypeObject
      let schema = media.schema
      ref = (schema as OpenAPIV3.ReferenceObject).$ref
      if (ref) {
        const key = ref.substring(ref.lastIndexOf('/') + 1)
        schema = (DocModule.document.components?.schemas?.[key] || {}) as OpenAPIV3.SchemaObject
      }
      this.reqBody = [{
        id: uuidv4(),
        name: 'root',
        type: schema2DocType(schema as OpenAPIV3.SchemaObject),
        required: 'true',
        description: (schema as OpenAPIV3.SchemaObject).description || '',
        default: (schema as OpenAPIV3.SchemaObject).default || '',
        example: (schema as OpenAPIV3.SchemaObject).example || '',
        children: schema2Table(schema as OpenAPIV3.SchemaObject)
      }]
    }
    const responses: OpenAPIV3.ResponsesObject | undefined = this.pathItem.responses
    if (responses) {
      Object.keys(responses).sort().forEach(code => {
        this.respBody.push(responseObject2DocResp(responses[code], code))
      })
      this.activeTab = this.respBody.length ? this.respBody[0].code : ''
    }
    console.log(this.pathItem)
  }

  get hasParams() {
    return !!this.params.length
  }

  get hasReqBody() {
    return !!this.reqBody.length
  }
}
</script>
<style lang="scss" scoped>
.doc-main {
  .doc-card {
    margin: 40px 0;
  }
  .doc-card:first-child {
    margin-top: 0px;
  }
  .doc-row {
    height: 40px;
    line-height: 40px;
  }
  .doc-table{
    margin: 20px 0px;
  }
}
</style>
