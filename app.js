const line = require('@line/bot-sdk')
const express = require('express')

const config = require('./config/line')
const run104Scraper = require('./scrapers/104Scraper')

const app = express()
const PORT = process.env.PORT
const client = new line.Client(config)

app.use(line.middleware(config))

app.post('/webhook', async (req, res) => {

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
      await client.replyMessage(replyToken, reminder).then(() => console.log('err')).catch((err) => console.error(err))
      return res.json({ replyMessage: '只能輸入文字，例如: 104。', receivedMessageType })
    }

    //reply based on the text send by user
    const text = event.message.text.trim()
    res.json(event) //response before scraping, no return

    if (text === '104') {
      const jobStr104 = await run104Scraper()
      const message = {
        type: 'text',
        text: `${jobStr104}`
      }
      //replyMessage() does not work after waiting over 30s, no time to scrape
      await client.pushMessage(process.env.USER_ID, message).catch((err) => console.error(err))
    } else {
      const reminder = {
        type: 'text',
        text: `"${text}"是無效輸入，請輸入: 104。`
      }
      await client.replyMessage(replyToken, reminder).catch((err) => console.error(err))
    }
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