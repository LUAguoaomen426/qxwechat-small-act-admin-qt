<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="商场编码" prop="omsCode">
        <el-input v-model="form.omsCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="商场编码" prop="mallCode">
        <el-input v-model="form.mallCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="商场名称" >
        <el-input v-model="form.mallName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="省份" >
        <el-input v-model="form.province" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="城市" >
        <el-input v-model="form.city" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="自营商场标识" >
        <el-input v-model="form.selfFlag" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="活动列表商场启用状态" >
        <el-input v-model="form.entranceEnable" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否为城市默认商场" >
        <el-input v-model="form.defaultEnable" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否参与活动的默认值 0不参与 1 参与" >
        <el-input v-model="form.defultJoin" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="详细地址" >
        <el-input v-model="form.detailAddress" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否为瞄零商场 0不是 1是" >
        <el-input v-model="form.isMl" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/tbWapMall'
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
        omsCode: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ],
        mallCode: [
          { required: true, message: 'please enter', trigger: 'blur' }
        ],
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
