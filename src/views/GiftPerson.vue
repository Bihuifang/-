<template>
  <div id="box">
    <p class="title">抽奖人员</p>
    <div style="margin-top: -30px;margin-left: 25px">
      <el-button class="notDrag" type="primary" @click="router.push('/')">返回首页</el-button>
      <el-button class="notDrag" type="primary" @click="req">导入</el-button>
    </div>

    <div class="search notDrag">
      <!-- 搜索 -->
      <el-form  :inline="true" :model="searchData" class="demo-form-inline notDrag">
        <el-form-item>
          <el-input class="notDrag" @keyup.enter="search" v-model="searchData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item>
          <el-input @keyup.enter="search" v-model="searchData.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-scrollbar height="65vh" style="margin-top: 20px;">
      <el-table :data="imgArr" border style="width: 90%;margin: 0 auto;">
        <el-table-column prop="name" label="姓名" align="center"/>
        <el-table-column prop="giftNum" label="图片" align="center" >
          <template #default="scope">
            <img style="width: 50px;height: 50px;" :src="'/img/'+scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="del(scope.$index)"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <!-- 分页 -->
    <!-- <div>
      <el-pagination
      style="margin: auto;width: 50vw;margin-top: 20px;"
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[6, 12, 24, 48]"
      :small="small"
      background="rgba(0,0,0,0)"
      layout="total, sizes, prev, pager, next, jumper"
      :total="imgArr.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </div> -->

  </div>
</template>

<script lang="ts" setup>
import { onMounted,ref,reactive } from 'vue';
import { useIpcRenderer } from "@vueuse/electron";
import { useRouter } from "vue-router";

const ipcRenderer = useIpcRenderer()
const router=useRouter()


// 分页
const currentPage4 = ref(1)
const pageSize4 = ref(6)
const small = ref(false)
const background = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}


const imgArr:any=ref([]) //抽奖人员
let list:any=localStorage.getItem('giftPerson')

imgArr.value= localStorage.getItem('giftPerson')?JSON.parse(list):[]


interface IsearchData{
  name:string,
  unit:string
}
// 搜索数据
const searchData:IsearchData=reactive({
  name:'',
  unit:''
})

// 查询
const search=()=>{
  if(imgArr.value){
    imgArr.value=imgArr.value.filter((item:any)=>{
      if(item.name.includes(searchData.name)&&item.unit.includes(searchData.unit)){
        return item
      }
    })
  }
}

onMounted(()=>{
  ipcRenderer.on('menuAction',function(event:any,data:any){
    router.push(data)
  })
  ipcRenderer.on('imgList',function(event:any,data:any){
    console.log('imgList',data);
    imgArr.value=data.map((item:any)=>{
      let name = item.split('-')[0]
      let unit = item.split('-')[1].split('.')[0]
      return {img:item,name,unit}
    })
    localStorage.setItem('giftPerson',JSON.stringify(imgArr.value))
  })
})

// 导入
const req=()=>{
  ipcRenderer.send('requestFile','导入')
}

// 删除
const del=(index:any)=>{
  imgArr.value.splice(index,1)
  localStorage.setItem('giftPerson',JSON.stringify(imgArr.value))
}
</script>

<style lang="less" scoped>
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

  /deep/.search{
    margin: 25px  0 0 25px;
    -webkit-app-region: no-drag !important;
    .el-form--inline .el-form-item{
      margin-right: 10px;
    }
    .el-input{
      width: 150px;
      -webkit-app-region: no-drag !important;
    }
    .el-form{
      -webkit-app-region: no-drag !important;
    }
  }

  /deep/.el-pagination span{
    color: #fff;
  }

  /deep/.el-input{
  -webkit-app-region: no-drag !important;
}

  // .el-pagination span{
	// 	background: #574225;
	// 	border: 1px solid #FFBB46;
	// 	color: #FFFFFF;
	// 	padding: 0 5px;
	// 	line-height: 2;
	// 	border-radius: 4px;
	// }
	// .el-pagination.is-background .el-pager li:not(.disabled){
	// 	background-color: #3E3E45;
	// 	color: #fff;
	// }
	// .el-pagination.is-background .el-pager li:not(.disabled).active {
	// 	background-color: #FFBB46;
	// 	color: #fff;
	// }

  // /deep/.el-input__wrapper{
  //   background-color: rgba(0, 0, 0, 0) !important;
  //   box-shadow:0 0 0 0;
  // }
  // /deep/.el-pagination button{
  //   background-color: rgba(190, 150, 200, 0.2) !important;
  // }
  

</style>