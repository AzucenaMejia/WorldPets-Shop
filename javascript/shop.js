document.addEventListener('DOMContentLoaded', ()=>{
  const products = [
    {id:1,name:'Alimento para gato Purina',price:35.00,img:'imagenes/purina gato.jpg'},
    {id:2,name:'Alimento para perro Purina',price:55.00,img:'imagenes/purina perro.jpg'},
    {id:3,name:'Cama para perros',price:120.00,img:'imagenes/cama perros.jpg'},
    {id:4,name:'Pack de juguetes',price:40.00,img:'imagenes/descargajuguetespack.jpg'},
    {id:5,name:'Arena para gatos',price:25.00,img:'imagenes/arena gatos.jpg'},
    {id:6,name:'Golosinas para gatos',price:18.00,img:'imagenes/dgolosinas gatos.jpg'}
  ];

  const productsGrid = document.getElementById('productsGrid');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function formatPrice(v){return 'S/ ' + v.toFixed(2)}

  function renderProducts(){
    productsGrid.innerHTML = '';
    products.forEach(p=>{
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-md-4 mb-4';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text mt-auto"><strong>${formatPrice(p.price)}</strong></p>
            <button class="btn btn-primary add-to-cart mt-2" data-id="${p.id}">Agregar</button>
          </div>
        </div>`;
      productsGrid.appendChild(col);
    });
  }

  let cart = {};
  function saveCart(){localStorage.setItem('wp_cart', JSON.stringify(cart));}
  function loadCart(){cart = JSON.parse(localStorage.getItem('wp_cart')||'{}');}

  function updateCartCount(){
    const total = Object.values(cart).reduce((s,i)=>s+i.qty,0);
    cartCount.textContent = total;
  }

  function renderCart(){
    cartItemsContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    let subtotal = 0;
    Object.values(cart).forEach(item=>{
      subtotal += item.qty * item.price;
      const div = document.createElement('div');
      div.className = 'd-flex align-items-center mb-2';
      div.innerHTML = `
        <img src="${item.img}" width="60" height="60" class="me-2 rounded">
        <div class="flex-grow-1">
          <div>${item.name}</div>
          <small class="text-muted">${formatPrice(item.price)}</small>
        </div>
        <div class="text-end">
          <div class="mb-1">x${item.qty}</div>
          <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">Eliminar</button>
        </div>`;
      fragment.appendChild(div);
    });
    cartItemsContainer.appendChild(fragment);
    cartSubtotal.textContent = formatPrice(subtotal);
    updateCartCount();
  }

  function addToCart(id){
    const p = products.find(x=>x.id==id);
    if(!p) return;
    if(cart[id]) cart[id].qty += 1; else cart[id] = {...p, qty:1};
    saveCart(); renderCart();
  }

  function removeFromCart(id){
    if(!cart[id]) return;
    delete cart[id]; saveCart(); renderCart();
  }

  productsGrid.addEventListener('click', e=>{
    if(e.target.classList.contains('add-to-cart')){
      const id = e.target.dataset.id; addToCart(Number(id));
    }
  });

  cartItemsContainer.addEventListener('click', e=>{
    if(e.target.classList.contains('remove-item')){
      const id = Number(e.target.dataset.id); removeFromCart(id);
    }
  });

  checkoutBtn.addEventListener('click', ()=>{
    if(Object.keys(cart).length===0){ alert('Tu carrito está vacío'); return; }
    // simulamos pago
    alert('Gracias por tu compra. (Simulación)');
    cart = {}; saveCart(); renderCart();
    const offcanvasEl = document.getElementById('cartOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if(offcanvas) offcanvas.hide();
  });

  // init
  loadCart(); renderProducts(); renderCart();
});