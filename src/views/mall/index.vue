<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','TBWAPMALL_ALL','TBWAPMALL_CREATE']"
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
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="自增主键"/>
      <el-table-column prop="omsCode" label="商场编码"/>
      <el-table-column prop="mallCode" label="商场编码"/>
      <el-table-column prop="mallName" label="商场名称"/>
      <el-table-column prop="province" label="省份"/>
      <el-table-column prop="city" label="城市"/>
      <el-table-column prop="selfFlag" label="自营商场标识"/>
      <el-table-column prop="entranceEnable" label="活动列表商场启用状态"/>
      <el-table-column prop="defaultEnable" label="是否为城市默认商场"/>
      <el-table-column prop="defultJoin" label="是否参与活动的默认值 0不参与 1 参与"/>
      <el-table-column prop="detailAddress" label="详细地址"/>
      <el-table-column prop="isMl" label="是否为瞄零商场 0不是 1是"/>
      <el-table-column v-if="checkPermission(['ADMIN','TBWAPMALL_ALL','TBWAPMALL_EDIT','TBWAPMALL_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','TBWAPMALL_ALL','TBWAPMALL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','TBWAPMALL_ALL','TBWAPMALL_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
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
import { del } from '@/api/tbWapMall'
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
    checkPermission,
    beforeInit() {
      this.url = 'api/tbWapMall'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
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
        id: data.id,
        omsCode: data.omsCode,
        mallCode: data.mallCode,
        mallName: data.mallName,
        province: data.province,
        city: data.city,
        selfFlag: data.selfFlag,
        entranceEnable: data.entranceEnable,
        defaultEnable: data.defaultEnable,
        defultJoin: data.defultJoin,
        detailAddress: data.detailAddress,
        isMl: data.isMl
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
