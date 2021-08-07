import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IDocState } from './modules/doc'
import { ITagsViewState } from './modules/tags-view'
import { IPermissionState } from './modules/permission'

Vue.use(Vuex)
export interface IRootState {
  app: IAppState
  doc: IDocState
  tagsView: ITagsViewState
  permission: IPermissionState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
