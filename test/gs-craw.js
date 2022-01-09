const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
// const node2 = require ('node:buffer');


function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

(async() => {
  const browser = await puppeteer.launch({
    headless: false
  });

  // 새로운 페이지를 연다.
  const page = await browser.newPage();
  // 페이지의 크기를 설정한다.
  await page.setViewport({
    width: 1024,
    height: 1600
  });
  await page.goto('http://gs25.gsretail.com/gscvs/ko/products/event-goods#');
  // let lastPage = 0;
  // const content = await page.content();
  // const $ = cheerio.load(content);
  // await page.click("#contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(3) > div > a.next2");
  // const content2 = await page.content();
  // const $2 = cheerio.load(content2);
  // const lastPaging = $2("#contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(3) > div > span > a");
  // lastPage = lastPaging;
  // await page.click('#contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(3) > div > a.prev2');
  let csv;
  csv = "편의점,행사,상품명,가격,이미지URL\n"
  // await page.click('#TWO_TO_ONE');
  sleep(1000);
  for (let i=0; i< 31; i++) {
    sleep(1000);
    const content = await page.content();
    

    let $ = cheerio.load(content);

    const lists = $("#contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(3) > ul > li");
    // #contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(3) > ul > li:nth-child(1) > div > p.img > img
    lists.each((index, list) => {
      csv = csv + "GS,1+1,"
      csv = csv + $(list).find("div > p.tit").text().replace(",", "") + ",";
      csv = csv + $(list).find("div > p.price").text().replace(",", "") + ",";
      csv = csv + $(list).find("div > p.img > img").attr("src") + "\n";
    });
    sleep(1000);
    
    await page.click("#contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(3) > div > a.next");
    // await page.click('#contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(5) > div > a.next'); 
  }
  const BOM = '\uFEFF';
  
  fs.writeFileSync('gs25(1+1).csv', BOM + csv);

  browser.close();
})();