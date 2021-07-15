const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');


let link = `https://www.olx.ua/uk/transport/legkovye-avtomobili/lvov/`; // - your link
let pages = 0;
try {

  fs.unlinkSync('data.js')

} catch (err) {


}
const getHTML = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};
async function start(){
  const selector = await getHTML(link);
  pages = Number(selector("#body-container > div:nth-child(3) > div > div.pager.rel.clr > span:nth-child(17) > a > span").html()) // number of pages (deafult all)
}
let title = [];

  
async function parse() {
  let pages_load = await start()
  for(let page = 1; page<pages; page++){
  const selector = await getHTML(`${link}?page=${page}`);
  async function sele() {selector('.wrap').each((i, element) => {
  title.push({
  "title":(selector(element).find(("tr:nth-child(1) > td.title-cell > div > h3 > a > strong")).text()),
  "time":(selector(element).find(("tr:nth-child(2) > td.bottom-cell > div > p > small:nth-child(2) > span")).text()),
  "price":(selector(element).find(("tr:nth-child(1) > td.wwnormal.tright.td-price > div > p > strong")).text()),
  "location":(selector(element).find(("tr:nth-child(2) > td.bottom-cell > div > p > small:nth-child(1) > span")).text()),
  "link": (selector(element).find(("tr:nth-child(1) > td.title-cell > div > h3 > a")).attr('href'))
  })
  })}

  async function d(){
  let resuly = await sele()
  for (let i = -44+(44*page); i<44*page; i++){
    const selecto = await getHTML(title[i].link);
    let options = []
selecto("li[class=css-ox1ptj]").each((i, element)=>{
  options[i] = selecto(element).children().text();
})
      
      title[i].deteiled = {
        "describtion":selecto('div[class=css-g5mtbi-Text]').text(),
        "options":options
      }

  }
}
let dp = await d()
}
};


async function end(){
  let efd = await parse()
  fs.appendFile('data.js', `console.log(${JSON.stringify(title)})`, (err) => {
    if(err) throw err;
    console.log('Data has been added!');
  })
  }
end()

