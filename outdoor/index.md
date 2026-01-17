# @蝎子穿行


<script setup>
import data from './data'
</script>

<ul v-for="item in data">
  <li>
    <img :src="item.img" />
    <a :href="item.link" target="_blank">{{ item.text }}</a>
  </li>
</ul>

🎸🤸🏇🏂🏔️🧗🏊🤿🏄🪂🚁