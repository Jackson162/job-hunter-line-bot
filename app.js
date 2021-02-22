if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const run104Scraper = require('./104Scraper')
const line = require('@line/bot-sdk')

const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const promise104 = new Promise(async (resolve, reject) => {
  const resultFrom104 = await run104Scraper()
  return resolve(resultFrom104)
})

promise104.then(result => {
  const all104Jobs = result.nodejsJobs.concat(result.backendJobs)
  let jobStr = `104人力網\nNode.js 工作: \n\n`
  all104Jobs.map((job, index)=> {
    if (index === 10) jobStr += `________________________________\nbackend 工作:\n\n`
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

  client.pushMessage(process.env.USER_ID, message)
    .then(() => {
      console.log('message sent!')
    })
    .catch((err) => {
      console.error(err)
    })
})