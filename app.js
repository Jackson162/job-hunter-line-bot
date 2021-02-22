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
  console.log(result.nodejsJobs.slice(0, 2))
  const message = {
    type: 'text',
    text: `${JSON.stringify(result.nodejsJobs.slice(0, 2))}`
  }

  client.pushMessage(process.env.USER_ID, message)
    .then(() => {
      console.log('message sent!')
    })
    .catch((err) => {
      console.error(err)
    })
})