let cart = JSON.parse(localStorage.getItem('cart'));
if (cart == null) {
    cart = [];
}

// PANIER                                 -----------

const promises = cart.map(elt =>{
  return fetch('http://localhost:3000/api/products/' + elt.id).then(response => {
    return response.json();
  })
})


Promise.all(promises)

  .then(products =>{
    addItem(cart, products);
    total();

    // SUPPRESSION                                  ------------------

  let suppression = document.querySelectorAll('.deleteItem');
  suppression.forEach(button => {
    button.addEventListener('click', function(){
      this.parentElement.parentElement.parentElement.parentElement.remove();
      total();
      cart = cart.filter(function(item){
        return item.color !== button.parentElement.parentElement.dataset.color && item.id !== button.parentElement.parentElement.dataset.id;
      })
      localStorage.setItem('cart',JSON.stringify(cart));
    })
  })

    // MODIFICATION                                 ------------------

    let items = document.querySelectorAll('.itemQuantity');
    items.forEach(item => {
      item.addEventListener('change',function (event){
        item.setAttribute('value',event.target.value);
        total();
        for(i = 0; i < cart.length; i++){
          if(cart[i].id == item.parentElement.parentElement.dataset.id && cart[i].color == item.parentElement.parentElement.dataset.color){
            cart[i].quantity = event.target.value;
          }
        }
        localStorage.setItem('cart',JSON.stringify(cart));
      })
    })
  })  

// FUNCTION          ADD ITEM                     -----------

function addItem(cart, products){
  cart.forEach((cartElement) => {
    var currentProduct = null;
    products.forEach((product) => {
      if (product._id == cartElement.id){
        currentProduct = product;
      }
    })

    let cartItems = document.querySelector('#cart__items');

    let article = document.createElement('article');
    article.classList.add('cart__item');
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
    settings.setAttribute('data-id',`${currentProduct._id}`);
    settings.setAttribute('data-color',`${cartElement.color}`);
    content.appendChild(settings);

    let cartItemContent = document.createElement('h2');
    cartItemContent.textContent = currentProduct.name;
    description.appendChild(cartItemContent);

    let color = document.createElement('p');
    color.textContent = cartElement.color;
    description.appendChild(color);

    let prix = document.createElement('p');
    prix.textContent = `${currentProduct.price} €`;
    prix.className = 'price';
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
    supprimerItem.textContent = 'Supprimer';
    supprimer.appendChild(supprimerItem);
  })
}

// FUNCTION          TOTAL                   -----------

function total(){
  let articles = document.querySelectorAll('article');
  let prices = document.querySelectorAll('.price');
  let qtys = document.querySelectorAll('.itemQuantity');
  let sumPrix = 0;
  let sumQty = 0;

  for(let i=0; i<articles.length;i++){  
    sumQty += parseInt(qtys[i].value);    
    sumPrix += parseInt(prices[i].innerText.slice(0,4)) * parseInt(qtys[i].value);
  }
  document.getElementById('totalQuantity').innerText = sumQty;
  document.getElementById('totalPrice').innerText = sumPrix
}

// FORMULAIRE          ---------------

let inputs = document.querySelectorAll('.cart__order__form input');
let regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
let regName = /^[A-Za-z]{2,}$/;
let regAddress = /^[a-zA-Z0-9\s,.'-]{3,}$/ ;

regCheck(inputs[0],regName, 'Veuillez entrer au moins 2 caractères'); 
regCheck(inputs[1],regName, 'Veuillez entrer au moins 2 caractères'); 
regCheck(inputs[2],regAddress, 'Veuillez entrer au moins 2 caractères');
regCheck(inputs[3],regName, 'Veuillez entrer au moins 2 caractères');
regCheck(inputs[4],regEmail, 'Veuillez entrer une adresse Email valide'); 

function regCheck(ele, reg, errorMessage) {
    ele.addEventListener('change', function(){
        ele.addEventListener('blur', function(){
            if (!reg.test(this.value)) {
                this.nextElementSibling.innerHTML = errorMessage;
                this.setAttribute('data-val','false');
            } else {
              this.nextElementSibling.innerHTML = '';
              this.setAttribute('data-val','true');
            }
          }) 
    })
}

// COMMANDER          ---------------

let orderButton = document.getElementById('order');
    // création d'une variable pour recevoir les infos client et le détail du panier
let clientInfo = {};

    // creation d'un array, push l'id de l'article dans l'array
let produitId = [];

cart.forEach(item => {
    produitId.push(item.id);
})

    // add click event to button
orderButton.addEventListener('click', function (e) {
    // to prevent 'submit' default action
    e.preventDefault();
  
    // nombre d'informations valides dans le formulaire
    let flag = 0;
    inputs.forEach(input => {
        if (input.getAttribute('data-val') == 'true') {
            flag += 1;
        }
    })

    // si le formulaire est valide et que le panier n'est pas vide, mettre les infos dans clientInfo
    if (flag == 5 && produitId.length!=0) {
        clientInfo = {
            contact: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                email: document.getElementById('email').value,
            },
            products: produitId
      }

      fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify(clientInfo)
      })
        .then((res) => res.json())
        .then((data) => {
          // suppression des données du localStorage, et saut à la page de confirmation
          localStorage.clear();
          window.location.href = "./confirmation.html?id=" + data.orderId;
        })
        .catch(() => {
          alert("Une erreur est survenue, merci de revenir plus tard.");
        })
      
    } else if (produitId.length == 0) {
            alert("Vous n'avez sélectionné aucun article")
    } else {
            alert('Veuillez vérifier les informations rentrés dans le formulaire') 
        }
})