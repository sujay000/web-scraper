const feedDisplay = document.querySelector('#feed');

const titleDisplay = document.querySelector('#title');
const descDisplay = document.querySelector('#desc');
const imageDisplay = document.querySelector('#image');
const faviconDisplay = document.querySelector('#favicon');



fetch('http://localhost:8000/')
   .then(response => response.json())
   .then(data => {
       titleDisplay.insertAdjacentHTML("beforeend",`<h1>`+ data.title +`</h1>`);
       descDisplay.insertAdjacentHTML("beforeend",`<h2>`+ data.description +`</h2>`);
       imageDisplay.insertAdjacentHTML("beforeend", `<img src= "`+ data.image + `" alt="img">` ); 
       faviconDisplay.insertAdjacentHTML("beforeend", `<img src= "`+ data.favicon + `" alt="favicon">` ); 

      console.log(data.favicon);
       data.articles.forEach(article => {
           const articleItem = `<div><h3>` + article.title + `</h3><p><a href ="`+article.url +`">` + article.url + `</a></p></div>`
           feedDisplay.insertAdjacentHTML("beforeend", articleItem)
       })
      
  }).catch(err => console.log(err))
