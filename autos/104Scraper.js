if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const run104Scraper = require('../scrapers/104Scraper')
const line = require('@line/bot-sdk')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
const client = new line.Client(config)

const promise104 = new Promise(async (resolve, reject) => {
  const jobStr104 = await run104Scraper()
  return resolve(jobStr104)
})

promise104.then(async jobStr104 => {                         
  const message = {
    type: 'text',
    text: `${jobStr104}`
  }

  await client.pushMessage(process.env.USER_ID, message)
    .then(() => {
      console.log('message sent!')
    })
    .catch((err) => {
      console.error(err)
    })
  
  process.exit()
})