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
    
        // res.write("desc ");
        // res.write("image ");
        // res.write("favicon ");
        // articles.forEach(article => {
        //     const articleItem = "<div><h3>" + article.title + "</h3><p>" + article.url + "</p></div>";
        //     res.write(articleItem);
        // })

        res.write('<html lang="en"><head>            <meta charset="utf-8">            <meta name="viewport" content="width=device-width, initial-scale=1">            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">  <title>Scraped </title><style>img{height: 300px;width: auto;}</style></head>        <body><div class="p-5 bg-light rounded-3"><div class="container-fluid py-5"><h1 class="display-5 fw-bold">'+title+'</h1>                <p class="col-md-8 fs-4">'+description+' Lorem ipsum dolor sit amet.</p> <img src="'+image+'" alt = "img not present"/><img src="'+favicon+'" alt="favicon not present" /></div><div class="col"><div class=" p-5 text-white bg-dark rounded-3">');
        // <h2>article heading</h2>   <p><a href="#">url text</a></p> </div>  </div>
        //     </div>    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>  </body>  </html>')
        
            articles.forEach(article => {
                const articleItem = "<div><h3>" + article.title + "</h3><br/> <p><a href="+article.url+">"+article.url+"</a></p></div><br/><br/><br/>" ;
                // const articleItem = '<h2>'+article.title+'</h2>   <p><a href="'+article.url+'">'+article.url+'</a></p> </div>  </div>';
                // res.write('<h2>'+article.title+'</h2>   <p><a href="'+article.url+'">'+article.url+'</a></p> </div>  </div>'); 
                res.write(articleItem);
            })
            
            res.write('</div>    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>  </body>  </html>');
        
        res.send();

    
    
    }).catch(err => console.log(err));

})



app.listen(3000,()=>{console.log("port is running")})