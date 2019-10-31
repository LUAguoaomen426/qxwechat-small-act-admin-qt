<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入商场编号或名称搜索" style="width: 300px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 同步 -->
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-refresh"
        @click="async">同步</el-button>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column
        type="index"/>
      <el-table-column prop="mallName" label="商场名称"/>
      <el-table-column prop="omsCode" label="omsCode"/>
      <el-table-column prop="mallCode" label="mallCode"/>
      <el-table-column prop="province" label="省份"/>
      <el-table-column prop="city" label="城市"/>
      <el-table-column prop="detailAddress" label="详细地址"/>
      <el-table-column prop="entranceEnable" label="是否参与活动列表">
        <template slot-scope="props">
          <el-tag v-if="props.row.entranceEnable" type="success">参与</el-tag>
          <el-tag v-if="!props.row.entranceEnable" type="info">不参与</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="defaultEnable" label="是否为城市默认商场">
        <template slot-scope="props">
          <el-tag v-if="props.row.defaultEnable" type="success">是</el-tag>
          <el-tag v-if="!props.row.defaultEnable" type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="selfFlag" label="是否自营">
        <template slot-scope="props">
          <el-tag v-if="props.row.selfFlag" type="success">是</el-tag>
          <el-tag v-if="!props.row.selfFlag" type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isMl" label="是否为瞄零商场">
        <template slot-scope="props">
          <el-tag v-if="props.row.isMl" type="success">是</el-tag>
          <el-tag v-if="!props.row.isMl" type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','TBWAPMALL_ALL','TBWAPMALL_EDIT','TBWAPMALL_DELETE'])" fixed="right" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','TBWAPMALL_ALL','TBWAPMALL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
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
import { del, async } from '@/api/mall'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      loading: false
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
      this.url = 'api/mall'
      const query = this.query
      const value = query.value
      const sort = 'province,city,omsCode,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['blurry'] = value }
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
    },
    async() {
      this.loading = true
      async().then(res => {
        this.init()
        this.$notify({
          title: '同步成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
