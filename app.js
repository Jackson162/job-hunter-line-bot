if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const run104Scraper = require('./104Scraper')
const line = require('@line/bot-sdk')
const express = require('express')
const app = express()

const PORT = 3000
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
const client = new line.Client(config)

app.use(line.middleware(config))

app.use((err, req, res, next) => {
  if (err instanceof line.SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof line.JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.post('/webhook', async (req, res) => {
  try {
    const event = req.body.events[0]
    //webhook URL verification 
    if (!event) return res.json({ event: 'webhook URL verification', webhookUrlVerified: true })

    const replyToken = event.replyToken
    const receivedMessageType = event.message.type
    //check message type
    if (receivedMessageType !== 'text') {
      const reminder = {
        type: 'text',
        text: '只能輸入文字，例如: 104。'
      }
      await client.replyMessage(replyToken, reminder)
      return res.json({ replyMessage: '只能輸入文字，例如: 104。', receivedMessageType })
    }

    //reply based on the text send by user
    const text = event.message.text.trim()
    console.log(event)
    if (text === '104') {
      const promise104 = new Promise(async (resolve, reject) => {
        const resultFrom104 = await run104Scraper()
        return resolve(resultFrom104)
      })

      await promise104.then(result => {
        const all104Jobs = result.nodejsJobs.concat(result.backendJobs)
        let jobStr = `104人力網\nNode.js 工作: \n\n`
        all104Jobs.map((job, index)=> {
          if (index === 10) jobStr += `____________________________________\nbackend 工作:\n\n`
          jobStr += `職稱: ${job.jobName} 
日期: ${job.date}
公司: ${job.companyName}
薪水: ${job.salary}
工作地址: ${job.workAddress}
公司簡介: ${job.companyIntro}...。
職缺連結: ${job.recruitmentUrl} \n\n`
        })  
    
      
    
        const message = {
          type: 'text',
          text: `${jobStr}`
        }
        //replyMessage does not work after waiting over 30s, no time to scrape
        client.pushMessage(process.env.USER_ID, message) 
          .then(() => console.log('message sent!'))
          
      })

    } else {
      const reminder = {
        type: 'text',
        text: `"${text}"是無效輸入，請輸入: 104。`
      }
      await client.replyMessage(replyToken, reminder)
    }
    res.json(event)
  } catch(err) {
    console.error(err)
  }
})

app.listen(PORT, () => {
  console.log(`This server is now listening to http://localhost:${PORT}.`)
})

// const promise104 = new Promise(async (resolve, reject) => {
//   const resultFrom104 = await run104Scraper()
//   return resolve(resultFrom104)
// })

// promise104.then(result => {
//   const all104Jobs = result.nodejsJobs.concat(result.backendJobs)
//   let jobStr = `104人力網\nNode.js 工作: \n\n`
//   all104Jobs.map((job, index)=> {
//     if (index === 10) jobStr += `________________________________\nbackend 工作:\n\n`
//     jobStr += `職稱: ${job.jobName} 
// 日期: ${job.date}
// 公司: ${job.companyName}
// 薪水: ${job.salary}
// 工作地址: ${job.workAddress}
// 公司簡介: ${job.companyIntro}...。
// 職缺連結: ${job.recruitmentUrl} \n\n`
//   })                         
//   const message = {
//     type: 'text',
//     text: `${jobStr}`
//   }

//   client.pushMessage(process.env.USER_ID, message)
//     .then(() => {
//       console.log('message sent!')
//     })
//     .catch((err) => {
//       console.error(err)
//     })
// })