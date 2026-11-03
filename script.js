
const products = document.querySelectorAll(".product");
const filters = document.querySelectorAll(".filter");
const search = document.querySelector("#search");

const cartItems = document.querySelector("#cart-items");
const favItems = document.querySelector("#fav-items");

const overlay = document.querySelector("#overlay");
const cartDrawer = document.querySelector("#cart-drawer");
const favDrawer = document.querySelector("#fav-drawer");

let cart = [];
let favorites = [];

function openDrawer(drawer) {
    cartDrawer.classList.remove("open");
    favDrawer.classList.remove("open");
    drawer.classList.add("open");
    overlay.classList.add("show");
}

function closeDrawers() {
    cartDrawer.classList.remove("open");
    favDrawer.classList.remove("open");
    overlay.classList.remove("show");
}

document.querySelector("#cart-btn").onclick = () => openDrawer(cartDrawer);
document.querySelector("#fav-btn").onclick = () => openDrawer(favDrawer);

document.querySelectorAll(".close-btn").forEach(button => {
    button.onclick = closeDrawers;
});

overlay.onclick = closeDrawers;

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="drawer-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price} × ${item.quantity}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="drawer-empty">Your bag is empty.</p>';
    }

    document.querySelector("#cart-count").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelector("#drawer-count").textContent = cart.length;
    document.querySelector("#cart-total").textContent = "$" + total;
}

document.querySelectorAll(".add-btn").forEach(button => {
    button.onclick = () => {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCart();
        button.textContent = "Added ✓";

        setTimeout(() => {
            button.textContent = "Add to bag +";
        }, 900);
    };
});

cartItems.onclick = event => {
    if (event.target.classList.contains("remove-item")) {
        cart.splice(Number(event.target.dataset.index), 1);
        updateCart();
    }
};

function updateFavorites() {
    favItems.innerHTML = "";

    favorites.forEach(item => {
        favItems.innerHTML += `
            <div class="drawer-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>Saved to favorites</p>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
    });

    if (favorites.length === 0) {
        favItems.innerHTML = '<p class="drawer-empty">No favorites yet.</p>';
    }

    document.querySelector("#fav-count").textContent = favorites.length;
    document.querySelector("#fav-drawer-count").textContent = favorites.length;

    document.querySelectorAll(".product-fav").forEach(button => {
        button.classList.toggle(
            "active",
            favorites.some(item => item.id === button.dataset.id)
        );
    });
}

document.querySelectorAll(".product-fav").forEach(button => {
    button.onclick = () => {
        const id = button.dataset.id;
        const product = [...products].find(item =>
            item.querySelector(".product-fav").dataset.id === id
        );

        const name = product.querySelector("h3").textContent;
        const existing = favorites.find(item => item.id === id);

        if (existing) {
            favorites = favorites.filter(item => item.id !== id);
        } else {
            favorites.push({ id, name });
        }

        updateFavorites();
    };
});

favItems.onclick = event => {
    if (event.target.classList.contains("remove-item")) {
        const id = event.target.dataset.id;
        favorites = favorites.filter(item => item.id !== id);
        updateFavorites();
    }
};

function searchProducts() {
    const value = search.value.toLowerCase();
    const activeFilter = document.querySelector(".filter.active").dataset.filter;

    products.forEach(product => {
        const name = product.dataset.name.toLowerCase();
        const category = product.dataset.type;

        const matchesName = name.includes(value);
        const matchesCategory = activeFilter === "all" || category === activeFilter;

        product.style.display =
            matchesName && matchesCategory ? "block" : "none";
    });

    const visible = [...products].some(product => product.style.display !== "none");

    document.querySelector("#empty-state").style.display =
        visible ? "none" : "block";
}

filters.forEach(button => {
    button.onclick = () => {
        filters.forEach(filter => filter.classList.remove("active"));
        button.classList.add("active");
        searchProducts();
    };
});

search.oninput = searchProducts;

document.querySelector("#search-btn").onclick = () => {
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
    search.focus();
};

document.querySelector("#checkout").onclick = () => {
    if (cart.length === 0) {
        alert("Your bag is empty.");
    } else {
        alert("Demo store: checkout is not connected yet.");
    }
};

document.querySelector("#subscribe-form").onsubmit = event => {
    event.preventDefault();
    alert("Thank you for subscribing!");
    document.querySelector("#email").value = "";
};

updateCart();
updateFavorites();
