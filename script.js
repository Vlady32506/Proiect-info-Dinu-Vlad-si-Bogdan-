"use strict";

/* ELEMENTE GENERALE */

const header = document.getElementById("header");
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const currentYear = document.getElementById("currentYear");

/* ANUL CURENT */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* HEADER LA SCROLL */

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

/* MENIU TELEFON */

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    const menuLinks = navLinks.querySelectorAll("a");

    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}

/* FILTRAREA PRODUSELOR */

const filterButtons = document.querySelectorAll(".filter-button");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        productCards.forEach((card) => {
            const category = card.dataset.category;

            const shouldDisplay =
                selectedFilter === "all" ||
                selectedFilter === category;

            card.classList.toggle("hidden", !shouldDisplay);
        });
    });
});

/* COȘ DE CUMPĂRĂTURI */

const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const notification = document.getElementById("notification");
const quickAddButtons = document.querySelectorAll(".quick-add");

let cart = [];

function openCart() {
    if (!cartDrawer || !drawerOverlay) {
        return;
    }

    cartDrawer.classList.add("open");
    drawerOverlay.classList.add("open");
    document.body.classList.add("no-scroll");
}

function closeCartDrawer() {
    if (!cartDrawer || !drawerOverlay) {
        return;
    }

    cartDrawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
}

if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (closeCart) {
    closeCart.addEventListener("click", closeCartDrawer);
}

if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeCartDrawer);
}

quickAddButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const productName = button.dataset.product;
        const productPrice = Number(button.dataset.price);

        addProductToCart(productName, productPrice);
    });
});

function addProductToCart(productName, productPrice) {
    const existingProduct = cart.find(
        (item) => item.name === productName
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${productName} a fost adăugat în coș.`);
}

function removeProduct(productName) {
    cart = cart.filter(
        (item) => item.name !== productName
    );

    updateCart();
}

function updateCart() {
    if (
        !cartCount ||
        !cartItemsContainer ||
        !cartTotal
    ) {
        return;
    }

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = `€${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <p class="empty-cart-message">
                Coșul este gol.
            </p>
        `;

        return;
    }

    cartItemsContainer.innerHTML = cart
        .map((item) => {
            return `
                <div class="cart-item">
                    <div>
                        <h4>${escapeHTML(item.name)}</h4>

                        <p>
                            ${item.quantity} ×
                            €${item.price.toFixed(2)}
                        </p>
                    </div>

                    <button
                        class="remove-item"
                        data-remove="${escapeHTML(item.name)}"
                        aria-label="Șterge produsul"
                    >
                        ×
                    </button>
                </div>
            `;
        })
        .join("");

    const removeButtons =
        document.querySelectorAll(".remove-item");

    removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            removeProduct(button.dataset.remove);
        });
    });
}

let notificationTimeout;

function showNotification(message) {
    if (!notification) {
        return;
    }

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

/* FORMULAR REVIEW */

const reviewForm = document.getElementById("reviewForm");
const reviewsGrid = document.getElementById("reviewsGrid");
const reviewCount = document.getElementById("reviewCount");
const reviewFormMessage =
    document.getElementById("reviewFormMessage");

let totalReviews = 3;

if (reviewForm && reviewsGrid) {
    reviewForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document
            .getElementById("reviewName")
            .value
            .trim();

        const product = document
            .getElementById("reviewProduct")
            .value;

        const rating = Number(
            document.getElementById("reviewRating").value
        );

        const message = document
            .getElementById("reviewMessage")
            .value
            .trim();

        if (!name || !product || !message) {
            reviewFormMessage.textContent =
                "Completează toate câmpurile.";

            return;
        }

        const initials = createInitials(name);
        const stars = "★".repeat(rating) +
            "☆".repeat(5 - rating);

        const reviewCard = document.createElement("article");

        reviewCard.className =
            "review-card reveal visible";

        reviewCard.innerHTML = `
            <div class="review-card-header">
                <div class="review-avatar">
                    ${escapeHTML(initials)}
                </div>

                <div>
                    <h3>${escapeHTML(name)}</h3>
                    <span>${escapeHTML(product)}</span>
                </div>
            </div>

            <div class="review-stars">
                ${stars}
            </div>

            <p>${escapeHTML(message)}</p>

            <small>Review nou</small>
        `;

        reviewsGrid.prepend(reviewCard);

        totalReviews += 1;

        if (reviewCount) {
            reviewCount.textContent = totalReviews;
        }

        reviewFormMessage.textContent =
            "Review-ul tău a fost publicat.";

        reviewForm.reset();

        window.scrollTo({
            top: reviewsGrid.offsetTop - 120,
            behavior: "smooth"
        });
    });
}

function createInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
}

/* ANIMAȚII LA SCROLL */

const revealElements =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

/* ÎNCHIDERE CU ESCAPE */

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    closeCartDrawer();

    if (navLinks) {
        navLinks.classList.remove("open");
    }
});

/* PROTECȚIE HTML */

function escapeHTML(value) {
    const characterMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return String(value).replace(
        /[&<>"']/g,
        (character) => characterMap[character]
    );
}