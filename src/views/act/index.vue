<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-permission="['ADMIN','ACT_ALL','ACT_LIST']" v-model="query.value" clearable placeholder="输入活动名称或者英文名称搜索" style="width: 300px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button v-permission="['ADMIN','ACT_ALL','ACT_LIST']" class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','ACT_ALL','ACT_CREATE']"
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
      <el-table-column
        type="index"/>
      <el-table-column prop="moduleName" label="活动名称">
        <template slot-scope="scope">
          {{ scope.row.subType == 1 ? '[大促]' : '' }}{{ scope.row.moduleName }}
        </template>
      </el-table-column>
      <el-table-column prop="secondModuleName" label="英文名称"/>
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
      <el-table-column prop="linkUrl" label="Url">
        <template slot-scope="scope">
          {{ scope.row.linkUrl }}
          <copy v-model="scope.row.linkUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="showImage" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.showImage" style="height:60px;">
        </template>
      </el-table-column>
      <el-table-column prop="isDelete" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete" type="info" size="small">已下架</el-tag>
          <el-tag v-if="!scope.row.isDelete" type="success" size="small">上架中</el-tag><br>
          <el-button
            v-permission="['ADMIN','ACT_ALL','ACT_PULL_OFF']"
            v-if="!scope.row.isDelete"
            type="text"
            size="small"
            @click="subDelete(scope.row,1)">&nbsp;&nbsp;&nbsp;下架
          </el-button>
          <el-button
            v-permission="['ADMIN','ACT_ALL','ACT_PULL_ON']"
            v-if="scope.row.isDelete"
            type="text"
            size="small"
            @click="subDelete(scope.row,0)">上架
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','ACT_ALL','ACT_LEVEL_CHANGE'])" label="顺序" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','ACT_ALL','ACT_LEVEL_CHANGE']" :disabled="scope.row.isDelete ? true : false" icon="el-icon-sort-down" type="text" title="下移" @click="changeLevel(scope.row,1)"/>
          <el-button v-permission="['ADMIN','ACT_ALL','ACT_LEVEL_CHANGE']" :disabled="scope.row.isDelete ? true : false" icon="el-icon-sort-up" type="text" title="上移" @click="changeLevel(scope.row,0)"/>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','ACT_ALL','ACT_UPDATE','ACT_SETTING','REPORT_ALL','ACT_MALL_ALL','ACT_SPEC_ALL','ACT_DRAW_ALL','REPORT_ACT_PVUV','REPORT_ACT_GROUP_LIST','REPORT_ACT_GROUP_ADD','REPORT_ACT_TICKET_ADD','REPORT_DRAW_ANALYSIS_FLOP','REPORT_DRAW_ANALYSIS_LUCKY','REPORT_ACT_CARD_LIST'])" fixed="right" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','ACT_ALL','ACT_UPDATE']" size="small" type="text" @click="edit(scope.row)">编辑</el-button>
          <router-link :to="{path:'/actMall/mall',query:{'actCode':scope.row.actCode,'actName':scope.row.moduleName,'secondModuleName':scope.row.secondModuleName}}">
            <el-button v-permission="['ADMIN','ACT_ALL','ACT_SETTING','ACT_MALL_ALL','ACT_SPEC_ALL','ACT_DRAW_ALL']" size="small" type="text">配置</el-button>
          </router-link>
          <router-link :to="{path:'/report/index',query:{'actCode':scope.row.actCode,'actName':scope.row.moduleName,'secondModuleName':scope.row.secondModuleName}}">
            <el-button v-permission="['ADMIN','ACT_ALL','REPORT_ALL','REPORT_ACT_PVUV','REPORT_ACT_GROUP_LIST','REPORT_ACT_GROUP_ADD','REPORT_ACT_TICKET_ADD','REPORT_DRAW_ANALYSIS_FLOP','REPORT_DRAW_ANALYSIS_LUCKY','REPORT_ACT_CARD_LIST']" v-if="scope.row.subType == 1" size="small" type="text">数据报表</el-button>
          </router-link>
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
import { del, changeLevel, enable } from '@/api/act'
import { parseTime } from '@/utils/index'
import eForm from './form'
import copy from '@/components/copy/copyToClipboard'

export default {
  components: { eForm, copy },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      actType: [{
        value: 0,
        label: '不可变'
      }, {
        value: 1,
        label: 'H5链接'
      }, {
        value: 2,
        label: '小程序链接'
      }, {
        value: 3,
        label: '其他小程序链接'
      }],
      childType: [{
        value: 1,
        label: '大促活动'
      }, {
        value: 0,
        label: '其他'
      }]
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
      const query = this.query
      const value = query.value
      const sort = 'isDelete,orderLevel,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['blurry'] = value }
      return true
    },
    subDelete(data, flag) {
      this.delLoading = true
      if (flag) {
        del(data.actCode).then(res => {
          this.delLoading = false
          this.init()
          this.$notify({
            title: '下架成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          this.delLoading = false
          console.log(err.message)
        })
      } else {
        enable(data.actCode).then(res => {
          this.delLoading = false
          this.init()
          this.$notify({
            title: '上架成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          this.delLoading = false
          console.log(err.message)
        })
      }
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      console.log(data)
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        nameShowFlag: true,
        moduleName: data.moduleName,
        secondModuleName: data.secondModuleName,
        moduleType: data.moduleType,
        subType: data.subType,
        actCode: data.actCode,
        endTime: data.endTime,
        showImage: data.showImage,
        linkUrl: data.linkUrl,
        posterId: data.posterId,
        channelId: data.channelId,
        configData: data.configData,
        actEndTime: data.actEndTime,
        fileList: [{ name: data.showImage, url: data.showImage }]
      }
      _this.dialog = true
    },
    /**
     * 上下移
     * @param data
     * @param flag 1 下  0 上
     */
    changeLevel(data, flag) {
      console.log('上下移', data, flag)
      changeLevel({ actCode: data.actCode, isDown: flag }).then(res => {
        this.init()
        this.$notify({
          title: (flag === 1 ? '下移' : '上移') + '成功',
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
