<script setup>
import { ref, nextTick } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { defineEmits } from 'vue'

const dialogVisible = ref(false)
const form = ref()

//父传子
const open = async (row) => {
  dialogVisible.value = true
  //扩展运算符（...obj）用于取出 obj 参数对象 所有 可遍历属性 然后拷贝到当前对象
  formModel.value = { ...row }
  //清除表单校验
  nextTick(() => {
    form.value.clearValidate()
  })
  if (row.id) {
    // 编辑操作：
    console.log('编辑分类')
  } else {
    // 添加操作：
    console.log('添加分类')
    //
  }
  // console.log(formModel.value.id)
}
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '分类名称不能为空', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '分类别名不能为空', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

//子传父：进行回显
const emit = defineEmits(['refresh'])
const onConfirm = async () => {
  // 发请求前，进行全表校验
  await form.value.validate()

  if (formModel.value.id) {
    //id存在，发文章分类 编辑 请求
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    //id不存在，发文章分类 添加 请求
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('refresh')
}

defineExpose({ open })
</script>
<template>
  <!-- dialog对话框(编辑&添加的弹窗) -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form :model="formModel" :rules="rules" ref="form">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          placeholder="请输入分类名称"
          v-model="formModel.cate_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          placeholder="请输入分类别名"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
