const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const baseUrl = 'https://www.104.com.tw/jobs/search/'

const scrapeNodejs = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage() //new Page instance
  let criteria = '?ro=1&kwop=7&keyword=nodejs&expansionType=area%2Cspec%2Ccom%2Cjob%2Cwf%2Cwktm&area=6001001000%2C6001002000%2C6001006000&indcat=1001001000&order=11&asc=0&sctp=M&scmin=40000&scstrict=1&scneg=0&page=1&mode=s&jobsource=2018indexpoc'
  await page.goto(
    `${baseUrl}${criteria}`
  )
  let html = await page.content()
}

scrapeNodejs()


