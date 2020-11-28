<template>
  <div style="padding-left: 15px;"  class="bread-container">
    <span class="iconfont icon-santiaoxian"></span>
    <span>位置：</span>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
.bread-container{
  font-size: 19px;
  color:#fff;
}
</style>
