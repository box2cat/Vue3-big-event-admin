<script setup>
import { getCurrentInstance, ref, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artAddService,
  artGetDetailService,
  artUpdateService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const formModel = ref({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
})
const defaultForm = ref({ ...formModel.value })

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
  cover_img: [
    { required: true, message: '请选择要上传的头像', trigger: 'blur' }
  ],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

// 富文本编辑器vuequill的表单校验配置
const instance = getCurrentInstance()
const validateEditor = () => {
  instance.refs.formRef.validateField('content')
}

const editorRef = ref()
const drawer = ref(false)

// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })
    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })
    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

// 打开抽屉后，编辑或添加文章 要进行的操作
const open = async (row) => {
  drawer.value = true
  if (row.id) {
    //-------------通过 编辑文章 打开抽屉
    //获取文章详情
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgURL.value = baseURL + formModel.value.cover_img
    const file = await imageUrlToFileObject(
      imgURL.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    console.log('添加')
    //--------------通过 添加文章 打开抽屉
    //一打开默认重置form表单数据
    formModel.value = { ...defaultForm.value }
    // 等待Vue完成对DOM的更新，然后执行回调函数
    nextTick(() => {
      // 清空校验
      formRef.value.clearValidate()
      imgURL.value = ''
      editorRef.value.setHTML('')
    })
  }
}
defineExpose({ open })

// 文件上传逻辑
const imgURL = ref('')
const onChange = (uploadFile) => {
  imgURL.value = URL.createObjectURL(uploadFile.raw) //前端实现图片预览功能
  formModel.value.cover_img = uploadFile.raw //要上传的文件
}

const emit = defineEmits(['on-refresh'])
// 文章 已发布和草稿 逻辑
const formRef = ref()
const onPublish = async (stata) => {
  formModel.value.state = stata
  // 发请求前的全表校验
  await formRef.value.validate()
  // formModel:    json对象 ===> formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (!formModel.value.id) {
    // -----------没有id：添加文章
    const res = await artAddService(fd)
    // 成功则关闭抽屉，刷新页面
    if (res.data.code === 0) {
      ElMessage.success('添加文章成功')
      drawer.value = false
      emit('on-refresh', 'add')
    }
  } else {
    // ----------有id：编辑文章
    const res = await artUpdateService(fd)
    // 成功则关闭抽屉，刷新页面
    if (res.data.code === 0) {
      ElMessage.success('修改文章成功')
      drawer.value = false
      emit('on-refresh', 'edit')
    }
  }
}
</script>
<template>
  <el-drawer v-model="drawer" title="标题" :direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onChange"
        >
          <img v-if="imgURL" :src="imgURL" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
            @blur="validateEditor"
            ref="editorRef"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
