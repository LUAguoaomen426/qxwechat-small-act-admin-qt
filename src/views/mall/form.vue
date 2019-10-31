<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="50%">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-form-item label="商场名称" prop="mallName">
        <el-input v-model="form.mallName" style="width: 457px;"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="omsCode" prop="omsCode">
            <el-input v-model="form.omsCode" style="width: 160px;" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="mallCode" prop="mallCode">
            <el-input v-model="form.mallCode" style="width: 160px;" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="省份" prop="province">
            <el-input v-model="form.province" style="width: 160px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city" style="width: 160px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细地址" >
        <el-input v-model="form.detailAddress" style="width: 457px;"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否参与活动列表" >
            <el-switch v-model="form.entranceEnable" style="width: 160px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否为城市默认商场" >
            <el-switch v-model="form.defaultEnable" style="width: 160px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否自营" >
            <el-switch v-model="form.selfFlag" style="width: 160px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否为瞄零商场" >
            <el-switch v-model="form.isMl" style="width: 160px;"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/mall'
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
        omsCode: '',
        mallCode: '',
        mallName: '',
        province: '',
        city: '',
        selfFlag: '',
        entranceEnable: '',
        defaultEnable: '',
        defultJoin: '',
        detailAddress: '',
        isMl: ''
      },
      rules: {
        mallName: [
          { required: true, message: '请输入商场名称', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ]
      }
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
        omsCode: '',
        mallCode: '',
        mallName: '',
        province: '',
        city: '',
        selfFlag: '',
        entranceEnable: '',
        defaultEnable: '',
        defultJoin: '',
        detailAddress: '',
        isMl: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
