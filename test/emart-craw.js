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
  await page.goto('https://emart24.co.kr/product/eventProduct.asp');
  
  let csv;
  csv = "편의점,행사,상품명,가격,이미지URL\n"
  
  await page.click('#tabNew > ul > li:nth-child(3) > h4 > a');
  sleep(1000);
  for (let i=0; i< 59; i++) {
    sleep(2000);
    await page.waitForNavigation({timeout: 40});
    const content = await page.content();
    

    let $ = cheerio.load(content);

    const lists = $("#regForm > div.section > div.eventProduct > div.tabContArea > ul > li");
    // #contents > div.cnt > div.cnt_section.mt50 > div > div > div:nth-child(3) > ul > li:nth-child(1) > div > p.img > img
    lists.each((index, list) => {
      csv = csv + "emart24,2+1,"
      csv = csv + $(list).find("div.box > p.productDiv").text().replace(",", "") + ",";
      csv = csv + $(list).find("div.box > p.price").text().replace(",", "") + ",";
      csv = csv + "https://emart24.co.kr" + $(list).find("div.box > p.productImg > img").attr("src") + "\n";
    });
    sleep(1000);
    
    await page.click("#regForm > div.section > div.eventProduct > div.paging > a.next.bgNone > img");
  }
  const BOM = '\uFEFF';
  
  fs.writeFileSync('emart(2+1).csv', BOM + csv);

  browser.close();
})();