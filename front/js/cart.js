let cart = JSON.parse(localStorage.getItem('cart'));
if (cart == null) {
    cart = [];
} 

let cartlist = '';
let sumPrix = 0;
let sumQty = 0;

for (let i=0; i<cart.length; i++) {
    fetch('http://localhost:3000/api/products/' + cart[i].id)
    .then(response => {return response.json()} )
    .then(product => {
        cartlist += `<article class="cart__item" data-id="${product._id}" data-color="${cart[i].color}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${cart[i].color}</p>
            <p>${product.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté :</p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
     
      document.getElementById('cart__items').innerHTML = cartlist;

      sumPrix += parseInt(product.price) * parseInt(cart[i].quantity);
      sumQty += parseInt(cart[i].quantity);
      
      document.getElementById('totalQuantity').innerText=sumQty;
      document.getElementById('totalPrice').innerText=sumPrix;

    })
  }

