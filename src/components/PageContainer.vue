<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="page-header">
        <span>{{ title }}</span>
        <!-- 具名插槽 -->
        <slot name="extra"></slot>
      </div>
    </template>
    <!-- 默认插槽 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  box-sizing: border-box;
  height: 100%;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
