<template>
  <div ref="shadowBox">
  </div>
  <div ref="contentRef" style="display: none">
    <slot />
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, defineProps } from 'vue'
  
  const props = defineProps<{src: any}>()
  const shadowBox = ref()
  const contentRef = ref<HTMLElement>()

  onMounted(async () => {
    const shadow = shadowBox.value.attachShadow({ mode: 'open' })
    shadow.innerHTML = contentRef.value?.innerHTML?.replace(/&lt;/g, '<')?.replace(/&gt;/g, '>') || ''
    // 处理脚本
    // const scriptStr = loadSource.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    // if (scriptStr) {
    //   const scriptEl = document.createElement('script')
    //   // @ts-ignore
    //   window.__SHADOW_ROOT__ = shadow
    //   scriptEl.textContent = `(function(document){
    //     ${scriptStr[1]}
    //   })(window.__SHADOW_ROOT__)`
    //   shadow.appendChild(scriptEl)
    // }
  })
</script>