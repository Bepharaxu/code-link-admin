<template>
  <div class="editor">
    <!-- 标题 -->
    <div class="editor-title">
      <span>{{ selectedIndex === 'page' ? data.page.name : curItem.name }}</span>
    </div>

    <!-- 编辑器: 标题栏 -->
    <div v-if="selectedIndex === 'page'" class="editor-content">
      <a-tabs>
        <a-tab-pane key="1" tab="页面设置">
          <div class="block-box">
            <div class="block-title">基本信息</div>
            <div class="block-item">
              <span class="label">页面名称</span>
              <div class="flex-box">
                <a-input v-model="data.page.params.name" />
                <div class="tips">页面名称仅用于后台管理</div>
              </div>
            </div>
            <div class="block-item">
              <span class="label">分享标题</span>
              <div class="flex-box">
                <a-input v-model="data.page.params.shareTitle" />
                <div class="tips">用户端转发时显示的标题</div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="标题栏设置">
          <div class="block-box">
            <div class="block-title">标题栏设置</div>
            <div class="block-item">
              <span class="label">标题名称</span>
              <div class="flex-box">
                <a-input v-model="data.page.params.title" />
                <div class="tips">用户端端顶部显示的标题</div>
              </div>
            </div>
            <div class="block-item">
              <span class="label">文字颜色</span>
              <a-radio-group buttonStyle="solid" v-model="data.page.style.titleTextColor">
                <a-radio-button value="white">白色</a-radio-button>
                <a-radio-button value="black">黑色</a-radio-button>
              </a-radio-group>
            </div>
            <div class="block-item">
              <span class="label">标题栏背景</span>
              <div class="item-colorPicker">
                <span
                  class="rest-color"
                  @click="onEditorResetColor(data.page.style, 'titleBackgroundColor', '#fff')"
                >重置</span>
                <colorPicker v-model="data.page.style.titleBackgroundColor" defaultColor="#fff" />
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <template v-if="data.items.length && curItem">

      <!-- 富文本 -->
      <div v-if="curItem.type == 'richText'" :style="{ width: '395px' }" class="editor-content">
        <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="block-box">
              <div class="block-title">文本内容</div>
              <div class="ueditor">
                <Ueditor v-model="curItem.params.content" :config="{ initialFrameWidth: 375  }" />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="block-box">
              <div class="block-title">组件样式</div>
              <div class="block-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ curItem.style.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="block-item">
                <span class="label">左右边距</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.paddingLeft" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ curItem.style.paddingLeft }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="block-item">
                <span class="label">背景颜色</span>
                <div class="item-colorPicker">
                  <span
                    class="rest-color"
                    @click="onEditorResetColor(curItem.style, 'background', '#fff')"
                  >重置</span>
                  <colorPicker v-model="curItem.style.background" defaultColor="#fff" />
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 视频 -->
      <div v-if="curItem.type == 'video'" class="editor-content">
        <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="block-box">
              <div class="block-title">功能设置</div>
              <div class="block-item">
                <span class="label">视频地址</span>
                <div class="flex-box">
                  <a-input v-model="curItem.params.videoUrl" />
                  <div class="tips">仅支持.mp4格式的视频源地址</div>
                </div>
              </div>
              <div class="block-item">
                <span class="label">视频封面</span>
                <div class="flex-box">
                  <SImage v-model="curItem.params.poster" :width="160" :height="90" />
                  <div class="tips">建议封面图片尺寸与视频比例一致</div>
                </div>
              </div>
            </div>
            <div class="block-box">
              <div class="block-title">播放设置</div>
              <div class="block-item">
                <span class="label">自动播放</span>
                <span class="tips-wrap">仅支持小程序</span>
                <a-radio-group buttonStyle="solid" v-model="curItem.params.autoplay">
                  <a-radio-button :value="1">开启</a-radio-button>
                  <a-radio-button :value="0">关闭</a-radio-button>
                </a-radio-group>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="block-box">
              <div class="block-title">
                <span>内容样式</span>
                <span class="tips">视频宽度为750像素</span>
              </div>
              <div class="block-item">
                <span class="label">视频高度</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.height" :min="50" :max="400" />
                  <span class="unit-text">
                    <span>{{ curItem.style.height }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="block-box">
              <div class="block-title">组件样式</div>
              <div class="block-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ curItem.style.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 图片 -->
      <div v-if="curItem.type == 'image'" class="editor-content">
        <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="sub-title">添加图片 (最多10张，可拖动排序）</div>
            <draggable
              :list="curItem.data"
              v-bind="{ animation: 120, filter: 'input', preventOnFilter: false }"
            >
              <div v-for="(item, index) in curItem.data" :key="index" class="block-box drag">
                <div class="block-title">
                  <span class="left">图片 {{ index + 1 }}</span>
                  <a class="link" @click="handleDeleleData(curItem, index)">删除</a>
                </div>
                <div class="block-item">
                  <div class="block-item-common">
                    <div class="block-item-common-row">
                      <span class="label">图片</span>
                      <span class="label value">{{ item.imgName }}</span>
                    </div>
                    <div class="block-item-common-row">
                      <span class="label">链接</span>
                      <SLink v-model="item.link" />
                    </div>
                  </div>
                  <div class="block-item-custom">
                    <SImage
                      v-model="item.imgUrl"
                      tips="建议尺寸：宽750"
                      @update="item.imgName = $event.file_name"
                    />
                  </div>
                </div>
              </div>
            </draggable>
            <div v-if="curItem.data.length < 10" class="data-add">
              <a-button icon="plus" @click="handleAddData(10)">添加图片</a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="block-box">
              <div class="block-title">组件样式</div>
              <div class="block-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ curItem.style.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="block-item">
                <span class="label">左右边距</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.paddingLeft" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ curItem.style.paddingLeft }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="block-item">
                <span class="label">背景颜色</span>
                <div class="item-colorPicker">
                  <span
                    class="rest-color"
                    @click="onEditorResetColor(curItem.style, 'background', '#fff')"
                  >重置</span>
                  <colorPicker v-model="curItem.style.background" defaultColor="#fff" />
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 轮播图 -->
      <div v-if="curItem.type == 'banner'" class="editor-content">
        <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="sub-title">添加图片 (最多10张，可拖动排序）</div>
            <draggable
              :list="curItem.data"
              v-bind="{ animation: 120, filter: 'input', preventOnFilter: false }"
            >
              <div v-for="(item, index) in curItem.data" :key="index" class="block-box drag">
                <div class="block-title">
                  <span class="left">图片 {{ index + 1 }}</span>
                  <a class="link" @click="handleDeleleData(curItem, index)">删除</a>
                </div>
                <div class="block-item">
                  <div class="block-item-common">
                    <div class="block-item-common-row">
                      <span class="label">图片</span>
                      <span class="label value">{{ item.imgName }}</span>
                    </div>
                    <div class="block-item-common-row">
                      <span class="label">链接</span>
                      <SLink v-model="item.link" />
                    </div>
                  </div>
                  <div class="block-item-custom">
                    <SImage
                      v-model="item.imgUrl"
                      tips="建议尺寸：750×400"
                      @update="item.imgName = $event.file_name"
                    />
                  </div>
                </div>
              </div>
            </draggable>
            <div v-if="curItem.data.length < 10" class="data-add">
              <a-button icon="plus" @click="handleAddData(10)">添加图片</a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="block-box">
              <div class="block-title">内容样式</div>
              <div class="block-item">
                <span class="label">指示点形状</span>
                <a-radio-group buttonStyle="solid" v-model="curItem.style.btnShape">
                  <a-radio-button value="round">圆形</a-radio-button>
                  <a-radio-button value="square">正方形</a-radio-button>
                  <a-radio-button value="rectangle">长方形</a-radio-button>
                </a-radio-group>
              </div>
              <div class="block-item">
                <span class="label">指示点颜色</span>
                <div class="item-colorPicker">
                  <span
                    class="rest-color"
                    @click="onEditorResetColor(curItem.style, 'btnColor', '#fff')"
                  >重置</span>
                  <colorPicker v-model="curItem.style.btnColor" defaultColor="#fff" />
                </div>
              </div>
              <div class="block-item">
                <span class="label">切换时间</span>
                <div class="item-slider" style="width: 190px;">
                  <a-slider v-model="curItem.style.interval" :step="1" :min="1" :max="20" />
                  <span class="unit-text">
                    <span>{{ curItem.style.interval }}</span>
                    <span>秒</span>
                  </span>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 图片 -->
      <div v-if="curItem.type == 'hotZone'" class="editor-content">
        <a-tabs>
          <a-tab-pane key="1" tab="内容设置">
            <div class="sub-title">实现点击图片不同位置，跳转不同的链接</div>

            <div class="block-box">
              <div class="block-title">
                <span class="left">背景图片</span>
              </div>
              <div class="block-item">
                <div class="block-item-common">
                  <div class="block-item-common-row">
                    <span class="label">图片</span>
                    <span class="label value">{{ curItem.data.imgName }}</span>
                  </div>
                  <div class="block-item-common-row">
                    <span class="label">链接</span>
                    <SHotZone v-model="curItem.data.maps" :image="curItem.data.imgUrl" />
                  </div>
                </div>
                <div class="block-item-custom">
                  <SImage
                    v-model="curItem.data.imgUrl"
                    tips="建议尺寸：宽750"
                    @update="curItem.data.imgName = $event.file_name"
                  />
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="样式设置">
            <div class="block-box">
              <div class="block-title">组件样式</div>
              <div class="block-item">
                <span class="label">上下边距</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.paddingTop" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ curItem.style.paddingTop }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="block-item">
                <span class="label">左右边距</span>
                <div class="item-slider">
                  <a-slider v-model="curItem.style.paddingLeft" :min="0" :max="50" />
                  <span class="unit-text">
                    <span>{{ curItem.style.paddingLeft }}</span>
                    <span>像素</span>
                  </span>
                </div>
              </div>
              <div class="block-item">
                <span class="label">背景颜色</span>
                <div class="item-colorPicker">
                  <span
                    class="rest-color"
                    @click="onEditorResetColor(curItem.style, 'background', '#fff')"
                  >重置</span>
                  <colorPicker v-model="curItem.style.background" defaultColor="#fff" />
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import vcolorpicker from 'vcolorpicker'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import draggable from 'vuedraggable'
import { Ueditor, SelectCategory } from '@/components'
import { SImage, SArticleCate, SGoods, SLink, SShop, SBargainGoods, SGrouponGoods, SHotZone } from './modules'

Vue.use(vcolorpicker)

export default {
  props: {
    // 页面装修默认数据
    defaultData: PropTypes.object.def({}),
    // 页面数据
    data: PropTypes.object.def({}),
    // 当前选中的元素
    curItem: PropTypes.object.def({}),
    // 当前选中的元素索引
    selectedIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(0)
  },
  components: {
    draggable,
    Ueditor,
    SImage,
    SArticleCate,
    SGoods,
    SelectCategory,
    SLink,
    SShop,
    SBargainGoods,
    SGrouponGoods,
    SHotZone
  },
  data () {
    return {}
  },
  methods: {

    // 新增数据
    handleAddData (max = 1) {
      const { defaultData, curItem } = this
      const newDataItem = defaultData.items[curItem.type].data[0]
      curItem.data.push(_.cloneDeep(newDataItem))
    },

    /**
     * 编辑器：删除data元素
     * @param curItem
     * @param index
     */
    handleDeleleData (curItem, index) {
      if (curItem.data.length <= 1) {
        this.$message.warning('至少保留一个')
        return false
      }
      curItem.data.splice(index, 1)
    },

    /**
     * 重置颜色
     * @param holder
     * @param attribute
     * @param color
     */
    onEditorResetColor (holder, attribute, color) {
      holder[attribute] = color
    }

  }
}
</script>
<style lang="less" scoped>
@import './style.less';
</style>
