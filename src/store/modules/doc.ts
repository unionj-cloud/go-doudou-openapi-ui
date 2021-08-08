import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { OpenAPIV3 } from 'openapi-types'
import axios, { AxiosResponse } from 'axios'

export interface IDocState {
  document: OpenAPIV3.Document
}

@Module({ dynamic: true, store, name: 'doc' })
class Doc extends VuexModule implements IDocState {
  public document: OpenAPIV3.Document<{}> = {
    openapi: '',
    info: {
      title: '',
      version: ''
    },
    servers: [],
    paths: {},
    components: {},
    security: [],
    tags: [],
    externalDocs: {
      url: ''
    }
  }

  @Mutation
  private SET_DOCUMENT(document: OpenAPIV3.Document) {
    console.log(document)
    this.document = document
  }

  @Action
  public async GetDocument() {
    let reqUrl = ''
    let username = ''
    let password = ''
    let parsedUrl = new URL(window.location.href)
    let docUrl = parsedUrl.searchParams.get('docUrl')
    if (!docUrl) {
      docUrl = (window as any).docUrl
    }
    if (docUrl) {
      parsedUrl = new URL(docUrl)
      reqUrl = parsedUrl.origin + parsedUrl.pathname + parsedUrl.search
      username = parsedUrl.username
      password = parsedUrl.password
      const resp:AxiosResponse<OpenAPIV3.Document> = await axios.get(reqUrl, {
        auth: {
          username,
          password
        }
      })
      this.SET_DOCUMENT(resp.data)
    }
  }
}

export const DocModule = getModule(Doc)
