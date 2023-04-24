<script setup lang="ts">
import { onMounted, ref } from 'vue';


  const click=()=>{
    console.log(111);
  }

  const isPlay:any=ref(true) //图标样式
  const musicPath:any=ref('/audio/于梓贝 - 50 feet.mp3')
  const musicMp3=ref<any>();

  const isPlayAudio=()=>{
  console.log('是否播放音频');
  if (musicMp3.value.duration > 0 && !musicMp3.value.paused) {
      isPlay.value=!isPlay.value
      musicMp3.value.pause();   //音乐暂停
    } else {
      isPlay.value=!isPlay.value
      musicMp3.value.src=('/audio/于梓贝 - 50 feet.mp3')
      musicMp3.value.play();   //音乐播放
    }
  }
  
  onMounted(()=>{
    musicMp3.value=document.getElementById('musicMp3');
    musicMp3.value.play();
  })

</script>

<template>
  <div class="box">
   <router-view></router-view>
   <img @click="isPlayAudio" :src="isPlay?'/image/audioPlay.png':'/image/audioPause.png'" alt="">
   <audio :src="musicPath" id="musicMp3" loop></audio>
  </div>
</template>

<style scoped>
.box{
  position: relative;
  background: url('/image/bg.jpg');
    background-size: cover;
    height: 100vh;
    overflow: hidden;
  }
img{
  position: absolute;
  right: 25px ;
  top: 200px;
  z-index: 999;
  width: 25px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
