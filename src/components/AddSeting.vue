<template>
  <!-- <el-button text @click="dialogVisible = true">
    click to open the Dialog
  </el-button> -->

  <el-dialog
    v-model="dialogVisible"
    title="添加奖项"
    width="50%"
    :before-close="handleClose"
    class="notDrag"
  >
    <div>
      <el-form :model="addData" label-width="120px">
        <el-form-item label="奖项名称">
          <el-input class="notDrag" v-model="addData.awardsName" />
        </el-form-item>
        <el-form-item label="中奖人数">
          <el-input class="notDrag" v-model="addData.giftNum" />
        </el-form-item>
        <el-form-item label="奖品名称">
          <el-input class="notDrag" v-model="addData.giftName" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="notDrag" @click="cancel">取消</el-button>
        <el-button class="notDrag" type="primary" @click="confirm">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(true)

const props = defineProps({
  isShow:{
    type:Function,
    required:true
  },
  addVal:{
    type:Function,
    required:true
  }
})

const addData=reactive({
  awardsName:'',
  giftNum:'',
  giftName:''
})

const handleClose = (done: () => void) => {
  // ElMessageBox.confirm('Are you sure to close this dialog?')
  //   .then(() => {
      done()
  //   })
  //   .catch(() => {
  //     // catch error
  //   })
}

// 取消
const cancel=()=>{
  props.isShow(false)
}

// 确定
const confirm=()=>{
  console.log('addData',addData);
  props.isShow(false)
  props.addVal(addData)
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.el-dialog{
  -webkit-app-region: no-drag;
}
</style>
