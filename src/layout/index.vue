<template>
  <div
    :class="classObj"
    class="app-wrapper"
    id="appWrapper"
    @mouseleave="this.stopResize"
    @mouseup="this.stopResize"
  >
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container"  :style="{width: vNum+'px'}" />
  <div class="resize"  draggable={false} @mousedown="this.vResizeDown" :style="{left: vNum+'px'}"></div>
    <div
      :class="{hasTagsView: showTagsView}"
      class="main-container"
       :style="{marginLeft: vNum+'px'}"
    >
      <div :class="{'fixed-header': fixedHeader}" :style="{width: 'calc(100% - vNum)'+'px'}">
        <navbar />
        <tags-view v-if="showTagsView" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule } from '@/store/modules/app'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/resize'
import settings from '@/settings'
// import _ from 'underscore'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  }
})
export default class extends mixins(ResizeMixin) {
  private resizeOffsetInfo = { clientTop: 0, clientLeft: 0 }
  private leftHeight = 0
  private containerWidth = 0
  private isVResize = false
  private vNum = 210
  private vNumLimit = 210

  mounted() {
    this.initResizeInfo()
    // const throttled = _.throttle(() => {
    //   this.initResizeInfo()
    // }, 200)
    // window.onresize = throttled
  }

  // beforeMount() {
  //   window.onresize = null
  // }

  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile
    }
  }

  get showTagsView() {
    return settings.showTagsView
  }

  get fixedHeader() {
    return settings.fixedHeader
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }

  private initResizeInfo() {
    const hEle = document.getElementById('appWrapper') as HTMLDivElement
    this.resizeOffsetInfo = this.getEleOffset(hEle)
    this.leftHeight = hEle.offsetHeight
    this.containerWidth = hEle.offsetWidth
  }

  /**
  * 获取元素的偏移信息
  */
  private getEleOffset(ele: any) {
    let clientTop = ele.offsetTop
    let clientLeft = ele.offsetLeft
    let current = ele.offsetParent
    while (current !== null) {
      clientTop += current.offsetTop
      clientLeft += current.offsetLeft
      current = current.offsetParent
    }
    return {
      clientTop,
      clientLeft,
      height: ele.offsetHeight,
      width: ele.offsetWidth
    }
  }

  /**
  * 开始拖动水平调整块
  */
  private vResizeDown() {
    this.isVResize = true
    const dom = document.querySelector('#appWrapper') as HTMLDivElement
    dom.addEventListener('mousemove', this.vResizeOver)
  }

  /**
  * 拖动水平调整块
  */
  private vResizeOver(e:any) {
    // const { isVResize, vNum, vNumLimit } = this.state
    if (this.isVResize && (this.vNum >= this.vNumLimit) && (this.containerWidth - this.vNum >= this.vNumLimit)) {
      let newValue = e.clientX - this.resizeOffsetInfo.clientLeft
      if (newValue < this.vNumLimit) {
        newValue = this.vNumLimit
      }
      if (newValue > this.containerWidth - this.vNumLimit) {
        newValue = this.containerWidth - this.vNumLimit
      }
      this.vNum = newValue
    }
  }

  /**
  * 只要鼠标松开或者离开区域，那么就停止resize
  */
  stopResize = () => {
    this.isVResize = false
    const dom = document.querySelector('#appWrapper') as HTMLDivElement
    dom.removeEventListener('mousemove', this.vResizeOver)
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left .28s;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.resize{
   height: 100%;
  width: 2px;
  position: fixed;
  background: rgba(0,0,0,0);
  z-index: 1001;
  cursor: col-resize;
  user-select: none;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }

  .fixed-header {
    width: calc(100% - 54px)
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform .28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
