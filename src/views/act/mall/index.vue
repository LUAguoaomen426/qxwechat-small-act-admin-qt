<template>
  <div class="app-container">
    <div class="head-container">
      <div class="page-container">
        <b>活动名称：</b>
        <el-button type="text">
          <router-link :to="{path:'/act/actList'}">
            {{ this.$route.query.actName }}
          </router-link>
        </el-button>
        <b>活动编号：</b>
        <label>{{ this.$route.query.actCode }}</label>
        <b>英文名称 ：</b>
        <label>{{ this.$route.query.secondModuleName }}</label>
      </div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item v-permission="['ADMIN','ACT_SETTING','ACT_MALL_ALL']" index="1">商场</el-menu-item>
        <el-menu-item v-permission="['ADMIN','ACT_SETTING','ACT_SPEC_ALL']" index="2">广告位</el-menu-item>
        <el-menu-item v-permission="['ADMIN','ACT_SETTING','ACT_DRAW_ALL']" index="3">抽奖信息</el-menu-item>
      </el-menu>
      <div v-if="innerShow==1" style="display: inline-block;margin: 20px 2px;">
        <el-input
          v-model="mallSearch"
          clearable
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button
          v-permission="['ADMIN','ACT_MALL_ALL','ACT_MALL_SELECT_ACT']"
          class="filter-item"
          icon="el-icon-search"
          size="mini"
          type="success"
          @click="search"
        >搜索</el-button>
        <el-upload
          v-permission="['ADMIN','ACT_MALL_ALL','ACT_MALL_EXCEL_SYNC']"
          :limit="1"
          :show-file-list="false"
          :action="'/api/' + this.$route.query.actCode + '/mallInfo/upload'"
          :headers="myHeaders"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          class="filter-item"
          style="margin-bottom:auto;"
        >
          <el-button class="filter-item" size="mini" icon="el-icon-upload" type="primary">点击上传</el-button>
        </el-upload>
        <!--<el-button  class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="updataE">上传-->
        <!--</el-button>-->
        <el-button
          v-permission="['ADMIN','ACT_MALL_ALL','ACT_MALL_SAVE_ACT']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-success"
          @click="keepE"
        >保存</el-button>
      </div>
      <div v-if="innerShow==2" style="display: inline-block;margin: 20px 2px;">
        <el-button
          v-permission="['ADMIN','ACT_SPEC_ALL','ACT_SPEC_ADD']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addAdS"
        >新增</el-button>
      </div>
      <div v-if="innerShow==3" style="display: inline-block;margin: 20px 2px;">
        <el-button
          v-permission="['ADMIN','ACT_DRAW_ALL','ACT_DRAW_INFO_SAVE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="newDrawData"
        >新增</el-button>
      </div>
    </div>
    <!--    商场   -->
    <el-table
      v-loading="loading"
      v-if="innerShow==1"
      key="tableData"
      :data="newTableData">
      <el-table-column type="index" />
      <el-table-column prop="omsCode" label="omsCode" />
      <el-table-column prop="mallCode" label="mallCode" />
      <el-table-column prop="province" label="省" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="mallName" label="商场" />
      <el-table-column prop="isJoin" label="是否参加">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isJoin" active-color="#13ce66" inactive-color="#ff4949" @change="changeIsJoin(scope.row)" />
        </template>
      </el-table-column>
      <!--<el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN','ACT_MALL_ALL','ACT_MALL_REFRESH_ACT']"
            size="small"
            type="text"
            @click="refresh(scope.row)"
          >刷新</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <!--    广告位   -->
    <el-table v-loading="linkLoading" v-if="innerShow==2" :data="linkData" style="width: 100%">
      <el-table-column type="index" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">{{ scope.row.type === 1 ?'内部':'外部' }}</template>
      </el-table-column>
      <el-table-column prop="specCode" label="编号" />
      <el-table-column prop="url" label="url">
        <template slot-scope="scope">
          {{ scope.row.url }}
          <copy v-model="scope.row.url" />
        </template>
      </el-table-column>
      <el-table-column prop="showImage" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.showImage" style="height:60px;" >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN','ACT_SPEC_ALL','ACT_SPEC_UPDATE']"
            size="small"
            type="text"
            @click="changeAd(scope.row)"
          >修改</el-button>
          <el-button
            v-permission="['ADMIN','ACT_SPEC_ALL','ACT_SPEC_DELETE']"
            size="small"
            type="text"
            @click="deleteAd(scope.row)"
          >删除</el-button>
          <el-upload
            v-permission="['ADMIN','ACT_SPEC_ALL','ACT_SPEC_UPLOAD']"
            :limit="1"
            :show-file-list="false"
            :headers="myHeaders"
            :data="actSpeclinkUploadParam"
            :on-success="handleSecondSuccess"
            :before-upload="handleSecondBeforeUpload(scope.row)"
            :action="'/api/' + actCode + '/actSpeclink/upload'"
            class="filter-item"
            style="margin-bottom:auto;"
          >
            <el-button v-if="scope.row.type==0" size="mini" type="text" @click="adUpload(scope.row)">上传</el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
    <!--    抽奖信息    -->
    <el-table v-loading="darwLoading" v-if="innerShow==3" :data="luckDraw" style="width: 100%">
      <el-table-column type="index" />
      <el-table-column prop="drawId" label="标识" />
      <el-table-column prop="startTime" label="开始时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN','ACT_DRAW_ALL','ACT_DRAW_INFO_UPDATE']"
            size="small"
            type="text"
            @click="openDrawEditTable(scope.row.drawId)"
          >修改</el-button>
          <el-button
            v-permission="['ADMIN','ACT_DRAW_ALL','ACT_DRAW_INFO_DELETE']"
            size="small"
            type="text"
            @click="deleteDraw(scope.row.drawId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加广告位开始 -->
    <el-dialog :visible.sync="addAdShow" append-to-body title="新增" width="60%">
      <el-form ref="addAdForm" :model="addAdForm" :rules="rules2" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addAdForm.name" style="width: 200px" placeholder="请输入广告位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号">
              <el-input v-model="addAdForm.specCode" style="width: 200px" placeholder="请输入唯一编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="addAdForm.type" placeholder="请选择" style="width: 200px">
                <el-option key="0" label="外部" value="0" />
                <el-option key="1" label="内部" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限制时间">
              <el-select v-model="addAdForm.haveTL" placeholder="请选择" style="width: 200px">
                <el-option :key="addAdForm.haveTL" label="否" value="F" />
                <el-option :key="addAdForm.haveTL" label="是" value="T" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="addAdForm.haveTL === 'T'">
          <el-form-item label="显示时间">
            <el-date-picker
              v-model="addAdForm.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 563px"
            />
          </el-form-item>
        </div>
        <el-row>
          <el-col :span="20">
            <el-form-item label="url">
              <el-input v-model="addAdForm.url" style="width: 563px" placeholder="请输入链接地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片">
          <el-upload
            ref="upload"
            v-model="addAdForm.showImage"
            :on-exceed="handleExceed"
            :on-success="uploadShowImage"
            limit="1"
            class="upload-demo"
            action="https://wxxcx-api.chinaredstar.com/file/upload"
            show-file-list="false"
            list-type="picture"
            style="margin-bottom: 0;"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-row v-if="addAdForm.type ==1">
          <el-form-item label="绑定活动" prop="bindActCode">
            <el-select v-model="addAdForm.bindActCode" placeholder="请选择" style="width: 200px">
              <el-option v-for="act in actList" :key="act.moduleName" :label="act.moduleName" :value="act.actCode" />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelAddAd">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="sureAddAd">确认</el-button>
      </div>
    </el-dialog>
    <!-- 特殊链接修改开始 -->
    <el-dialog :visible.sync="shoppingListShow" append-to-body title="修改" width="60%">
      <el-form ref="newChangeAd" :rules="rules" :model="newChangeAd" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="name" label="名称">
              <el-input v-model="newChangeAd.name" style="width: 200px" placeholder="请输入广告位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号">
              <el-input
                v-model="newChangeAd.specCode"
                disabled
                style="width: 200px"
                placeholder="请输入唯一编号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="newChangeAd.type" placeholder="请选择" style="width: 200px">
                <el-option key="0" :value="0" label="外部" />
                <el-option key="1" :value="1" label="内部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限制时间">
              <el-select v-model="newChangeAd.haveTL" placeholder="请选择" style="width: 200px">
                <el-option :key="newChangeAd.haveTL" label="否" value="F" />
                <el-option :key="newChangeAd.haveTL" label="是" value="T" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="newChangeAd.haveTL === 'T'">
          <el-form-item label="显示时间">
            <el-date-picker
              v-model="newChangeAd.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 563px"
            />
          </el-form-item>
        </div>
        <el-row>
          <el-col :span="20">
            <el-form-item label="url">
              <el-input v-model="newChangeAd.url" style="width: 563px" placeholder="请输入链接地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片">
          <el-upload
            ref="upload"
            v-model="newChangeAd.showImage"
            :file-list="newChangeAd.fileList"
            :on-exceed="handleExceed"
            :on-success="uploadShowImage"
            :limit="1"
            :show-file-list="true"
            class="upload-demo"
            action="https://wxxcx-api.chinaredstar.com/file/upload"
            list-type="picture"
            style="margin-bottom: 0;"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-row v-if="newChangeAd.type ==1">
          <el-form-item label="绑定活动" prop="bindActCode">
            <el-select v-model="newChangeAd.bindActCode" placeholder="请选择" style="width: 200px">
              <el-option v-for="act in actList" :key="act.moduleName" :label="act.moduleName" :value="act.actCode" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-collapse v-if="newChangeAd.type ==0" accordion>
          <el-collapse-item>
            <template slot="title">
              广告位-商场配置
              <i class="header-icon el-icon-info" />
            </template>
            <div
              v-for="item of newChangeAd.mallList"
              :key="item.omsCode"
              class="switch_box"
              style="padding-left: 75px;"
            >
              <span
                class="switch_text3"
                style="width: 100px;display: inline-block;"
              >{{ item.omsCode }}</span>
              <span
                class="switch_text3"
                style="width: 100px;display: inline-block;"
              >{{ item.mallCode }}</span>
              <span
                class="switch_text2"
                style="width: 180px;display: inline-block;"
              >{{ item.mallName }}</span>
              <el-switch
                v-model="item.linkShow"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                @change="adChengInner(item)"
              />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="noChangeShopping">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="sureChangeShopping">确认</el-button>
      </div>
    </el-dialog>
    <!--    新增 修改抽奖信息    -->
    <el-dialog :visible.sync="drawDialogShowFlag" append-to-body width="70%">
      <el-steps :active="active" align-center>
        <el-step title="抽奖基础信息" />
        <el-step title="每日概率\数量" />
      </el-steps>
      <div v-if="active === 0" id="active1">
        <el-row class="row-bg">
          <el-col :span="8" :offset="4">
            &nbsp;&nbsp;&nbsp;
            <span>抽奖id：</span>
            <el-input v-model="drawData.id" autosize placeholder="请输入内容" style="width: 250px;" />
          </el-col>
          <el-col :span="8">
            <span>奖品种数：</span>
            <el-input-number
              v-model="drawData.prizeCount"
              :min="1"
              :disabled="drawDataStatus != 0"
              controls-position="right"
              style="width: 250px"
              @change="drawInfoChange"
            />
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="8" :offset="4">
            <span>开始日期：</span>
            <el-date-picker
              v-model="drawData.viewDrawStartTime"
              type="date"
              placeholder="选择日期"
              style="width: 250px"
              @change="(value) =>drawInfoChange(value,'s')"
            />
          </el-col>
          <el-col :span="8">
            <span>结束日期：</span>
            <el-date-picker
              v-model="drawData.viewDrawEndTime"
              type="date"
              placeholder="选择日期"
              style="width: 250px"
              @change="(value) => drawInfoChange(value,'e')"
            />
          </el-col>
        </el-row>

        <el-row class="row-bg prize-border">
          <el-col v-for=" (n,i) in drawData.prizeCount " :key="n" :span="10" class="parizeCode">
            <span :class="'prize-count'+ i%2">奖品 {{ n }} 劵标识：</span>
            <el-input
              v-model="drawData.prizeCode[n - 1 ]"
              :class="'prize-count'+ i%2"
              autosize
              placeholder="请输入内容"
            />
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="7" :offset="6">
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-if=" active === 1">
        <el-row class="row-bg">
          <el-col :span="20" :offset="2">
            <el-table :data="drawData.tableDraw" style="width: 100%" height="500">
              <el-table-column fixed prop="date" label="日期" width="100" />
              <el-table-column fixed label=" " width="45">
                <!--<template slot-scope="scope">-->
                <span style="font-size:10px; text-align:right;">数量:</span>
                <br >
                <span style="font-size:10px; text-align:right;">概率:</span>
                <!--</template>-->
              </el-table-column>
              <el-table-column
                v-for="col in tableTitle"
                :key="col.index"
                :prop="col.prop"
                :label="col.label"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row[scope.column.property].prizeCount"
                    size="mini"
                    style="padding: 2px 0;width: 70px;"
                    placeholder="数量"
                  />
                  <el-input
                    v-model="scope.row[scope.column.property].prizeProbability"
                    size="mini"
                    placeholder="概率"
                    style="width: 70px"
                  />%
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col>
            <el-col :span="7" :offset="6">
              <el-button type="primary" @click="backStep">上一步</el-button>
              <el-button type="success" @click="editSuccess">完成</el-button>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { dateFormat } from '@/utils/formatDate'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import eForm from '../form'
import {
  getMallInfo,
  getLinkData,
  getDrawData,
  saveMallInfo,
  refresh,
  addSpecLink,
  saveSpecLink,
  deleteSpecLink,
  openDrawEdit,
  drawAdd,
  drawSave,
  deleteDraw,
  getActList
} from '@/api/actMall'
import copy from '@/components/copy/copyToClipboard'
import { getToken } from '@/utils/auth'

export default {
  components: { eForm, copy },
  mixins: [initData],
  data: function() {
    var validateAct = (rule, value, callback) => {
      if (!value && this.newChangeAd.type === 1) {
        callback(new Error('请输入绑定活动'))
      } else {
        callback()
      }
    }
    var validateAct2 = (rule, value, callback) => {
      if (!value && this.addAdForm.type === '1') {
        callback(new Error('请输入绑定活动'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      tableData: [],
      newTableData: [],
      saveTableData: [],
      newChangeAdMallList: [],
      actSpeclinkUploadParam: { specCode: '' },
      linkData: [],
      deptName: '',
      dialogVisible: false,
      activeIndex: '1',
      innerShow: '1',
      addAdShow: false,
      addAdForm: {
        name: '',
        specCode: '',
        url: '',
        showImage: '',
        haveTL: null,
        time: [],
        bindActCode: '',
        type: ''
      },
      rules2: {
        name: [
          { required: true, message: '请输入广告位名称', trigger: 'blur' }
        ],
        bindActCode: [
          { validator: validateAct2, trigger: 'blur' }
        ]
      },
      shoppingListShow: false,
      actList: [],
      newChangeAd: {
        name: '',
        specCode: '',
        url: '',
        type: '',
        showImage: '',
        haveTL: null,
        time: [],
        mallList: [],
        fileList: [],
        bindActCode: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入广告位名称', trigger: 'blur' }
        ],
        bindActCode: [
          { validator: validateAct, trigger: 'blur' }
        ]
      },
      luckDraw: [],
      drawData: {},
      drawDialogShowFlag: false,
      active: 0,
      loading: true,
      linkLoading: true,
      darwLoading: true,
      mallSearch: '',
      myHeaders: { Authorization: 'Bearer ' + getToken() },
      actCode: '',
      drawDataStatus: 0,
      drawDataEditTemp: {}
    }
  },
  created() {
    this.$nextTick(() => {
      this.handleSelect('1', 1)
    })
  },
  methods: {
    parseTime,
    checkPermission,
    // tab切换
    handleSelect(key, keyPath) {
      this.innerShow = key
      const actCode = this.$route.query.actCode
      this.actCode = actCode
      this.loading = true
      this.linkLoading = true
      this.darwLoading = true
      if (key === '1') {
        // 商场
        getMallInfo(actCode)
          .then(res => {
            console.log('配置——商场数据', res)
            this.newTableData = res.dataMap.mallsInfo
            this.tableData = this.newTableData
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
      } else if (key === '2') {
        getActList(9999)
          .then(res => {
            console.log('活动列表数据', res)
            this.actList = res.content
          })
          .catch(err => {
            console.log(err.response.data.message)
          })
        // 广告位
        getLinkData(actCode)
          .then(res => {
            console.log('配置——广告位数据', res)
            this.linkData = res.dataMap.specLinks
            this.linkLoading = false
          })
          .catch(err => {
            this.linkLoading = false
            console.log(err.response.data.message)
          })
      } else if (key === '3') {
        // 抽奖
        getDrawData(actCode)
          .then(res => {
            console.log('配置——抽奖数据', res)
            this.luckDraw = res.dataMap.wapactdraw
            this.darwLoading = false
          })
          .catch(err => {
            this.darwLoading = false
            console.log(err.response.data.message)
          })
      }

      console.log(key, keyPath)
    },
    // 上传
    updataE() {
      this.$confirm('确认上传？')
        .then(_ => {
          console.log('确认')
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    // 商场修改按钮触发事件
    changeIsJoin(data) {
      if (!this.saveTableData.includes(data)) {
        this.saveTableData.push(data)
      }
    },
    // 保存
    keepE() {
      this.$confirm('确认保存？')
        .then(_ => {
          console.log('确认')
          if (this.saveTableData.length < 1) {
            this.$message('当前数据未发生变动')
            return
          }
          this.loading = true
          saveMallInfo(this.$route.query.actCode, this.saveTableData)
            .then(res => {
              console.log('保存活动商场数据', res)
              if (res.code !== 200) {
                this.$notify({
                  title: res.message,
                  type: 'error',
                  duration: 2500
                })
              } else {
                this.$notify({
                  title: '保存成功',
                  type: 'success',
                  duration: 2500
                })
              }
              this.loading = false
            })
            .catch(err => {
              this.loading = false
              console.log(err.response.data.message)
            })
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    // 新增广告位
    addAdS() {
      this.addAdShow = true
    },
    // 取消新增广告位
    cancelAddAd() {
      this.addAdShow = false
    },
    // 修改广告位
    changeAd(data) {
      console.log('修改广告位', data)
      this.shoppingListShow = true
      this.newChangeAd = data
      if (data.showImage !== '' && data.showImage) {
        this.newChangeAd.fileList = [
          { name: data.showImage, url: data.showImage }
        ]
      }
      if (data.timeLimit !== '' && data.timeLimit) {
        this.newChangeAd.time = []
        const timeLimit = JSON.parse(data.timeLimit)
        this.newChangeAd.time.push(timeLimit.startTime)
        this.newChangeAd.time.push(timeLimit.endTime)
      }
      this.newChangeAdMallList = []
    },
    // 删除广告位
    deleteAd(data) {
      this.$confirm('确认删除广告位？')
        .then(_ => {
          console.log('确认')
          this.linkLoading = true
          deleteSpecLink(this.$route.query.actCode, data)
            .then(res => {
              console.log('删除广告位', res)
              if (res.code !== 200) {
                this.$notify({
                  title: res.message,
                  type: 'error',
                  duration: 2500
                })
              } else {
                this.$notify({
                  title: '删除成功',
                  type: 'success',
                  duration: 2500
                })
                const newLinkData = []
                this.linkData.forEach(function(element, index) {
                  if (element.specCode !== data.specCode) {
                    newLinkData.push(element)
                  }
                })
                this.linkData = newLinkData
              }
              this.linkLoading = false
            })
            .catch(err => {
              console.log(err.response.data.message)
            })
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    // 新增抽奖信息
    newDrawData() {
      this.drawDialogShowFlag = true
      this.drawDataStatus = 0
      this.active = 0
      this.drawData = {
        drawEndTime: null,
        drawStartTime: null,
        viewDrawEndTime: null,
        viewDrawStartTime: null,
        id: null,
        prizeCode: [],
        prizeCount: 0,
        tableDraw: {}
      }
      this.tableTitle = []
    },
    // 删除抽奖信息
    deleteDraw(drawId) {
      this.$confirm('确认删除抽奖信息？')
        .then(_ => {
          deleteDraw(this.$route.query.actCode, drawId)
            .then(res => {
              this.$message(res.message)
              this.handleSelect('3', 1)
            })
            .catch()
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    getDeptDatas() {},
    search() {
      var inputVal = this.mallSearch
      console.log('搜索', inputVal, this.tableData)
      if (inputVal) {
        this.newTableData = this.tableData.filter(function(product) {
          return Object.keys(product).some(function(key) {
            return (
              String(product[key])
                .toLowerCase()
                .indexOf(inputVal) > -1
            )
          })
        })
      } else {
        this.newTableData = this.tableData
      }
    },
    handleSuccess(res, file, fileList) {
      this.handleSelect('1', 1)
      this.$notify({
        title: '上传成功',
        type: 'success',
        duration: 2500
      })
    },
    handleSecondSuccess(res, file, fileList) {
      this.handleSelect('2', 2)
      this.$notify({
        title: '上传成功',
        type: 'success',
        duration: 2500
      })
    },
    handleBeforeUpload(file) {
      this.newTableData = []
    },
    handleSecondBeforeUpload(data) {
      this.actSpeclinkUploadParam.specCode = data.specCode
    },
    refresh(data) {
      console.log('刷新', data)
      refresh(this.$route.query.actCode, data.omsCode)
        .then(res => {
          console.log('刷新活动商场数据', res)
          if (res.code !== 200) {
            this.$notify({
              title: res.message,
              type: 'error',
              duration: 2500
            })
          } else {
            this.$notify({
              title: '刷新成功',
              type: 'success',
              duration: 2500
            })
          }
        })
        .catch(err => {
          console.log(err.response.data.message)
        })
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    sureAddAd() {
      console.log('新增广告位', this.addAdForm)
      this.$refs['addAdForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addSpecLink(this.$route.query.actCode, this.addAdForm)
            .then(res => {
              console.log('新增广告位接口返回', res)
              if (res.code !== 200) {
                this.$notify({
                  title: res.message,
                  type: 'error',
                  duration: 2500
                })
              } else {
                this.$notify({
                  title: '新增成功',
                  type: 'success',
                  duration: 2500
                })
                this.handleSelect('2', 2)
                this.addAdShow = false
              }
              this.btnLoading = false
            })
            .catch(err => {
              this.linkLoading = false
              this.btnLoading = false
              console.log(err.response.data.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadShowImage(res, file) {
      console.log('图片上传', res, file)
      this.addAdForm.showImage = res.dataMap.fileUrl
      this.newChangeAd.showImage = res.dataMap.fileUrl
    },
    // 修改广告位-取消按钮
    noChangeShopping() {
      this.shoppingListShow = false
    },
    // 修改广告位里商场开关
    adChengInner(item) {
      console.log(this.newChangeAdMallList)
      this.newChangeAdMallList.push(item)
    },
    // 修改广告位-确定按钮
    sureChangeShopping() {
      this.$refs['newChangeAd'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          console.log('修改广告位', this.newChangeAd)
          this.newChangeAd.changeMallList = this.newChangeAdMallList
          saveSpecLink(this.$route.query.actCode, this.newChangeAd)
            .then(res => {
              console.log('修改广告位接口返回', res)
              // this.linkLoading = true
              if (res.code !== 200) {
                this.$notify({
                  title: res.message,
                  type: 'error',
                  duration: 2500
                })
              } else {
                // this.linkLoading = false
                this.$notify({
                  title: '修改成功',
                  type: 'success',
                  duration: 2500
                })
                this.handleSelect('2', 2)
                this.shoppingListShow = false
              }
              this.btnLoading = false
            })
            .catch(err => {
              this.linkLoading = false
              this.btnLoading = false
              console.log(err.response.data.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 广告位——上传
    adUpload() {
      // this.linkLoading = true
    },
    // 抽奖配置修改触发事件
    drawInfoChange(date, t) {
      console.log(date, t)
      let value = null
      if (t) {
        value = dateFormat(date, 'yyyy-MM-dd')
      }
      if (this.drawDataStatus === 0) {
        console.log('new')
        // 当前为新建抽奖，不用限制时间设置
        if (t === 's') {
          this.drawData.drawStartTime = value + ' 00:00:00'
        }
        if (t === 'e') {
          this.drawData.drawEndTime = value + ' 23:59:59'
        }
        return
      }
      console.log('edit')
      if (t === 'e') {
        var oldEndTime = new Date(this.drawDataEditTemp.drawEndTime)
        var newEndTime = new Date(value + ' 23:59:59')

        var dayDiff =
          (newEndTime.getTime() - oldEndTime) / (24 * 60 * 60 * 1000)
        if (dayDiff >= 0) {
          this.drawData.drawEndTime = value + ' 23:59:59'
        } else {
          this.drawData.drawEndTime = this.drawDataEditTemp.drawEndTime
          this.drawData.viewDrawEndTime = new Date(this.drawData.drawEndTime)
          this.$message('结束时间不能缩减')
        }
      }
      if (t === 's') {
        var oldStartTime = new Date(this.drawDataEditTemp.drawStartTime)
        var newStartTime = new Date(value + ' 00:00:00')
        var dayDiffNew =
          (newStartTime.getTime() - oldStartTime) / (24 * 60 * 60 * 1000)

        if (dayDiffNew <= 0) {
          this.drawData.drawStartTime = value + ' 00:00:00'
        } else {
          this.drawData.drawStartTime = this.drawDataEditTemp.drawStartTime
          this.drawData.viewDrawStartTime = new Date(this.drawData.drawStartTime)
          this.$message('开始时间不能缩减')
        }
      }
    },
    // 抽奖配置弹窗下一步
    nextStep() {
      if (this.drawDataStatus === 0) {
        this.buildNewMatrix()
      } else {
        this.refactorMatrix()
      }
      this.active += 1
    },
    // 抽奖数据部分
    openDrawEditTable(drawId) {
      openDrawEdit(this.$route.query.actCode, drawId)
        .then(res => {
          // console.log("res ",res);
          res.dataMap.drawvo.viewDrawStartTime = new Date(
            res.dataMap.drawvo.drawStartTime
          )
          res.dataMap.drawvo.viewDrawEndTime = new Date(
            res.dataMap.drawvo.drawEndTime
          )
          this.drawData = res.dataMap.drawvo
          this.tableTitle = []
          for (var j = 1; j <= this.drawData.prizeCount; j++) {
            this.tableTitle.push({
              label: '奖品' + j,
              prop: '' + j,
              fixed: false
            })
          }
          this.drawDialogShowFlag = true
          this.drawDataStatus = 1
          this.active = 0
          this.drawDataEditTemp = JSON.parse(
            JSON.stringify(res.dataMap.drawvo)
          )
        })
        .catch()
    },
    refactorMatrix() {
      this.tableTitle = []
      this.drawData.tableDraw = []
      for (var j = 1; j <= this.drawData.prizeCount; j++) {
        this.tableTitle.push({ label: '奖品' + j, prop: '' + j, fixed: false })
      }

      var endTime = new Date(this.drawData.drawEndTime)
      var startTime = new Date(this.drawData.drawStartTime)
      const dayDiff = Math.floor(
        (endTime.getTime() - new Date(this.drawData.drawStartTime)) /
          (24 * 60 * 60 * 1000) +
          1
      )
      const startDiff = Math.floor(
        (startTime.getTime() - new Date(this.drawDataEditTemp.drawStartTime)) /
          (24 * 60 * 60 * 1000)
      )
      for (var r = 0; r < dayDiff; r++) {
        var date = new Date(this.drawData.drawStartTime)
        date.setDate(date.getDate() + r)
        var d = {
          date: date
            .toLocaleDateString()
            .split('/')
            .join('-')
        }
        for (var c = 1; c <= this.drawData.prizeCount; c++) {
          d[c] = { prizeCount: 0, prizeProbability: 0 }
          if (
            r + startDiff >= 0 &&
            r + startDiff < this.drawDataEditTemp.tableDraw.length
          ) {
            var oldE = this.drawDataEditTemp.tableDraw[r + startDiff]
            d[c] = oldE[c]
          }
        }
        this.drawData.tableDraw.push(d)
      }
    },
    editSuccess() {
      this.darwLoading = true
      if (this.drawDataStatus === 0) {
        drawAdd(this.$route.query.actCode, this.drawData)
          .then(res => {
            this.$message(res.message)
            this.handleSelect('3', 1)
          })
          .catch()
      } else {
        drawSave(this.$route.query.actCode, this.drawData)
          .then(res => {
            this.$message(res.message)
            this.handleSelect('3', 1)
          })
          .catch()
      }
      this.drawData = {}
      this.drawDialogShowFlag = false
    },
    backStep() {
      this.active -= 1
    },
    buildNewMatrix() {
      this.tableTitle = []
      this.drawData.tableDraw = []
      for (var j = 1; j <= this.drawData.prizeCount; j++) {
        this.tableTitle.push({ label: '奖品' + j, prop: '' + j, fixed: false })
      }
      var endTime = new Date(this.drawData.drawEndTime.replace(/-/g, '/'))
      // endTime.setDate(endTime.getDate() + 1)
      var day = Math.floor(
        (endTime.getTime() -
          new Date(this.drawData.drawStartTime.replace(/-/g, '/'))) /
          (24 * 60 * 60 * 1000) +
          1
      )
      console.log('day', day)
      for (var i = 0; i < day; i++) {
        var time = new Date(this.drawData.drawStartTime)
        time.setDate(time.getDate() + i)
        var d = {
          date: time
            .toLocaleDateString()
            .split('/')
            .join('-')
        }
        for (var k = 1; k <= this.drawData.prizeCount; k++) {
          d[k] = { prizeCount: 0, prizeProbability: 0 }
        }
        this.drawData.tableDraw.push(d)
      }
    }
  }
}
</script>

<style scoped>
.row-bg {
  padding: 10px 0;
}
.prize-border {
  border: 1px dashed #ccc;
  border-radius: 5px;
  width: 70%;
  margin: 0 0 0 17%;
}
.prize-count0 {
  width: 250px;
  margin: 0 0 0 20%;
}
.prize-count1 {
  width: 250px;
  margin: 0 0 0 35%;
}
  .page-container label{
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }
  .page-container b{
    margin-left: 40px;
    font-size: 15px;
    line-height: 1.5em;
  }
  .page-container{
    margin: 10px 5px 10px;
  }
</style>
