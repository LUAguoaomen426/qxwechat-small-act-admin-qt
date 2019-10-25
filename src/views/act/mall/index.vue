<template>
  <div class="app-container">
    <div class="head-container">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">商场</el-menu-item>
        <el-menu-item index="2">特殊链接</el-menu-item>
        <el-menu-item index="3">抽奖信息</el-menu-item>
        <div v-if="innerShow==1" style="display: inline-block;margin: 20px 2px;float:right;">
          <el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @input="getDeptDatas"/>
          <el-button
            v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_CREATE']"
            class="filter-item"
            size="mini"
            type="primary">搜索
          </el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_CREATE']" class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="updataE">上传
          </el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_CREATE']" class="filter-item" size="mini" type="primary" icon="el-icon-success" @click="keepE">保存
          </el-button>
        </div>
        <div v-if="innerShow==2" style="display: inline-block;margin: 20px 2px;float:right;">
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_CREATE']" class="importDefault" type="warning" @click="addAdS">增加广告位
          </el-button>
        </div>
        <div v-if="innerShow==3" style="display: inline-block;margin: 20px 2px;float:right;">
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_CREATE']" class="importDefault" type="warning" @click="newDrawData">新增
          </el-button>
        </div>
      </el-menu>
    </div>
    <!--    商场   -->
    <el-table v-if="innerShow==1" :data="tableData" border style="width: 100%">
      <el-table-column prop="omsCode" label="omsCode" width="180"/>
      <el-table-column prop="mallCode" label="mallCode" width="180"/>
      <el-table-column prop="province" label="省"/>
      <el-table-column prop="city" label="城市"/>
      <el-table-column prop="mallName" label="商场"/>
      <el-table-column prop="flag" label="是否参加">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.flag" active-color="#13ce66" inactive-color="#ff4949"/>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text">刷新</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    特殊链接   -->
    <el-table v-if="innerShow==2" :data="linkData" style="width: 100%">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="type" label="类型"/>
      <el-table-column prop="specCode" label="specCode"/>
      <el-table-column prop="url" label="url"/>
      <el-table-column prop="imgUrl" label="图片"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="changeAd">修改</el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="deleteAd">删除</el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    抽奖信息    -->
    <el-table v-if="innerShow==3" :data="luckDraw" style="width: 100%">
      <el-table-column prop="actMark" label="标识"/>
      <el-table-column prop="startTime" label="开始时间"/>
      <el-table-column prop="endTime" label="结束时间"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="changeDraw">修改</el-button>
          <el-button v-permission="['ADMIN','TBWAPACTMODULE_ALL','TBWAPACTMODULE_EDIT']" size="small" type="text" @click="deleteDraw">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加广告位开始 -->
    <el-dialog :visible.sync="addAdShow" append-to-body="true" title="特殊链接新建">
      <el-form :model="addAdForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="addAdForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="specCode">
              <el-input v-model="addAdForm.specCode"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="addAdForm.type" placeholder="请选择">
                <el-option
                  key="0"
                  label="广告"
                  value="0"/>
                <el-option
                  key="1"
                  label="特殊链接"
                  value="1"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限制时间">
              <el-select v-model="addAdForm.haveTL" placeholder="请选择">
                <el-option
                  :key="addAdForm.haveTL"
                  label="否"
                  value="F"/>
                <el-option
                  :key="addAdForm.haveTL"
                  label="是"
                  value="T"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="url">
              <el-input v-model="addAdForm.url"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="addAdForm.haveTL == 'T'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="开放时间">
                <el-date-picker
                  v-model="addAdForm.timeLimit.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="addAdForm.timeLimit.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="addAdForm.type == 0">
          <el-form-item label="图片地址">
            <el-upload
              ref="upload"
              :on-preview="handlePreview1"
              :on-success="adUploadSuccess"
              :on-remove="adhandleRemove"
              :before-remove="beforeRemove1"
              :limit="1"
              :on-exceed="handleExceed1"
              :file-list="specLinkFileList"
              class="upload-demo"
              action="https://wxxcx-api.chinaredstar.com/file/upload"
              multiple
              show-file-list="false"
              style="margin-bottom: 0;">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">{{ addAdForm.showImage }}</div>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="sureAddAd">立即增加</el-button>
          <el-button @click="cancelAddAd">取消</el-button>
        </el-form-item>
      </el-form>
      <!--</div>-->
      <!--</div>-->
    </el-dialog>
    <!-- 特殊链接修改开始 -->
    <el-dialog :visible.sync="shoppingListShow" append-to-body="true" title="特殊链接修改">

      <el-form ref="newChangeAd" :model="newChangeAd" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="newChangeAd.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="specCode">
              <el-input v-model="newChangeAd.specCode" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="newChangeAd.type" placeholder="请选择">
                <el-option
                  key="0"
                  label="广告"
                  value="0"/>
                <el-option
                  key="1"
                  label="特殊链接"
                  value="1"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限制时间">
              <el-select v-model="newChangeAd.haveTL" placeholder="请选择">
                <el-option
                  :key="newChangeAd.haveTL"
                  label="否"
                  value="F"/>
                <el-option
                  :key="newChangeAd.haveTL"
                  label="是"
                  value="T"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="url">
              <el-input v-model="newChangeAd.url"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="newChangeAd.type == 0">
          <el-form-item label="图片地址">
            <el-upload
              ref="upload"
              :on-preview="handlePreview1"
              :on-success="adChangeUploadSuccess"
              :on-remove="adChangehandleRemove"
              :before-remove="beforeRemove1"
              :limit="1"
              :on-exceed="handleExceed1"
              :file-list="specLinkFileList"
              class="upload-demo"
              action="https://wxxcx-api.chinaredstar.com/file/upload"
              multiple
              show-file-list="false"
              style="margin-bottom: 0;">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">{{ newChangeAd.showImage }}</div>
            </el-upload>
          </el-form-item>
        </div>
        <div v-if="newChangeAd.haveTL == 'T'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="开放时间">
                <el-date-picker
                  v-model="newChangeAd.timeLimit.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="newChangeAd.timeLimit.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">
              特殊链接-商场开关<i class="header-icon el-icon-info"/>
            </template>
            <div v-for="item of newChangeAd.mallList" class="switch_box">
              <span class="switch_text2">{{ item.mallName }}</span>
              <span class="switch_text3">{{ item.omsCode }}</span>
              <el-switch
                v-model="item.linkShow"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="adChengInner(item)"/>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-form-item style="margin-top:8px;">
          <el-button type="primary" @click="sureChangeShopping">确认修改</el-button>
          <el-button type="primary" @click="noChangeShopping">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--    新增 修改抽奖信息    -->
    <el-dialog :visible.sync="drawDialogShowFlag" append-to-body="true" title="抽奖信息" width="65%">
      <el-steps :active="active" align-center>
        <el-step title="抽奖基础信息"/>
        <el-step title="每日概率\数量"/>
      </el-steps>
      <div v-if="active == 0" id="active1">
        <el-row class="row-bg">
          <el-col :span="6" :offset="6">
            <span>抽奖ID：</span>
            <el-input
              v-model="drawData.id"
              autosize
              placeholder="请输入内容"
              style="width: 250px;"/>
          </el-col>
          <el-col :span="6">
            <span>奖品种数：</span>
            <el-input-number
              v-model="drawData.prizeCount"
              :min="1"
              :disabled="drawDataStatus != 0"
              controls-position="right"
              style="width: 250px"
              @change="drawInfoChange"/>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="6" :offset="6">
            <span>开始日期：</span>
            <el-date-picker
              v-model="drawData.drawStartTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 250px"
              @change="(value) =>drawInfoChange(value,'s')"/>
          </el-col>
          <el-col :span="6">
            <span>结束日期：</span>
            <el-date-picker
              v-model="drawData.drawEndTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 250px"
              @change="(value) => drawInfoChange(value,'e')"/>
          </el-col>
        </el-row>

        <el-row class="row-bg prize-border">
          <el-col v-for=" n in drawData.prizeCount " :span="12" class="parizeCode">
            <span> 奖品 {{ n }} 劵ID：</span>
            <el-input
              v-model="drawData.prizeCode[n - 1 ]"
              autosize
              placeholder="请输入内容"
              style="width: 250px"/>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="7" :offset="6">
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-if=" active == 1">
        <el-row class="row-bg">
          <el-col :span="20" :offset="2">
            <el-table
              :data="drawData.tableDraw"
              style="width: 100%"
              height="500">
              <el-table-column
                fixed
                prop="date"
                label="日期"
                width="100"/>
              <el-table-column
                fixed
                label=" "
                width="45">
                <!--<template slot-scope="scope">-->
                <span style="font-size:10px; text-align:right;">数量:</span>
                <br><span style="font-size:10px; text-align:right;">概率:</span>
                <!--</template>-->
              </el-table-column>
              <el-table-column
                v-for="col in tableTitle"
                :prop="col.prop"
                :label="col.label"
                width="150">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row[scope.column.property].prizeCount"
                    size="mini"
                    style="padding: 2px 0;width: 70px;"
                    placeholder="数量"/>
                  <el-input
                    v-model="scope.row[scope.column.property].prizeProbability"
                    size="mini"
                    placeholder="概率"
                    style="width: 70px"/>
                  %
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
    </div></el-dialog>
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
import { parseTime } from '@/utils/index'
import eForm from '../form'

export default {
  components: { eForm },
  mixins: [initData],
  data: function() {
    return {
      delLoading: false,
      tableData: [{
        omsCode: '1001',
        mallCode: '10059',
        province: '上海市',
        city: '上海市',
        mallName: '上海汶水商场',
        flag: true
      }, {
        omsCode: '1001',
        mallCode: '10059',
        province: '上海市',
        city: '上海市',
        mallName: '上海汶水商场',
        flag: true
      }, {
        omsCode: '1001',
        mallCode: '10059',
        province: '上海市',
        city: '上海市',
        mallName: '上海汶水商场',
        flag: false
      }, {
        omsCode: '1001',
        mallCode: '10059',
        province: '上海市',
        city: '上海市',
        mallName: '上海汶水商场',
        flag: true
      }],
      linkData: [{
        name: '超级品类节',
        type: '特殊链接',
        specCode: 'november-spec1',
        url: '/act/act201911_h5_category.html#/',
        imgUrl: ''
      }, {
        name: '超级品类节',
        type: '特殊链接',
        specCode: 'november-spec1',
        url: '/act/act201911_h5_category.html#/',
        imgUrl: ''
      }],
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
        timeLimit: {}
      },
      shoppingListShow: false,
      newChangeAd: {},
      luckDraw: [{
        actMark: '1',
        startTime: '2019-10-21 00:00:00',
        endTime: '2019-10-27 23:59:59'
      }],
      drawData: {},
      drawDialogShowFlag: false,
      active: 0
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
    // tab切换
    handleSelect(key, keyPath) {
      this.innerShow = key
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
    // 保存
    keepE() {
      this.$confirm('确认保存？')
        .then(_ => {
          console.log('确认')
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    // 新增广告位
    addAdS() {
      this.addAdShow = true
    },
    // 修改广告位
    changeAd() {
      this.shoppingListShow = true
    },
    // 删除广告位
    deleteAd() {
      this.$confirm('确认删除广告位？')
        .then(_ => {
          console.log('确认')
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    // 新增抽奖信息
    newDrawData() {
      this.drawDialogShowFlag = true
    },
    // 删除抽奖信息
    deleteDraw() {
      this.$confirm('确认删除抽奖信息？')
        .then(_ => {
          console.log('确认')
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    getDeptDatas() {

    }
  }
}
</script>

<style scoped>

</style>
