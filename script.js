const products = [
    { id: 1, name: "MacBook Pro 14", category: "laptop", price: 4200, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
    { id: 2, name: "iPhone 15 Pro", category: "phone", price: 3300, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
    { id: 3, name: "AirPods Max", category: "accessory", price: 1600, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 4, name: "Dell XPS 13", category: "laptop", price: 3100, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500" }
];

let cart = [];

// პროდუქტების რენდერი
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    items.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">${product.price} ₾</div>
                <button class="add-btn" onclick="addToCart(${product.id})">კალათაში დამატება</button>
            </div>
        `;
    });
}

// ფილტრაცია
function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// კალათის ფუნქციები
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartCount.innerText = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">კალათა ცარიელია</p>';
        cartTotal.innerText = '0 ₾';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <small>${item.price} ₾</small>
                </div>
                <i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    });

    cartTotal.innerText = `${total} ₾`;
    document.getElementById('payAmount').innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// გადახდის ფანჯარა
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("კალათა ცარიელია!");
        return;
    }
    document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function handlePayment(e) {
    e.preventDefault();
    alert("გადახდა წარმატებით განხორციელდა! გმადლობთ შეკვეთისთვის.");
    cart = [];
    updateCartUI();
    closeCheckoutModal();
    toggleCart();
}

// საიტის ჩატვირთვა
renderProducts(products);

async function handlePayment(e) {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cart })
        });

        const session = await response.json();
        
        if (session.url) {
            // გადამისამართება უსაფრთხო გადახდის გვერდზე
            window.location.href = session.url;
        } else {
            alert("გადახდის შეცდომა: " + session.error);
        }
    } catch (err) {
        console.error(err);
        alert("სერვერთან კავშირი ვერ დამყარდა. დარწმუნდი, რომ server.js გაშვებულია.");
    }
}