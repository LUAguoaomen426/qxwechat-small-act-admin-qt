<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="60%">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动code" prop="actCode">
            <el-input v-model="form.actCode" :disabled="form.nameShowFlag" style="width: 260px; height:40px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Poster Id" prop="posterId">
            <el-input v-model="form.posterId" style="width: 260px; height:40px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动名称" >
            <el-input v-model="form.moduleName" style="width: 260px; height:40px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="英文名称" >
            <el-input v-model="form.secondModuleName" style="width: 260px; height:40px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动类型" >
            <el-select v-model="form.moduleType" placeholder="请选择">
              <el-option
                v-for="item in actType"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子类型" >
            <el-select v-model="form.subType" placeholder="请选择">
              <el-option
                v-for="item in childType"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="隐藏时间">
            <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.actEndTime" type="datetime" placeholder="选择日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="url">
        <el-input v-model="form.linkUrl"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图片地址" >
            <el-upload
              :on-success="uploadSuccess"
              :show-file-list="true"
              :file-list="form.fileList"
              :on-exceed="handleExceed"
              :before-remove="beforeRemove"
              :limit="1"
              class="upload-demo"
              list-type="picture-card"
              action="https://wxxcx-api.chinaredstar.com/file/upload">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否在活动列表显示" >
            <el-switch
              v-model="form.showFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse accordion>

        <!--<el-collapse-item>
          <template slot="title">
            全民营销配置<i class="header-icon el-icon-info"/>
          </template>
          <el-form-item label="全民营销版本">
            <el-select v-model="tarFlagValue" clearable placeholder="请选择">
              <el-option
                v-for="item in tarFLag"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="event">
            <el-input v-model="newChangeAct.event"/>
          </el-form-item>
          <el-form-item label="tarToken">
            <el-input v-model="newChangeAct.tarToken"/>
          </el-form-item>
          <el-form-item label="werenwuCode">
            <el-input v-model="newChangeAct.werenwuCode"/>
          </el-form-item>
        </el-collapse-item>-->

        <el-collapse-item>
          <template slot="title">
            活动部分数据配置<i class="header-icon el-icon-info"/>
          </template>
          <el-row>
            <el-col :span="12">
              <el-form-item label="channelId">
                <el-input v-model="form.channelId"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="config">
                <el-input
                  :autosize="{ minRows: 2, maxRows: 10}"
                  v-model="form.configData"
                  type="textarea"
                  placeholder="请输入内容"
                  @blur="configJsonFormat(form.configData)"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

      </el-collapse>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/act'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        actCode: '',
        endTime: '',
        moduleName: '',
        secondModuleName: '',
        moduleType: '',
        showImage: '',
        linkUrl: '',
        showFlag: false,
        orderLevel: '',
        createTime: '',
        updateTime: '',
        isDelete: '',
        programConfig: '',
        subType: '',
        tarFlag: '',
        event: '',
        tarToken: '',
        werenwuCode: '',
        actEndTime: '',
        posterId: '',
        configData: '',
        channelId: '',
        region: '',
        subtype: '',
        nameShowFlag: false,
        fileList: []
      },
      rules: {
        actCode: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ]
      },
      fileList: [],
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
      actTypeValue: '',
      childType: [{
        value: 1,
        label: '大促活动'
      }, {
        value: 0,
        label: '其他'
      }],
      childTypeValue: '',
      tarFLag: [{
        value: true,
        label: '新版'
      }, {
        value: false,
        label: '老版'
      }],
      tarFlagValue: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        console.log('添加数据', res)
        if (res.code !== 200) {
          this.$notify({
            title: res.message,
            type: 'error',
            duration: 2500
          })
        } else {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
        }
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        if (res.code !== 200) {
          this.$notify({
            title: res.message,
            type: 'error',
            duration: 2500
          })
        } else {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
        }
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        actCode: '',
        endTime: '',
        moduleName: '',
        secondModuleName: '',
        moduleType: '',
        showImage: '',
        linkUrl: '',
        showFlag: false,
        orderLevel: '',
        createTime: '',
        updateTime: '',
        isDelete: '',
        programConfig: '',
        subType: '',
        tarFlag: '',
        event: '',
        tarToken: '',
        werenwuCode: '',
        actEndTime: '',
        posterId: '',
        configData: '',
        channelId: ''
      }
    },
    configJsonFormat(data) {
      console.log(data)
      var formatData = JSON.stringify(JSON.parse(data), null, 2)
      this.form.configData = formatData
    },
    // 文件上传成功回调
    uploadSuccess(res, file, fileList) {
      console.log('res', res, file, fileList)
      this.form.showImage = res.dataMap.fileUrl
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>

</style>
