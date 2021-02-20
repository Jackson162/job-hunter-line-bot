const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const baseUrl = 'https://www.104.com.tw'

const sleep = (milisecond) => {
  return new Promise((resolve, reject) => setTimeout(resolve, milisecond))
}

const scrapeCompanyPage = async (dataList, page) => {
  for (let i = 0; i < dataList.length; i++) {
    await page.goto(dataList[i].companyUrl)
    const html = await page.content()
    const $ = cheerio.load(html)
    const header = $('div.header')
    dataList[i].companyAddress = header.attr('address')
    dataList[i].companyIntro = header.attr('profile')
    await sleep(2000)
  }
  return dataList
}

const scrapeSearchPage = ($) => {
  const result = $('article.job-list-item:not(.b-block--ad)').slice(0, 10).map((index, element) => {
    const jobName = $(element).attr('data-job-name')
    const companyName = $(element).attr('data-cust-name')     
    const recruitmentUrl = 'https:' + $(element).find('a.js-job-link').attr('href')
    const date = $(element).find('span.b-tit__date').text().trim()
    const salary = $(element).find('div.job-list-tag > span:nth-child(1)').text()
    const companyUrl = 'https:' + $(element).find('div.b-block__left > ul:nth-child(2) > li:nth-child(2) > a').attr('href')
    const workAddress = $(element).find('ul.job-list-intro > li:nth-child(1)').text()
    return { jobName, companyName, salary, workAddress, date, recruitmentUrl, companyUrl }
  }).get()

  return result
}


const scrapeNodejs = async (page) => {
  const criteriaUrl = '/jobs/search/?ro=1&kwop=7&keyword=nodejs&expansionType=area%2Cspec%2Ccom%2Cjob%2Cwf%2Cwktm&area=6001001000%2C6001002000%2C6001006000&indcat=1001001000&order=11&asc=0&sctp=M&scmin=40000&scstrict=1&scneg=0&page=1&mode=s&jobsource=2018indexpoc'
  await page.goto(`${baseUrl}${criteriaUrl}`)
  const html = await page.content()

  //select element with Cheerio
  const $ = cheerio.load(html)
  const jobsList = scrapeSearchPage($)
  const jobListWithCompanyInfo = await scrapeCompanyPage(jobsList, page)
  return jobListWithCompanyInfo
}

const main = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage() //new Page instance
  const nodejsJobs = await scrapeNodejs(page) //add await when call any async function
  console.log('nodejsJobs', nodejsJobs)
}

main()

