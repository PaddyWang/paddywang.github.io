<template>
  <div ref="viewBox"></div>
</template>
<script setup lang="ts">
  // @ts-ignore
  import { ref, onMounted, defineProps } from 'vue'

  console.log('>>>')
  
  const props = defineProps<{src: any}>()
  const viewBox = ref()

  onMounted(async () => {
    const viewEl = viewBox.value
    // @ts-ignore
    const loadSource = await props.src.then(m => m.default)
    viewEl.innerHTML = loadSource
    // 处理脚本
    const scriptStr = loadSource.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    if (scriptStr) {
      const scriptEl = document.createElement('script')
      scriptEl.textContent = `(function(){
        ${scriptStr[1]}
      })()`
      viewEl.appendChild(scriptEl)
    }
  })
</script>