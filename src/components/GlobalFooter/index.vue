<template>
  <global-footer v-if="visibility" class="footer custom-render">
    <template v-slot:links>
      <!-- <a href="https://www.github.com/vueComponent/pro-layout" target="_blank">Pro Layout</a>
      <a href="https://www.github.com/vueComponent/ant-design-vue-pro" target="_blank">Github</a>
      <a href="https://www.github.com/sendya/" target="_blank">@Sendya</a>-->
    </template>
    <template v-slot:copyright>
      <span style="margin-right: 6px">{{ copyright }}</span>
      <a :href="link.url" target="_blank">{{ link.text }}</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@/layouts/ProLayout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  },
  data () {
    return {
      visibility: false,
      copyright: 'Copyright © 2021 鑫玺云科技 |',
      link: {
        text: 'XXY.COM',
        url: 'https:/ynzds.xxy-nirvana.com'
      }
    }
  }
}
</script>
