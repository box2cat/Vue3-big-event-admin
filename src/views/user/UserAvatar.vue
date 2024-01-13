<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { Plus, UploadFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { userUpdateAvatarService } from '@/api/user.js'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic) //图片预览
const uploadRef = ref()

// 实现图片本地预览
const onChange = (uploadFile) => {
  // 基于FileReader读取图片做预览
  const reader = new FileReader()
  reader.onload = (e) => {
    imgUrl.value = e.target.result
  }
  reader.readAsDataURL(uploadFile.raw)
}

const onSubmit = async () => {
  //将转换为base64格式的图片提交
  await userUpdateAvatarService(imgUrl.value)
  //更新头像
  await userStore.getUser()
  //提示更改头像成功
  ElMessage.success('上传头像成功')
}
</script>
<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="onChange"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <div class="button">
      <el-button
        type="primary"
        :icon="Plus"
        @click="uploadRef.$el.querySelector('input').click()"
        >选择图片</el-button
      >
      <el-button type="success" :icon="UploadFilled" @click="onSubmit"
        >上传头像</el-button
      >
    </div>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
.button {
  margin-top: 15px;
}
</style>
