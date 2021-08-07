import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { OpenAPIV3 } from 'openapi-types'
import axios, { AxiosResponse } from 'axios'

export interface IDocState {
  document: OpenAPIV3.Document
}

@Module({ dynamic: true, store, name: 'doc' })
class Doc extends VuexModule implements IDocState {
  public document: OpenAPIV3.Document<{}> = {} as OpenAPIV3.Document<{}>

  @Mutation
  private SET_DOCUMENT(document: OpenAPIV3.Document) {
    this.document = document
  }

  @Action
  public async GetDocument() {
    const resp:AxiosResponse<OpenAPIV3.Document> = await axios.get('https://petstore3.swagger.io/api/v3/openapi.json', {
      // auth: {
      //   username: '',
      //   password: ''
      // }
    })
    this.SET_DOCUMENT(resp.data)
  }
}

export const DocModule = getModule(Doc)
