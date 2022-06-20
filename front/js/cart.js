// récupérer le ou les produits du local storage

let goods = JSON.parse(localStorage.getItem('cart'));

let productList = fetch('http://localhost:3000/api/products')
  .then(response =>response.json())
  .then(products => {
   
    // si le panier n'est pas vide

    if (goods != null){

      let totalPrice = 0;
      let totalQty = 0;
       
      for (let good of goods) {

        //pour chaque produit sélectionné, récupérer les infos du produit

        for (let product of products){
          if(good.id === product._id){
            good.name = product.name;
            good.price = product.price;
            good.image = product.imageUrl;
            good.description = product.description;
            good.altTxt = product.altTxt;
          }
        }

        // ajout quantité et récupérer total

        totalQty += parseInt(good.quantity);
        totalPrice += parseInt(good.quantity) * parseInt(good.price);
       
        // récupérer toutes les quantités et prix et injecter au fichier html

        $('totalQuantity').innerHTML = totalQty;
        $('totalPrice').innerHTML = totalPrice;
     }

      // ajout de produit un par un dans le panier, puis ajouter la liste à la page cart.html

      let cartlist ='';
      goods.forEach(good =>{
        cartlist += `<article class="cart__item" data-id ='${good.id}' data-color="${good.color}">
      <div class="cart__item__img">
        <img src="${good.image}" alt="good.altTxt">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${good.name}</h2>
          <p>${good.color}</p>
          <p>${good.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${good.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article> `
       $('cart__items').innerHTML = cartlist;
      })
    }
     
     // si aucun produit dans le panier, montrer 0 quantité et prix

     else {
            $('totalQuantity').innerHTML = '0';
            $('totalPrice').innerHTML = '0';
          }
    })


  .catch((err) => {
    console.log("erreur 404, sur ressource api: " + err);
  });

function $(id){
  return document.getElementById(id);
};