// Button GLOBAL
const carShop = document.querySelector('.cart__items');
const priceOfPay = document.querySelector('.total-price');
// Requisito 4 setItem
const saveLs = () => {
  localStorage.setItem('Produto', carShop.innerHTML);
  localStorage.setItem('Price', priceOfPay.innerHTML);
};
// Recupero o localStorage
const catchCarShop = () => {
  carShop.innerHTML = localStorage.getItem('Produto');
  priceOfPay.innerHTML = localStorage.getItem('Price');
};
// requisito 5
const totalPrice = async () => {
  let price = 0;
  const allCarShop = document.querySelectorAll('.cart__item');
  allCarShop.forEach((item) => {
    const priceTheItems = item.innerText.split('$');
    price += Number(priceTheItems[1]);
  });
  priceOfPay.innerHTML = `${Math.round((price * 100)) / 100}`;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// requisito 3
function cartItemClickListener(event) {
  const evento = event.target;
  evento.remove();
  totalPrice();
  saveLs();
}

carShop.addEventListener('click', cartItemClickListener); // requisito 3, evento pra remover um item criado

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `❌ - Serie: ${sku},

  ${name}.

  Preço: R$ ${salePrice}`;

  const getOl = document.querySelector('.cart__items');
  getOl.appendChild(li);
  totalPrice();
  saveLs();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// requisito 2
const addcart = (event) => {
  const sectionItem = event.target.parentNode;
  const id = getSkuFromProductItem(sectionItem);
  fetch(`https://api.mercadolibre.com/items/${id}`)  
    .then((response) => response.json())
    .then((data) => createCartItemElement(data))
    .catch((error) => {
      alert(error.message);
    });
};

const buttonEmptyCar = document.querySelector('.empty-cart');

const emptyCar = () => {
  carShop.innerHTML = '';
  totalPrice();
  saveLs();
};

buttonEmptyCar.addEventListener('click', emptyCar);

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addcart); // alocado evento dentro do create product

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

const loadingId = document.querySelector('.loading');
const itemsSection = document.querySelector('.items');

const fetchProdutos = (query) => {
  // Conecta na API e busca o item query
  // Posiciona o elemento dentro do .items (que é o noome do grupo onde vai estar todos itens)
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`) // chama a API
    .then((response) => response.json())
    .then((produtos) => {
      produtos.results.forEach((item) => {
        itemsSection.appendChild(createProductItemElement(item));
      });
      loadingId.remove(); // requisito 07
    });
};

const getProdutos = async () => {
  // requisito 01
  try {
    fetchProdutos('bebe'); // Conjunto de itens a procurar
  } catch (error) {
    alert('Ocorreu um erro ao buscar o produto');
  }
};
// funções de pesquisas de produtos
const searchInput = document.querySelector('#input-search');
const searchButton = document.querySelector('.button-search');
const search = (event) => {
  if (event.keyCode === 13) {
    const items = document.querySelectorAll('.item');
    const itemContainer = document.querySelector('.items');
    items.forEach((item) => itemContainer.removeChild(item));
    fetchProdutos(searchInput.value);
    searchInput.value = '';
  }
  return 0;
};

const searchClick = (event) => {
  if (event.target) {
    const items = document.querySelectorAll('.item');
    const itemContainer = document.querySelector('.items');
    items.forEach((item) => itemContainer.removeChild(item));
    fetchProdutos(searchInput.value);
    searchInput.value = '';
  }
  return 0;
};

searchInput.addEventListener('keyup', search);
searchButton.addEventListener('click', searchClick);

window.onload = () => {
  catchCarShop();
  getProdutos();
};

function buscarCep(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
          if (!data.erro) {
              document.getElementById('logradouro').textContent = data.logradouro;
              document.getElementById('bairro').textContent = data.bairro;
              document.getElementById('cidade').textContent = data.localidade;
              document.getElementById('estado').textContent = data.uf;
              document.getElementById('CEP').textContent = data.cep;
          
          } else {
              alert('CEP não encontrado. Por favor, verifique o CEP inserido.');
          }
      })
      .catch(error => console.error(error));
}

// Event listener para o botão "Buscar CEP"
document.getElementById('buscar-cep').addEventListener('click', (event) => {
  event.preventDefault();
  const cep = document.getElementById('cep').value;
  buscarCep(cep);
});

// Event listener para o formulário de checkout
document.getElementById('checkout-form').addEventListener('submit', (event) => {
  event.preventDefault();
  // Aqui você pode adicionar lógica para finalizar a compra e enviar os dados do usuário.
  alert('Compra realizada com sucesso, Voce recebera um e-mail com a confirmacao ,Obrigado!');
});