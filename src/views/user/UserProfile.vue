<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'

const formRef = ref()

// 获取本地user相关信息
// 解构的语法格式
const {
  user: { id, username, nickname, email },
  getUser
} = useUserStore()
const userInfo = ref({ id, username, nickname, email })

const rules = {
  username: [
    { required: 'true', message: '登录名称不能为空', trigger: 'blur' }
  ],
  nickname: [
    { required: 'true', message: '用户昵称不能为空', trigger: 'blur' }
  ],
  email: [{ required: 'true', message: '用户邮箱不能为空', trigger: 'blur' }]
}

const onSubmit = async () => {
  //等待提交之前的全表校验
  await formRef.value.validate()
  //等待更新user信息
  await userUpdateInfoService(userInfo.value)
  //获取提交后的user信息
  getUser()
  ElMessage.success('提交修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <el-form
      ref="formRef"
      class="form-container"
      :model="userInfo"
      :rules="rules"
    >
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item class="button">
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped>
.form-container {
  width: 500px;
  .button {
    margin-left: 80px;
  }
}
</style>
