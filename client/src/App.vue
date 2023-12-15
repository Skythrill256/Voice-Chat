<script setup>
import { ref } from 'vue';
import { useAVLine} from 'vue-audio-visual'
import axios from "axios"

const player = ref(null)
const canvas = ref(null)
let mysource = ref(null)
let action = ref('')
let output = ref('')

useAVLine(player, canvas, {
src:mysource,
canvHeight: 300,
canvWidth: 1000,
barcolor: 'line',
})

const startSpeechRecognition = () => {
  let SpeechRecognition =  webkitSpeechRecognition
  let recognition = new SpeechRecognition ()

  recognition.onStart = ()=>{
    action.value = "Listening Please ask for question ..."
  }
  recognition.onSpeechEnd = ()=>{
    action.value ="stopped listening"
  }
  recognition.onResult= async (event) =>{
    let transcript = event.result[0][0].transcript
    output.value = transcript
    try {
      let res = await axios.post("https://localhost:4001/api/text-to-audio-file",{
        text: event.results[0][0].transcript
      })
       if (res.data){
        mysource.value = '/voice' + res.data +'.mp3'
        setTimeout(()=>{player.value.play()} , 500)
       }
    } catch (error) {
      console.error(error)
    }
  }
  recognition.start()
}
</script>


<template >

 
  <div class="flex justify-center mt-30px">
    <button type="button" @click ="startSpeechRecognition()" class="p-2 px-3 bg-[rgb(81,148,81)] text-white text-lg border-none cursor-pointer">Ask Question</button>
  </div>
  <div class="w-[100%] text-center text-white">
    <div v-if="action" class="mt-10px mb-10px  ">{{ action }}</div>
    <div v-if="output" class="max-w-500px p-20 rounded-sm inline-block ">{{ output }}</div>
  </div>
  <div>
    <audio ref="player" :src="mysource" type ="audio/mpeg" controls hidden></audio>
    <canvas class="p-0 m-auto block w-[800px] absolute top-0 bottom-0 left-0 right-0"  ref="canvas"/>
  </div>

 
</template>

