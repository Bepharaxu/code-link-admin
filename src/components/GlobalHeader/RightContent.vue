<template>
  <div :class="wrpCls">
    <!-- PRO标识 -->
    <div v-if="isPro" class="pro-edition">
      <a-tooltip placement="bottom">
        <template slot="title">
          <span class="f-12">当前为专业版系统</span>
        </template>
        <div class="mark">
          <span>Pro</span>
        </div>
      </a-tooltip>
    </div>
    <!-- 管理员菜单 -->
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
// import SelectLang from '@/components/SelectLang'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown
    // SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    const currentUser = this.$store.getters.userInfo
    return {
      showMenu: true,
      currentUser,
      isPro: true
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
.pro-edition {
  width: 66px;
  display: flex;
  justify-content: center;
  align-items: center;
  .mark {
    width: 50px;
    height: 23px;
    line-height: 23px;
    background: #413f3e;
    border-radius: 15px;
    cursor: pointer;
    text-align: center;
    color: #ffecc4;
    font-size: 12.6px;
    letter-spacing: 0.6px;
  }
}
</style>
