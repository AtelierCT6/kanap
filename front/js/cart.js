let cart = JSON.parse(localStorage.getItem('cart'));
if (cart == null) {
    cart = [];
    document.getElementById('totalQuantity').innerText = '0';
    document.getElementById('totalPrice').innerText = '0';
} 

let cartlist = '';
let sumPrix = 0;
let sumQty = 0;

// PANIER                                 -----------

const promises = cart.map(elt =>{
  return fetch('http://localhost:3000/api/products/' + elt.id).then(response => {
    return response.json();
  })
})

Promise.all(promises)
  .then(products =>{
    cart.forEach((cartElement,index) => {
      var currentProduct = null;
      products.forEach((product) => {
        if (product._id == cartElement.id){
          currentProduct = product;
        }
      })

      let cartItems = document.querySelector('#cart__items');

      let article = document.createElement('article');
      article.classList.add('cart__item');
      article.setAttribute('data-id',`${currentProduct._id}`);
      article.setAttribute('data-color',`${cartElement.color}`);
      cartItems.appendChild(article);

      let cartItemImg = document.createElement('div');
      cartItemImg.classList.add('cart__item__img');
      article.appendChild(cartItemImg);

      let productImg = document.createElement('img');
      productImg.setAttribute('src',`${currentProduct.imageUrl}`);
      productImg.setAttribute('alt',`${currentProduct.altTxt}`);
      cartItemImg.appendChild(productImg);

      let content = document.createElement('div');
      content.classList.add('art__item__content');
      article.appendChild(content);

      let description = document.createElement('div');
      description.classList.add('cart__item__content__description');
      content.appendChild(description);

      let settings = document.createElement('div');
      settings.classList.add('cart__item__content__settings');
      content.appendChild(settings);

      let cartItemContent = document.createElement('h2');
      cartItemContent.textContent = currentProduct.name;
      description.appendChild(cartItemContent);

      let color = document.createElement('p');
      color.textContent = cartElement.color;
      description.appendChild(color);

      let prix = document.createElement('p');
      prix.textContent = `${currentProduct.price} €`;
      description.appendChild(prix);

      let contentSettings = document.createElement('div');
      contentSettings.classList.add('cart__item__content__settings__quantity');
      settings.appendChild(contentSettings);

      let quantity = document.createElement('p');
      quantity.textContent = 'Qté :';
      contentSettings.appendChild(quantity);

      let input = document.createElement('input');
      input.classList.add('itemQuantity');
      input.setAttribute('type','number');
      input.setAttribute('name','itemQuantity');
      input.setAttribute('min','1');
      input.setAttribute('max','100');
      input.setAttribute('value',`${cartElement.quantity}`);
      contentSettings.appendChild(input);

      let supprimer = document.createElement('div');
      supprimer.classList.add('cart__item__content__settings__delete');
      settings.appendChild(supprimer);

      let supprimerItem = document.createElement('p');
      supprimerItem.classList.add('deleteItem');
      supprimerItem.setAttribute('data-index',`${index}`);
      supprimerItem.textContent = 'Supprimer';
      supprimer.appendChild(supprimerItem);
      
        // TOTAUX                                   ------------------

        totalCalc(currentProduct.price, cartElement.quantity);
    })

    let supprimers = Array.from(document.getElementsByClassName('deleteItem'));
    supprimers.forEach((supprimer,index) => {
      supprimer.addEventListener('click',function(){
        cart = cart.filter(function(item,i){
          return index !=i;
        })
        localStorage.setItem('cart',JSON.stringify(cart));
        return location.reload();
      })
    })

    let items = Array.from(document.getElementsByClassName('cart__item'));
    items.forEach(item => {
      item.addEventListener('change',function (e){
        for(good of cart){
          if(good.id == item.dataset.id && good.color == item.dataset.color){
            good.quantity = e.target.value;
            localStorage.setItem('cart',JSON.stringify(cart));
          }
        }
        return location.reload();
      })
    })
  })




// FUNCTION                               -----------
function totalCalc(price,qty){
  sumPrix += parseInt(price) * parseInt(qty);
  sumQty += parseInt(qty);      
  document.getElementById('totalQuantity').innerText = sumQty;
  document.getElementById('totalPrice').innerText = sumPrix;
}



