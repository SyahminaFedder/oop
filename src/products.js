// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


// src/products.js

// Function to display product details on the products.html page
async function displayProductDetails() {
    const productId = localStorage.getItem('selectedProductId');
    if (!productId) {
        document.getElementById('product-details-container').innerHTML = '<p>No product selected.</p>';
        return;
    }

    try {
        const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products/${productId}.json`);
        const product = await response.json();

        const container = document.getElementById('product-details-container');;
        container.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating || 'N/A'}</p>
            <p>Type: ${product.product_type}</p>
            <p>Description: ${product.description}</p>
        `;
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    displayProductDetails();

    // Add event listener for the back button
    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'index.html'; // Navigate back to the homepage
    });
});
