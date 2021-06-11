<template>
  <div id="app">
    <live2d
      :style="style"
      :model="[1, 53]"
      :direction="direction"
      :size="size"
    />
  </div>
</template>

<script>
import live2d from './components/vue-live2d/index'

export default {
  name: 'App',
  components: {
    live2d
  },
  data () {
    return {
      direction: 'right',
      style: 'position: fixed; top: 50%; left: 50%;transform: translate(-50%, -50%)',
      size: 200,
      tips: {
        mouseover: [{
          selector: '.vue-live2d',
          texts: ['这样可以修改默认语句']
        }]
      }
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
