<template>
  <section>
    <svg :height="height" :width="width">
      <circle
        :cx="cVal"
        :cy="cVal"
        :r="r"
        stroke="#E9E9E9"
        stroke-width="20"
        fill="none"
      />
      <circle
        :r="r"
        :cx="cVal"
        :cy="cVal"
        :stroke="stroke"
        fill="transparent"
        stroke-dasharray="150"
        stroke-dashoffset="60"
        stroke-width="20"
      ></circle>
      <text x="45" y="65" fill="#333739">33%</text>
    </svg>
  </section>
</template>

<script>

export default {
  name: 'SvgCircle',
  props: {
    width: {
      type: String,
      default: '120'
    },
    height: {
      type: String,
      default: '120'
    },
    r: {
      type: String,
      default: '40'
    },
    stroke: {
      type: String,
      default: '#EF263D'
    }
  },
  computed: {
    cVal() {
      return parseInt(this.r) + 10
    },
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
