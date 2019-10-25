<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="medium" style="width: 100%;">
      <el-table-column prop="actName" label="Name"/>
      <el-table-column prop="actCode" label="code"/>
      <el-table-column prop="hideTime" label="列表隐藏时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="活动结束时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="linkUrl" label="Url"/>
      <el-table-column prop="showImage" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.showImage" style="height:60px;">
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT','TBWAPACTMODULE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="edit(scope.row)">上移</el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="edit(scope.row)">下移</el-button>
          <el-popover
            v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定下架该活动吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="small">下架</el-button>
          </el-popover>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="edit(scope.row)">数据报表</el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="edit(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/act'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/actModule'
      // const sort = 'id,desc'
      // this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        actName: data.moduleName,
        actCode: data.actCode,
        endTime: data.endTime,
        showImage: data.showImage,
        linkUrl: data.linkUrl
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
