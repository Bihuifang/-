<template>
  <div id="box">
    <div id="top">
      <div id="logo">
        <img src="/image/leninglogo.png" alt="">
      </div>

      <!-- 奖项设置 -->
      <div id="select">
        
        <el-dropdown ref="dropdown1" trigger="contextmenu" style="margin-right: 10px">
          <p class="selectName">{{getObj.awardsName?getObj.awardsName:'奖项设置' }}</p>
          <template #dropdown>
            <el-dropdown-menu v-for="(item,index) in settingArr" :key="index">
              <el-dropdown-item @click="setObj(item)">{{item.awardsName}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="selectImg" @click="showClick">
          <img src="/image/select.png" alt="">
        </div>

      </div>
      <div id="set">
        <div class="setting">
          <img class="notDrag" style="margin:0 20px;" @click="router.push('/giftPerson')" src="/image/person.png" alt="">
          <img class="notDrag" @click="router.push('/awardsSetting')" src="/image/set.png" alt="">
        </div>
        <div class="action">
          <img class="notDrag" @click="actionBtn('min')" src="/image/min.png" alt="">
          <img class="notDrag" @click="actionBtn('max')" style="margin: 0 15px;" src="/image/max.png" alt="">
          <img class="notDrag" @click="actionBtn('quit')" src="/image/quit.png" alt="">
        </div>
      </div>
    </div>

    <!-- 抽奖区域 -->
    <div class="center">
      <div class="center-img"  >
        <img class="defaultimg" v-if="data.wins.length==0&&isStart" src="/image/defaultaward.png" alt=""> <!-- 未开始时默认图片 -->

        <div v-else v-for="(i,ind1) in data.imgUrlList" :key="ind1" >
          <view >
            <img  class="circle" src="/image/usercircle4.png" alt=""> <!-- 圈 -->
            <div class="personImg" >
              <img  class="" :src="'/img/'+i.img" alt=""> <!-- 人物图片 -->
            </div>
          </view>
        </div>

        <div class="kuang" v-show="!timer&&data.imgUrlList.length>0"> <!-- 选中时的框 -->
          <img src="/image/lotterylistang11.png" alt="">
          <img src="/image/lotterylistang12.png" alt="">
          <img src="/image/lotterylistang13.png" alt="">
          <img src="/image/lotterylistang14.png" alt="">
        </div>
        
      </div>

        <!-- 开始(停止)按钮 -->
        <div  class="center-btnimg" @click="startBtn">
          <img :src="isStart?'/image/startbtn3.png':'/image/stopbtn.png'" alt="">
        </div>
      <div>
        
      </div>
    </div>

    <div id="gift-List" @click="router.push('/winList')">
      <div class="gift-img">
        <img src="/image/award.png" alt="">
      </div>
      <div class="gift-name">
        中奖名单
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useIpcRenderer } from "@vueuse/electron";
import { onMounted,reactive,ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import { ElMessage,ElMessageBox } from 'element-plus'

const ipcRenderer = useIpcRenderer()
const router=useRouter()

// 音频
const musicMp3=ref<any>();
musicMp3.value=document.getElementById('musicMp3');

const getObj:any=ref({}) //奖项设置
const setObj=(val:any)=>{
  getObj.value=val
}

const isStart:any=ref('false') //开始抽奖按钮

// 奖项设置
const settingArr:any=ref([])
const list:any = localStorage.getItem('settingData')
settingArr.value=list?JSON.parse(list):[]

// 下拉菜单
const dropdown1 = ref()

function showClick() {
  if(settingArr.value.length==0){
    ElMessage('请先添加奖项设置！')
    return false
  }
  dropdown1.value.handleOpen()
}

const data:any=reactive({
  imgArr:[],//抽奖人员
  imgUrlList:[],
  wins:[], //选中的人
  historyWinList:[] //本地缓存中奖名单
})

let historyWin:any=localStorage.getItem('winnerList')
data.historyWinList=historyWin?JSON.parse(historyWin):[]
console.log('data.historyWinList',data.historyWinList);

const imgList:any=localStorage.getItem('giftPerson') //抽奖人员
data.imgArr=imgList?JSON.parse(imgList):[]

// const winUser:any=ref({}) //当前选中人
// const winArr:any=ref([]) //获奖名单

onMounted(()=>{
  ipcRenderer.on('menuAction',function(event:any,data:any){
    router.push(data)
  })
  console.log('获奖人员2222222',data.wins);
})

const actionBtn=(val:any)=>{
  console.log('右上角按钮',val);
  ipcRenderer.send('actionEvent',val)
}

const timer:any=ref(null) //定时器

// 点开始(停止)按钮
const startBtn=()=>{

  if(!getObj.value.awardsName){
    ElMessage('请选择奖项设置！')
    return false
  }
  if(data.imgArr.length>0){ //抽奖人员

    console.log('图片  数组',toRaw(data.imgArr));
    if(toRaw(data.imgArr).length<Number(getObj.value.giftNum)){
      ElMessage('参与抽奖人数不够！')
      return false
    }
    isStart.value=!isStart.value

    if(!timer.value){
      timer.value= setInterval(()=>{
        // winUser.value=imgArr.value[Math.floor(Math.random()*imgArr.value.length)]

        const randomItems:any = [];
          while (randomItems.length <Number(getObj.value.giftNum)) {
            const index = Math.floor(Math.random() * toRaw(data.imgArr).length);
            
            if (!randomItems.includes(toRaw(data.imgArr)[index])) {
            randomItems.push(toRaw(data.imgArr)[index]);
            }
          }
          data.imgUrlList=toRaw(randomItems)
          console.log(5556666, data.imgUrlList);
      },10)

      musicMp3.value.src=('/audio/Ari Pulkkinen - Title Theme.mp3')
      console.log(musicMp3.value);
      musicMp3.value.play();   //音乐播放

      // console.log('随机图片',data.imgArr[Math.floor(Math.random()*data.imgArr.length)].img);
    }else{
      clearInterval(timer.value)
      timer.value=null

      musicMp3.value.src=('/audio/于梓贝 - 50 feet.mp3')
      musicMp3.value.play();   //音乐播放

      data.imgUrlList.awardsName=getObj.value.awardsName //奖项名称
      data.imgUrlList.giftName=getObj.value.giftName //奖品名称

      data.wins= data.imgUrlList.map((element:any) => {
        
      data.historyWinList.push({...element,awardsName:getObj.value.awardsName,giftName:getObj.value.giftName})
      localStorage.setItem('winnerList',JSON.stringify(data.historyWinList)) //中奖名单

        // 抽中的人从抽奖人员里清除
        data.imgArr=data.imgArr?data.imgArr.filter((item:any)=>item!=element):[]
        
        return {...element,awardsName:getObj.value.awardsName,giftName:getObj.value.giftName}
      });
      console.log('选中的人',data.wins);

      let a = data.wins.map((element:any) =>element.name) //中奖人姓名

      // 抽完奖之后提示
      ElMessageBox.alert(`
                      <div>
                        <h3 style="margin-bottom:40px"><span style="font-size:25px">✨</span>祝贺${a+','}获得大奖:<span style="font-size:35px;color:red;margin-top:10px">${getObj.value.giftName}</span><span style="font-size:25px">🎉✨</span></h3>
                        <div style='width:100%;height:220px;margin:15px auto'>
                          <img style='width:100%;height:220px;margin:0 auto' src='/public/image/nimg.ws.126.jpg' />
                        </div>
                      </div>
                    `, '提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true, //是否将 message 作为 HTML 片段处理
      })

      localStorage.setItem('giftPerson',JSON.stringify(data.imgArr)) //抽奖人员

      
    }
  }else{
    ElMessage('请先添加抽奖人员,抽奖人数不够！')
    return false
  }
  console.log('获奖人员111111',data.wins);
  // if(isStart.value&&data.wins){
    
  // }
  
}

</script>

<style scoped lang="less">
  #box{
    background: url('/image/bg.jpg');
    background-size: cover;
    height: 100vh;
    width: 100vw;
    position: relative;
    overflow:hidden;
  }
  #top{
    display: flex;
    justify-content: space-between;
    height: 10vh;
    #logo{
      width: 150px;
      height: 80px;
      margin-top: 10px;
      margin-left: 25px;
      img{
        width: 200px;
        height: 80px;
      }
    }
    #select{
      margin-top: 20px;
      margin-left: 25px;
      display: flex;
      .selectName{
        font-size: 30px;
        color: bisque;
        // margin-right: -15px;
        margin-top: 5px;
        letter-spacing:12px;

      }
      .selectImg{
        margin-top: 8px;
        cursor:pointer;
        img{
          width: 55px;
          height: 30px;
        }
      }
    }
    #set{
      margin: 20px;
      display: flex;
      // justify-content: space-between;
      .setting{
        cursor:pointer;
        img{
          width: 25px;
          height: 25px;
        }
        margin-right: 35px;
      }
      .action{
        cursor:pointer;
        img{
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  @keyframes App-logo-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

  .center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-35%) translateX(-50%);
    height: 50vh;
    margin: auto;
    .center-img{ //默认图片
      display: flex;
      // justify-content: center;
      // width: 25vw;
      // height: 35vh;
      margin: 0 auto;
      // width: 35vw;
      position: relative;
      display: flex;
      justify-content: center;
      img{
        // width: 15vw;
        // height: 35vh;
        // margin: 0 8px;
      }
      .defaultimg{
        width: 23vw;
        // margin-left: 30px;
      }
      @media (prefers-reduced-motion: no-preference) {
        .circle{
          width: 18vw;
          // height: 35vh;
          animation: App-logo-spin infinite 20s linear;
          animation-duration:1s;
          position: relative;
        }
      }
      .personImg{ //人物图片
        width: 15vw;
        position: absolute;
        top: 0;
        img{
          width: 16vw;
          position: absolute;
          top: 1vh;
          left: 1vw;
          border-radius: 50%;
        }
      }
    }
    .kuang{
        img{
          width: 10vw;
        }
        img:nth-child(1){
          position: absolute;
          top: -6vh;
          left: -3vw;
        }
        img:nth-child(2){
          position: absolute;
          top: -6vh;
          right: -3vw;
        }
        img:nth-child(3){
          position: absolute;
          bottom: -6vh;
          left: -3vw;
        }
        img:nth-child(4){
          position: absolute;
          bottom: -6vh;
          right: -3vw;
        }
      }
    .center-btnimg{
      margin: 0 auto;
      margin-top: 10vh;
      width:28vw;
      // height: 30vh;
      cursor:pointer;
      img{
        width: 28vw;
        height: 10vh;
      }
    }
  }

  // 中奖名单
  #gift-List{
    display: flex;
    position: absolute;
    right: 5vw;
    bottom: 12vh;
    cursor:pointer;
    .gift-img{
      width: 25px;
      height: 25px;
      img{
          width: 25px;
          height: 25px;
        }
    }
    .gift-name{
      color:#fff;
      height: 25px;
      line-height: 25px;
      font-size: 13px;
      margin-left: 5px;
    }
  }
</style>
