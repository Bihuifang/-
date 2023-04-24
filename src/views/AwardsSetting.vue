<template>
  <div id="box">
    <p class="title">奖项设置</p>
    <div style="margin-top: -50px;margin-left: 25px">
      <el-button class="notDrag" style="margin: 15px 10px;" type="primary" @click="router.push('/')">返回首页</el-button>
      <el-button class="notDrag" style="margin: 15px 0;" type="primary" @click="add">添加</el-button>
    </div>

    <!-- 搜索 -->
    <div class="search">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="searchData.name" style="width: 150px;"  placeholder="请选择奖项名称">
            <el-option
              v-for="(item,index) in tableData"
              :key="index"
              :label="item.awardsName"
              :value="item.awardsName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input @keyup.enter="search" v-model="searchData.giftName" placeholder="请输入奖品" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-scrollbar height="65vh" style="margin-top: 10px;">
      <el-table :data="tableData" border style="width: 90%;margin: 0 auto;">
        <el-table-column prop="awardsName" label="奖项名称" align="center"/>
        <el-table-column prop="giftNum" label="中奖人数" align="center" />
        <el-table-column prop="giftName" label="奖品名称" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button class="notDrag" size="small" @click="edit(scope.row)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="del(scope.$index)"
              class="notDrag"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <AddSeting class="notDrag" v-if="isShowAddSeting" :isShow="isShow" :addVal="addVal"/>
  </div>
</template>

<script lang="ts" setup>
import AddSeting from '../components/AddSeting.vue';
import { onBeforeMount, onMounted, ref,reactive } from 'vue';
import { useIpcRenderer } from "@vueuse/electron";
import { useRouter } from "vue-router";


const ipcRenderer = useIpcRenderer()
const router=useRouter()

const isShowAddSeting=ref(false)
const isShow=(val:any)=>{
  console.log(777,val);
  isShowAddSeting.value=val
}

onBeforeMount(()=>{
  ipcRenderer.on('menuAction',function(event:any,data:any){
    router.push(data)
  })
})

const tableData:any = ref([])

const arr:any=localStorage.getItem('settingData')
tableData.value=arr?JSON.parse(arr):[]

interface IsearchData{
  name:string,
  giftName:string
}
// 搜索数据
const searchData:IsearchData=reactive({
  name:'',
  giftName:''
})

// 查询
const search=()=>{
  if(tableData.value){
    tableData.value=tableData.value.filter((item:any)=>{
      if(item.awardsName.includes(searchData.name)&&item.giftName.includes(searchData.giftName)){
        return item
      }
    })
  }
}

const addVal=(val:any)=>{
  tableData.value.push(val)
  localStorage.setItem('settingData',JSON.stringify(tableData.value))
}

// 修改
const edit=(row:any)=>{
  console.log(row);
}

// 删除
const del=(index:any)=>{
  tableData.value.splice(index,1)
  localStorage.setItem('settingData',JSON.stringify(tableData.value))
}

const add=()=>{
  isShowAddSeting.value=true
}
</script>

<style scoped lang="less">
  #box{
    // background: url('/image/bg.jpg');
    // background-size: cover;
    // height: 100vh;
    // overflow: hidden;
  }

.title{
  font-size: 30px;
    color:black;
    text-align: center;
    margin: auto;
    margin-top: 30px;
  }
  .search{
    margin: 5px  0 0 35px;
    .el-form--inline .el-form-item{
      margin-right: 10px;
    }
    .el-input{
      width: 150px;
    }
  }
</style>