const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.post("/scrape",(req,res)=>{
    
    const webUrl = req.body.webUrl;
    

    axios(webUrl)
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
        res.write("<h1>"+title +"</h1>")
        // res.write("desc ");
        // res.write("image ");
        // res.write("favicon ");
        // articles.forEach(article => {
        //     const articleItem = "<div><h3>" + article.title + "</h3><p>" + article.url + "</p></div>";
        //     res.write(articleItem);
        // })

        res.write("<html><body>hi hello</body></html>");
        console.log(articles[0].title);
        
        
        res.send();
    
    
    }).catch(err => console.log(err));

})



app.listen(3000,()=>{console.log("port is running")})