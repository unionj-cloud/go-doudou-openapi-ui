<template>
  <el-container>
    <el-main class="doc-main">
      <el-card class="doc-card">
        <div slot="header" class="clearfix">
          <span>Basic Info</span>
        </div>
        <div>
          <el-row class="doc-row">
            <el-col :span="4">Description: </el-col>
            <el-col :span="20">{{this.pathItem.description}}</el-col>
          </el-row>
          <el-row class="doc-row">
            <el-col :span="4">Path: </el-col>
            <el-col :span="20"><el-tag>{{this.method}}</el-tag> {{this.path}}</el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="doc-card" v-if="hasParams">
        <div slot="header" class="clearfix">
          <span>Request Parameters</span>
        </div>
        <div>
          <el-table
            :data="params"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="Name">
            </el-table-column>
            <el-table-column
              prop="in"
              label="In">
            </el-table-column>
            <el-table-column
              prop="type"
              label="Type">
            </el-table-column>
            <el-table-column
              prop="required"
              label="Required">
            </el-table-column>
            <el-table-column
              prop="default"
              label="Default">
            </el-table-column>
            <el-table-column
              prop="example"
              label="Example">
            </el-table-column>
            <el-table-column
              prop="description"
              label="Description">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card class="doc-card" v-if="hasReqBody">
        <div slot="header" class="clearfix">
          <span>Request Body</span>
        </div>
        <div>
          <el-table
            :data="reqBody"
            style="width: 100%"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="name"
              label="Name">
            </el-table-column>
            <el-table-column
              prop="type"
              label="Type">
            </el-table-column>
            <el-table-column
              prop="required"
              label="Required">
            </el-table-column>
            <el-table-column
              prop="default"
              label="Default">
            </el-table-column>
            <el-table-column
              prop="description"
              label="Description">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card class="doc-card">
        <div slot="header" class="clearfix">
          <span>Response Body</span>
        </div>
        <div>path: {{path}}</div>
        <div>method: {{method}}</div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DocModule } from '@/store/modules/doc'
import { OpenAPIV3 } from 'openapi-types'

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
  name: string
  type: string
  required: string
  description: string
  default: string
  children?: DocBody[]
}

function getTypeByRef(ref: string):string {
  return 'object'
}

function schema2DocType(schema : OpenAPIV3.SchemaObject):string {
  const type = schema.type
  if (!type) {
    return getTypeByRef((schema as OpenAPIV3.ReferenceObject).$ref)
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
        name: key,
        type: schema2DocType(propSchema as OpenAPIV3.SchemaObject),
        required: requiredProps.indexOf(key) >= 0 ? 'true' : 'false',
        description: (propSchema as OpenAPIV3.SchemaObject).description || '',
        default: (propSchema as OpenAPIV3.SchemaObject).default || '',
        children: schema2Table(propSchema as OpenAPIV3.SchemaObject)
      }
      return row
    })
  } else {
    return []
  }
}

@Component({
  name: 'Doc'
})
export default class extends Vue {
  private path = ''
  private method = ''
  private pathItem: OpenAPIV3.OperationObject = {}
  private params: DocParam[] = []
  private reqBody: DocBody[] = []

  mounted() {
    this.path = decodeURIComponent(this.$route.path.split('/')[2])
    this.method = this.$route.path.split('/')[3]
    this.pathItem = (DocModule.document.paths[this.path] as any)[this.method]
    const parameters = (this.pathItem.parameters || []) as OpenAPIV3.ParameterObject[]
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
    let reqBody = this.pathItem.requestBody
    const ref = (reqBody as OpenAPIV3.ReferenceObject).$ref
    if (ref) {
      const key = ref.substring(ref.lastIndexOf('/') + 1)
      reqBody = DocModule.document.components?.requestBodies?.[key]
    }
    const content = (reqBody as OpenAPIV3.RequestBodyObject).content
    const media = content['application/json'] as OpenAPIV3.MediaTypeObject
    if (media) {
      let schema: OpenAPIV3.SchemaObject = {}
      const ref = (media.schema as OpenAPIV3.ReferenceObject).$ref
      if (ref) {
        const key = ref.substring(ref.lastIndexOf('/') + 1)
        schema = (DocModule.document.components?.schemas?.[key] || {}) as OpenAPIV3.SchemaObject
      }
      this.reqBody = [{
        name: 'root',
        type: schema2DocType(schema as OpenAPIV3.SchemaObject),
        required: (schema.required || false) + '',
        description: (schema as OpenAPIV3.SchemaObject).description || '',
        default: (schema as OpenAPIV3.SchemaObject).default || '',
        children: schema2Table(schema)
      }]
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
}
</style>
