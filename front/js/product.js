const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id'); 
console.log(myParam);

let iteminfo = fetch('http://localhost:3000/api/products')
  .then((response) =>response.json())
  .then((products) => {
    for (let item of products) {
      if (myParam === item._id){

        document.querySelector(".item__img").innerHTML = `<img src="${item.imageUrl}" alt="${item.altTxt}">`; 
        document.querySelector('#title').textContent = `${item.name}`;
        document.querySelector('#price').textContent = `${item.price}`;
        document.querySelector('#description').textContent = `${item.description}`;

        for(let color of item.colors){
          document.querySelector('#colors').innerHTML += `<option value="${color}">${color}</option>`;
        }
      }
    }
  }
  )

  .catch((err) => {
    console.log("erreur 404, sur ressource api: " + err);
  })