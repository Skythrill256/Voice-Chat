import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { HfInference } from "@huggingface/inference";
import fs from 'fs'

const readKey = process.env.HUGGING_FACE_READ_KEY
const writeKey = process.env.HUGGING_FACE_WRITE_KEY

const hf1 = new HfInference(readKey)
const hf2 = new HfInference(writeKey)

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.post("/api/text-to-audio-file" , async (req, res) => {
    const data = await hf2.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: req.body.text,
    })
    let num = (Math.random() * 10000000000).toFixed(0)
    const audioBlob = await hf1.textToSpeech({
        model: 'speechbrain/tts-tacotron2-ljspeech',
        inputs: data.generated_text,      
    })
    const arrayBuffer = await audioBlob.arrayBuffer();
     const audioBuffer = Buffer.from(arrayBuffer);

     let filePath = "../public/voice/"
     let filename = num +".mp3"
     

     if (num) fs.writeFile(filePath+filename,audioBuffer,(err)=>{
        if(err) throw err
        console.log("file saved")        
     })
     setTimeout(()=>{res.status(200).json(num)} , 4500)
})

app.listen(4001, () => { 
    console.log(`Server is ready at http://localhost:4001`); 
});