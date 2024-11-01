// src/wishlist.js

// Function to load the wishlist from localStorage
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    displayWishlist(wishlist);
}

// Function to display the wishlist items
function displayWishlist(wishlist) {
    const container = document.getElementById('wishlist-container');
    container.innerHTML = ''; // Clear previous content

    if (wishlist.length === 0) {
        container.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }

    wishlist.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('wishlist-item');

        productDiv.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand}</p>
            <p>Price: $${product.price}</p>
            <button onclick="removeFromWishlist(${index})">Remove</button>
        `;

        container.appendChild(productDiv);
    });
}

// Function to add a product to the wishlist
function addToWishlist(product) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const alreadyInWishlist = wishlist.some((item) => item.id === product.id);

    if (!alreadyInWishlist) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Product added to wishlist!');
    } else {
        alert('Product is already in the wishlist.');
    }
}

// Function to remove a product from the wishlist
function removeFromWishlist(index) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Update localStorage
    loadWishlist(); // Refresh the displayed wishlist
}

// Load the wishlist when the page is loaded
document.addEventListener('DOMContentLoaded', loadWishlist);
