const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); 

let iteminfo = fetch('http://localhost:3000/api/products/'+productId)
  .then((response) =>response.json())
  .then(item => {

        document.querySelector(".item__img").innerHTML = `<img src="${item.imageUrl}" alt="${item.altTxt}">`; 
        $('title').textContent = `${item.name}`;
        $('price').textContent = `${item.price}`;
        $('description').textContent = `${item.description}`;

        for(let color of item.colors){
          document.querySelector('#colors').innerHTML += `<option value="${color}">${color}</option>`;
        }
      }
  )

  .catch((err) => {
    console.log("erreur 404, sur ressource api: " + err);
  })

// ajout au panier
  
  $('addToCart').onclick = function(){
    panier = localStorage.getItem('cart');
    if (panier == null){
      panier = [];
    }

    else{
      panier = JSON.parse(panier);
    };
  
    if($('quantity').value != 0 && $('colors').value != ""){ 
    let flag = false;
    for(i=0; i<panier.length; i++){
        if (panier[i].id == productId && panier[i].color == $('colors').value){
        panier[i].quantity = parseInt(panier[i].quantity) + parseInt($('quantity').value);
        flag = true;
        alert('Votre article a bien été ajouté au panier !');
      };
    };
  
     
      if(flag == false){
        newItem = {
        'id':productId,
        'color': $('colors').value,
        'quantity':parseInt($('quantity').value)
        }
        panier.push(newItem);
        
      };
  
  
    localStorage.setItem('cart', JSON.stringify(panier));
  } else {
    alert('Attention !\nVous n\'avez pas choisi de couleur ou quantité.');
  }};

  function $(id){
    return document.getElementById(id);
  };