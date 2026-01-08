<template>
  <div class="overflow-auto">
    <svg ref="svgRef" class="markmap-svg" :style="`width: ${handleSize(props.width)}; height: ${handleSize(props.height ?? '500px')};`"></svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'

interface Props {
  width?: number | string
  height?: number | string
  src: any
}

const props = defineProps<Props>()

const handleSize = (size: any = '100%') => /%|px|rem$/.test(String(size)) ? size : `${size}px`

const svgRef = ref(null)

onMounted(async () => {
  const transformer = new Transformer()
  // @ts-ignore
  const loadSource = await props.src.then(m => m.default)
  const { root } = transformer.transform(loadSource)
  const markmap = Markmap.create(svgRef.value, {
    color: () => 'var(--primay)',
    zoom: false,
    spacingHorizontal: 24,
    spacingVertical: 10,
    pan: false,
    maxInitialScale: 1,
  }, root)
})
</script>

<style>
.markmap-svg {
  background-color: var(--vp-c-bg-alt);
  border-radius: 8px;
}
.markmap {
  color: var(--vp-c-text-1) !important;
}
</style>
