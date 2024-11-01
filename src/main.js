// src/renderer.js

// Function to fetch makeup products based on brand and price range
async function fetchMakeupProducts(brand, minPrice, maxPrice) {
    try {
        const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`);
        const products = await response.json();

        // Filter products based on price range
        const filteredProducts = products.filter(product => {
            const price = parseFloat(product.price);
            return price >= minPrice && price <= maxPrice;
        });

        displayProducts(filteredProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to display products on the HTML page
function displayProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) {
        console.error("Product container element not found");
        return;
    }
    
    container.innerHTML = ''; // Clear previous content

    if (products.length === 0) {
        container.innerHTML = '<p>No products found matching your criteria.</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Brand: ${product.brand}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating || 'N/A'}</p>
            <p>Type: ${product.product_type}</p>
            <button onclick="viewProductDetails('${product.id}')">View Details</button>
        `;

        container.appendChild(productDiv);
    });
}

// Function to fetch and display random products from various brands when the application first loads
async function fetchInitialProducts() {
    try {
        const brands = ['maybelline', 'revlon', 'nyx', 'glossier'];
        const allProducts = [];

        // Fetch products from all specified brands
        for (const brand of brands) {
            const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`);
            const products = await response.json();
            allProducts.push(...products);
        }

        // Randomly shuffle the products to mix them
        const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());

        // Display a subset of the mixed products (e.g., the first 10)
        displayProducts(shuffledProducts.slice(0, 10));
    } catch (error) {
        console.error("Error fetching initial products:", error);
    }
}

// Function to view product details
function viewProductDetails(productId) {
    localStorage.setItem('selectedProductId', productId); // Store the product ID in localStorage
    window.location.href = 'products.html'; // Navigate to the products.html page
}

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

        const container = document.getElementById('product-details-container');
        container.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Brand: ${product.brand}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating || 'N/A'}</p>
            <p>Type: ${product.product_type}</p>
            <p>${product.description}</p>
            <a href="${product.product_link}" target="_blank">View Product</a>
            <a href="${product.website_link}" target="_blank">Visit Website</a>
        `;
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}


// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Fetch initial products from multiple brands
    fetchInitialProducts();

    document.getElementById('searchButton').addEventListener('click', () => {
        const brand = document.getElementById('brand').value;
        const minPrice = parseFloat(document.getElementById('minPrice').value);
        const maxPrice = parseFloat(document.getElementById('maxPrice').value);
        fetchMakeupProducts(brand, minPrice, maxPrice);
    });

    // Check if we're on the products.html page and display product details
    if (window.location.pathname.includes('products.html')) {
        displayProductDetails();
    }
});

// Function to add product to wishlist
function addToWishlist(product) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const alreadyInWishlist = wishlist.some((item) => item.id === product.id);
  
    if (!alreadyInWishlist) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Product added to Favourite!');
    } else {
      alert('Product is already in the Favourite.');
    }
  }
  
  // Add a button for adding to wishlist in the displayProducts function
  function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
  
    products.forEach((product) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
  
      productDiv.innerHTML = `
        <img src="${product.image_link}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Brand: ${product.brand}</p>
        <p>Price: $${product.price}</p>
        <button onclick="viewProductDetails('${product.id}')">View Details</button>
        <button onclick='addToWishlist(${JSON.stringify(product)})'>Add to Favourite</button>
      `;
  
      container.appendChild(productDiv);
    });
  }
  
  let customProducts = []; // Array to store custom products
  let editIndex = null; // Track the index of the product being edited
  
  // Function to load products from Local Storage when the DOM is ready
  document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
  
  // Function to create a new custom product
  function createCustomProduct() {
      const type = document.getElementById('customProductType').value;
      const brand = document.getElementById('customProductBrand').value;
  
      if (!type || !brand) {
          alert("Please fill in both the product type and brand.");
          return;
      }
  
      const newProduct = { type, brand };
      customProducts.push(newProduct);
      saveToLocalStorage();
      displayCustomProductList();
      clearCustomProductInputs();
  }
  
  // Function to display the custom product list
  function displayCustomProductList() {
      const listContainer = document.getElementById('customProductList');
      listContainer.innerHTML = ''; // Clear previous list
  
      customProducts.forEach((product, index) => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('custom-product');
          productDiv.innerHTML = `
              <p>${product.type} - ${product.brand}
              <button onclick="editProduct(${index})">Edit</button>
              <button onclick="deleteProduct(${index})">Delete</button></p>
          `;
          listContainer.appendChild(productDiv);
      });
  }
  
  // Function to clear the input fields
  function clearCustomProductInputs() {
      document.getElementById('customProductType').value = '';
      document.getElementById('customProductBrand').value = '';
  }
  
  // Function to edit a product
  function editProduct(index) {
      editIndex = index;
      const product = customProducts[index];
      document.getElementById('editProductName').value = `${product.type} - ${product.brand}`;
      document.getElementById('edit-product-section').style.display = 'block';
  }
  
  // Function to update a product
  function updateProduct() {
      const newName = document.getElementById('editProductName').value;
      if (!newName) {
          alert("Please enter a new name.");
          return;
      }
  
      const [type, brand] = newName.split(" - ");
      if (!type || !brand) {
          alert("Please enter in the format 'Type - Brand'.");
          return;
      }
  
      customProducts[editIndex] = { type, brand };
      saveToLocalStorage();
      displayCustomProductList();
      cancelUpdate();
  }
  
  // Function to cancel the update
  function cancelUpdate() {
      document.getElementById('edit-product-section').style.display = 'none';
      document.getElementById('editProductName').value = '';
      editIndex = null;
  }
  
  // Function to delete a product from the list
  function deleteProduct(index) {
      customProducts.splice(index, 1);
      saveToLocalStorage();
      displayCustomProductList();
  }
  
  // Function to save products to Local Storage
  function saveToLocalStorage() {
      localStorage.setItem('customProducts', JSON.stringify(customProducts));
  }
  
  // Function to load products from Local Storage
  function loadFromLocalStorage() {
      const storedProducts = localStorage.getItem('customProducts');
      if (storedProducts) {
          customProducts = JSON.parse(storedProducts);
          displayCustomProductList();
      }
  }
  
  // Function to download products as a .txt file
  function downloadProducts() {
      const data = customProducts.map(product => `${product.type} - ${product.brand}`).join('\n');
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  }
  
// Existing functions...

// Function to update a product
function updateProduct() {
    const newName = document.getElementById('editProductName').value;
    if (!newName) {
        alert("Please enter a new name.");
        return;
    }

    const [type, brand] = newName.split(" - ");
    if (!type || !brand) {
        alert("Please enter in the format 'Type - Brand'.");
        return;
    }

    customProducts[editIndex] = { type, brand };
    saveToLocalStorage(); // Save the updated products to Local Storage
    displayCustomProductList(); // Refresh the displayed list
    downloadProducts(); // Trigger download of updated product list
    cancelUpdate(); // Hide the edit section
}

// Function to delete a product from the list
function deleteProduct(index) {
    customProducts.splice(index, 1);
    saveToLocalStorage(); // Save the updated products to Local Storage
    displayCustomProductList(); // Refresh the displayed list
    downloadProducts(); // Trigger download of updated product list
}

// Function to download products as a .txt file
function downloadProducts() {
    const data = customProducts.map(product => `${product.type} - ${product.brand}`).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

  