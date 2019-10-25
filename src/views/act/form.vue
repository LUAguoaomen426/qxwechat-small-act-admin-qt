<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="52%">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动code" prop="actCode">
            <el-input v-model="form.actCode" style="width: 260px; height:40px;"/>
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
      <el-form-item label="活动类型" >
        <el-select v-model="actTypeValue" placeholder="请选择">
          <el-option
            v-for="item in actType"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="子类型" >
        <el-select v-model="childTypeValue" placeholder="请选择">
          <el-option
            v-for="item in childType"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="appId">
        <el-input v-model="form.programConfig"/>
      </el-form-item>
      <el-form-item label="参数">
        <el-input v-model="form.programConfig"/>
      </el-form-item>
      <el-form-item label="url">
        <el-input v-model="form.programConfig.linkUrl"/>
      </el-form-item>
      <el-form-item label="图片地址" >
        <el-upload
          class="upload-demo"
          action="https://wxxcx-api.chinaredstar.com/file/upload">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">123</div>
        </el-upload>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="隐藏时间">
            <el-date-picker v-model="form.hideTime" type="datetime" placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse accordion>

        <el-collapse-item>
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
        </el-collapse-item>

        <el-collapse-item>
          <template slot="title">
            活动部分数据配置<i class="header-icon el-icon-info"/>
          </template>
          <el-row>
            <el-col :span="12">
              <el-form-item label="channelId">
                <el-input v-model="newChangeAct.channelId"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="config">
                <el-input
                  id="configInput"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  v-model="newChangeAct.configData"
                  type="textarea"
                  placeholder="请输入内容"
                  @blur="ConfigJsonFormat(newChangeAct.configData,2)"/>
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
        subtype: ''
      },
      rules: {
        actCode: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ]
      },
      newChangeAct: {},
      fileList: [],
      actType: [{
        value: '0',
        label: '不可变'
      }, {
        value: '1',
        label: 'H5链接'
      }, {
        value: '2',
        label: '小程序链接'
      }, {
        value: '3',
        label: '其他小程序链接'
      }],
      actTypeValue: '',
      childType: [{
        value: '1',
        lable: '大促活动'
      }, {
        value: '0',
        lable: '其他'
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
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
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
    }
  }
}
</script>

<style scoped>

</style>
