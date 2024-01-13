<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { ref } from 'vue'
import { artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'

const articleList = ref([])
const total = ref(0)
const loading = ref(false)
const articleEditRef = ref()

const params = ref({
  pagenum: 1,
  pagesize: 10,
  cate_id: '',
  state: ''
})

// 处理文章分页
const handleSizeChange = (newSize) => {
  params.value.pagesize = newSize
  params.value.pagenum = 1
  getArticleList()
}
const handleCurrentChange = (newPage) => {
  params.value.pagenum = newPage
  getArticleList()
}

// 新增文章
const onAdd = () => {
  articleEditRef.value.open({})
}

// 编辑文章
const onEdit = (row) => {
  articleEditRef.value.open(row.row)
}

// 删除文章
const onDelete = (row) => {
  console.log(row)
}

// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 搜索
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
// 重置
const onReset = () => {
  params.value.pagenum = 1
  params.value.pagesize = 10
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 文章 新增或编辑 成功，刷新页面
const onFresh = (type) => {
  if (type === 'add') {
    //新增操作，渲染最后一页
    const lastpage = (total.value + 1) / params.value.pagesize
    params.value.pagenum = Math.ceil(lastpage) //向上取整
    // console.log('@@', params.value.pagenum)
  }
  getArticleList()
}
</script>

<template>
  <page-container class="page-container" title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAdd">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form class="header" inline>
      <el-form-item label="文章分类">
        <!-- v-model ==> :modelValue 和 @update:modelValue  注："modelValue"可自定义,如"cid" -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item class="select2" label="发布状态">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="null"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="extra-buttom">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <!-- 作用域插槽 -->
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"> </el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">{{ formatTime(row.pub_date) }}</template>
      </el-table-column>
      <el-table-column label="状态" prop="state"> </el-table-column>
      <el-table-column label="操作">
        <template #default="row"
          ><el-button
            @click="onEdit(row)"
            :icon="Edit"
            circle
            plain
            type="primary"
          ></el-button>
          <el-button
            @click="onDelete(row)"
            :icon="Delete"
            circle
            plain
            type="danger"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      class="el-pagination"
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 抽屉区域 -->
    <article-edit ref="articleEditRef" @on-refresh="onFresh"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped>
/* 父元素设置相对定位 */
.page-container {
  position: relative;
  .el-pagination {
    position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 10;
  }
}

/* 子元素设置绝对定位，并设置底部和右边的偏移量为0 */
</style>
