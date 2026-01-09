import { extname } from 'path'

const EnforcePre = 'pre' as const;

export default function markmapPreprocess() {
  return {
    name: 'markmap-preprocess',

    enforce: EnforcePre,
    
    // 在转换之前处理
    transform(src: string, id: string) {
      // 只处理 .md 文件
      if (extname(id) !== '.md') return

      let transformed = src
      
      // 转换 :::markmap 自定义容器
      transformed = transformed.replace(
        /^:::\s*markmap(?: +(.*?))?\n([\s\S]*?)\n:::/gm,
        (_: any, props: string, content: string) => {
          const propsArr = props.split(/[ ]+/)
          const propsStr = propsArr.map((prop: string) => {
            const [key, value] = prop.split(':')
            return `${key}="${value}"`
          }).join(' ')

          return `\n<markmap ${propsStr}>\n<pre>\n${content}\n</pre>\n</markmap>\n`
        }
      )
      
      // 如果内容被修改，返回新内容
      if (transformed !== src) {
        return {
          code: transformed,
          map: null // 可以提供 source map
        }
      }
      
      return null
    }
  }
}