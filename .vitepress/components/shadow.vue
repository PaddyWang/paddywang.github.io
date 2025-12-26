<template>
  <div ref="shadowBox"></div>
</template>
<script setup lang="ts">
  // @ts-ignore
  import { ref, onMounted, defineProps } from 'vue'
  
  const props = defineProps<{src: string}>()
  const shadowBox = ref()

  onMounted(async () => {
    const shadow = shadowBox.value.attachShadow({ mode: 'open' })
    const loadSource = await import(/* @vite-ignore */props.src).then(m => m.default)
    shadow.innerHTML = loadSource
    // 处理脚本
    const scriptStr = loadSource.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    if (scriptStr) {
      const scriptEl = document.createElement('script')
      // @ts-ignore
      window.__SHADOW_ROOT__ = shadow
      scriptEl.textContent = `(function(document){
        ${scriptStr[1]}
      })(window.__SHADOW_ROOT__)`
      shadow.appendChild(scriptEl)
    }
  })
</script>