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

app.post('/webhook', (req, res) => {
  console.log('There is new req')
  console.log(req.body.events)
  res.json(req.body.events)
})

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