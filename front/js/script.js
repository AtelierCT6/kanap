const productList = document.getElementById('items');

let products = fetch('http://localhost:3000/api/products')
  .then((response) =>response.json())
  .then(products=> {
    for (let i = 0; i < products.length; i++){
      let productLink = document.createElement('a');
      productLink.setAttribute('href',`./product.html?id=${products[i]._id}`);
      productList.appendChild(productLink);

      let productDetail = document.createElement('article');
      productLink.appendChild(productDetail);

      let productImg = document.createElement('img');
      productImg.setAttribute('src',products[i].imageUrl);
      productImg.setAttribute('alt',products[i].altTxt);
      productDetail.appendChild(productImg);

      let productName = document.createElement('h3');
      productName.classList.add('productName');
      productName.textContent = products[i].name;
      productDetail.appendChild(productName);

      let productDescription = document.createElement('p');
      productDescription.classList.add('productDescription');
      productDescription.textContent = products[i].description;
      productDetail.appendChild(productDescription);
    }
  })

  .catch((err) => {
    console.log("erreur 404, sur ressource api: " + err);
  });