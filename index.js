const puppeteer =require('puppeteer');
const fs = require('fs');
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./client_secret.json");
const doc = new GoogleSpreadsheet(
    "1TNjwIp5mRfCjcdZwn5aLi51d3VLjqFadu2hfdBF2buQ"
  );

const scrapeImages = async () =>{
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
 
   fs.readFile('./cookies.json', 'utf8',async function(err, data){
    if(data){
      let cookies = JSON.parse(data);
      await page.setCookie(...cookies);
  
    }if(err){
        
    await page.goto('https://breadfast-443524767043723394.myfreshworks.com/login');
    
    await page.waitForNavigation();
    await page.type('[name=username]', 'mohamed.abdelsalam@breadfast.com');
    await page.type('[name=password]', '9KSEytGvBq5QqiG');
    await page.click('[type=submit]')
    
    await page.waitForNavigation();
    
   cookies = await page.cookies();
   fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2),(err) => {});
    }
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    let rows = await sheet.getRows();
    for (let row of rows){
      if (row.status=="Closed (on time)"){  
         continue

      }else if (row.status=="Closed (late)"){
         continue

      }else if (row.status=="Not Related"){
        continue

     }else{
      await page.goto(row['FreshService Ticket URL']);
      await page.waitForSelector('#ticket-summary-widget > div > div > div.status-field')
      let element = await page.$('#ticket-summary-widget > div > div > div.status-field')
      let status = await page.evaluate(el => el.textContent, element)
      row.status = status.replace(/\s+/g, ' ').trim();
       
      try {
        await page.waitForSelector('[data-test-id=jira-issue-status-value]')  
        let Element = await page.$('[data-test-id=jira-issue-status-value]')
        let jira = await page.evaluate(el => el.textContent, Element)
        row['Jira Status']=jira.replace(/\s+/g, ' ').trim();
      }
      catch(err) {
        console.error(`Jira status not found for URL ${row['FreshService Ticket URL']}`);
          }

      try {
        await page.waitForSelector('div:nth-child(5) > div.ticket-conversation-load-more--wrapper > button > span')  
        let conversation = await page.$('div:nth-child(5) > div.ticket-conversation-load-more--wrapper > button > span')
       
        let cst = await page.evaluate(el => el.textContent, conversation)
        console.log(parseInt(cst))
        row.CST=parseInt(cst);
      }
      catch(err) {
        console.error(`no conversation ${row['FreshService Ticket URL']}`);
        row['CST']="0";
        
          }
      
       row.save(); }
    }  
   
await browser.close(); 
});

}

scrapeImages()
// #panel_details > div > div.ticket-conversation-load-more--wrapper > button > span
// #ticket-summary-widget > div > div.status-info > div.status-field
// #ticket-summary-widget > div > div > div.status-field
