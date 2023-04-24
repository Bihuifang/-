<template>
  <div id="box">
    <div class="top">
      <div style="margin-left: 25px">
        <el-button class="notDrag" type="primary" @click="router.push('/')">返回首页</el-button>
      </div>
      <!-- 标题 -->
      <p class="title">中奖名单</p>

      <!-- 搜索 -->
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item>
          <el-input @keyup.enter="search" v-model="searchData.user" placeholder="关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-scrollbar height="65vh" style="margin-top: 20px;">
      <el-table :data="tableData" border style="width: 90%;margin: 0 auto;">
        <el-table-column prop="awardsName" label="奖项名称" align="center"/>
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="giftName" label="奖品名称" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="danger" @click="cancel(scope.$index)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useIpcRenderer } from "@vueuse/electron";
import { onMounted,ref,reactive } from "vue";
import { useRouter } from "vue-router";

const ipcRenderer = useIpcRenderer()
const router=useRouter()

const tableData:any = ref([])
const list:any = ref(localStorage.getItem('winnerList'))
tableData.value=list.value?JSON.parse(list.value):[]

interface IsearchData{
  user:string
}
// 搜索数据
const searchData:IsearchData=reactive({
  user:''
})

// 查询
const search=()=>{
  if(tableData.value){
    tableData.value=tableData.value.filter((item:any)=>{
      if(item.name.includes(searchData.user)){
        return item
      }
    })
  }
}

// 取消
const cancel=(index:any)=>{
  tableData.value.splice(index,1)
  localStorage.setItem('winnerList',JSON.stringify(tableData.value))
}

onMounted(()=>{
  ipcRenderer.on('menuAction',function(event:any,data:any){
    router.push(data)
  })
})
</script>

<style lang="less" scoped>
 #box{
    // background: url('/image/bg.jpg');
    // background-size: cover;
    // height: 100vh;
    // overflow: hidden;
  }
  .top{
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
  }
.title{
    margin-top: -5px;
    font-size: 30px;
    color:black;
    text-align: center;
  }
</style>