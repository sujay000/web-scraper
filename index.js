const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

console.log("helllo");
const url = 'https://www.theguardian.com/uk'


app.get('/',function(req,res){
   axios(url)
.then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];
    const title = $('title').first().text();
    const favicon = $('link[rel="shorcut icon"]').attr('href');

    const getMetaTag =(name) => 
       $(`meta[name=${name}]`).attr(`content`)||
       $(`meta[property="og:${name}"]`).attr('content') ||
       $(`meta[property = "twitter:${name}]`).attr('content'); 

    const description = getMetaTag('description');
    const image = getMetaTag('image');

   const all = {
      title,
      description,
      image,
      favicon,
      articles
   };

    $('.fc-item__title', html).each(function () { 
        const title = $(this).text();
        const url = $(this).find('a').attr('href');
        articles.push({
            title,
            url
        })
    })

   res.json(all);



}).catch(err => console.log(err));
})




app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
