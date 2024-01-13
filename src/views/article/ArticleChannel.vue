<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDeleteChannelService } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref()
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const onEdit = (index, row) => {
  dialog.value.open(row)
}
const onAdd = () => {
  dialog.value.open({})
}
const onDelete = async (index, row) => {
  console.log(index, row.id)
  await ElMessageBox.confirm('请问确定要删除吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteChannelService(row.id)
  ElMessage.success('删除成功')
  onRefresh()
}
const onRefresh = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAdd">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" type="index" width="120"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name" />
      <el-table-column label="分类别名" prop="cate_alias" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            plain
            circle
            @click="onEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            type="danger"
            :icon="Delete"
            plain
            circle
            @click="onDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 空状态插槽  当数据为空时自定义的内容 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 弹窗 -->
    <channel-edit ref="dialog" @refresh="onRefresh"></channel-edit>
  </page-container>
</template>
