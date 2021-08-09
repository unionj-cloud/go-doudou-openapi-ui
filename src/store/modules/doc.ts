import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { OpenAPIV3 } from 'openapi-types'
import axios, { AxiosResponse } from 'axios'

export interface IDocState {
  docUrl: string
  document: OpenAPIV3.Document
}

@Module({ dynamic: true, store, name: 'doc' })
class Doc extends VuexModule implements IDocState {
  public docUrl = ''
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
    this.document = document
  }

  @Mutation
  private SET_DOCURL(docUrl: string) {
    this.docUrl = docUrl
  }

  @Action
  public async GetDocument() {
    let reqUrl = ''
    let username = ''
    let password = ''
    let parsedUrl = new URL(window.location.href)
    const search = parsedUrl.hash.substring(parsedUrl.hash.indexOf('?'))
    parsedUrl = new URL(`http://localhost${search}`)
    const docUrl = parsedUrl.searchParams.get('docUrl')
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
      this.SET_DOCURL(docUrl)
    } else if ((window as any).doc) {
      this.SET_DOCUMENT((window as any).doc)
      this.SET_DOCURL((window as any).docUrl)
    }
  }
}

export const DocModule = getModule(Doc)
