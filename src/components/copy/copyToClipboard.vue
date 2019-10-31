<template>
  <el-button
    type="text"
    size="mini"
    @click="handleCopy(value)">
    复制
  </el-button>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      copyCon: null
    }
  },
  mounted() {
    document.addEventListener('copy', this.copyHandler)
  },
  destroyed() {
    document.removeEventListener('copy', this.copyHandler)
  },
  methods: {
    copyHandler(e) {
      if (this.copyCon) {
        e.preventDefault()
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', this.copyCon)
        } else if (window.clipboardData) {
          window.clipboardData.setData('Text', this.copyCon)
        }
        this.copyCon = null
        this.$message.success({
          message: '复制成功'
        })
      }
    },
    handleCopy(data) {
      this.copyCon = data
      document.execCommand('copy')
    }
  }
}
</script>

<style>

</style>
