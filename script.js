// Theme Management
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';

body.className = `${savedTheme}-mode`;

themeToggle.addEventListener('click', () => {
    const newTheme = body.className.includes('light') ? 'dark' : 'light';
    body.className = `${newTheme}-mode`;
    localStorage.setItem('theme', newTheme);
});

// Product Management
class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.form = document.getElementById('productForm');
        this.productTable = document.getElementById('productTable').querySelector('tbody');
        this.searchInput = document.getElementById('searchInput');
        this.sortBy = document.getElementById('sortBy');
        this.sortOrder = document.getElementById('sortOrder');
        this.isAscending = true;
        this.setupEventListeners();
        this.renderProducts();
        this.updateCategoryChart();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.searchInput.addEventListener('input', () => this.renderProducts());
        this.sortBy.addEventListener('change', () => this.renderProducts());
        this.sortOrder.addEventListener('click', () => {
            this.isAscending = !this.isAscending;
            this.sortOrder.querySelector('i').className = 
                `fas fa-sort-amount-${this.isAscending ? 'down' : 'up'}`;
            this.renderProducts();
        });

        // Image Preview
        const imageInput = document.getElementById('productImage');
        const imagePreview = document.getElementById('imagePreview');
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imagePreview.innerHTML = '';
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const productId = document.getElementById('productId').value;
        
        const imageInput = document.getElementById('productImage');
        const imageFile = imageInput.files[0];
        let imageData = null;
        
        const processForm = () => {
            const product = {
                id: productId || Date.now().toString(),
                name: formData.get('productName'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                quantity: parseInt(formData.get('quantity')),
                description: formData.get('description'),
                image: imageData
            };

            if (productId) {
                const index = this.products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    if (!imageData) {
                        product.image = this.products[index].image;
                    }
                    this.products[index] = product;
                }
            } else {
                this.products.push(product);
            }

            this.saveProducts();
            this.form.reset();
            document.getElementById('productId').value = '';
            document.getElementById('imagePreview').innerHTML = '';
            this.form.querySelector('button').textContent = 'Add Product';
            
            // Add fade-in animation class
            this.productTable.classList.add('fade-in');
            setTimeout(() => this.productTable.classList.remove('fade-in'), 500);
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageData = e.target.result;
                processForm();
            };
            reader.readAsDataURL(imageFile);
        } else {
            processForm();
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('category').value = product.category;
            document.getElementById('price').value = product.price;
            document.getElementById('quantity').value = product.quantity;
            document.getElementById('description').value = product.description;
            
            const imagePreview = document.getElementById('imagePreview');
            if (product.image) {
                const img = document.createElement('img');
                img.src = product.image;
                imagePreview.innerHTML = '';
                imagePreview.appendChild(img);
            }

            this.form.querySelector('button').textContent = 'Update Product';
            this.form.scrollIntoView({ behavior: 'smooth' });
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
        }
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
        this.renderProducts();
        this.updateCategoryChart();
    }

    renderProducts() {
        let filteredProducts = [...this.products];
        
        // Search Filter
        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Sort
        const sortField = this.sortBy.value;
        if (sortField) {
            filteredProducts.sort((a, b) => {
                let comparison = 0;
                if (sortField === 'price' || sortField === 'quantity') {
                    comparison = a[sortField] - b[sortField];
                } else {
                    comparison = a[sortField].localeCompare(b[sortField]);
                }
                return this.isAscending ? comparison : -comparison;
            });
        }

        this.productTable.innerHTML = filteredProducts.map(product => `
            <tr>
                <td>
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` :
                        '<div style="width: 50px; height: 50px; background: #eee; border-radius: 4px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image"></i></div>'
                    }
                </td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>
                    <button onclick="productManager.editProduct('${product.id}')" class="btn-sort">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="productManager.deleteProduct('${product.id}')" class="btn-sort">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateCategoryChart() {
        const categoryCount = this.products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (window.categoryChart) {
            window.categoryChart.destroy();
        }

        window.categoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryCount),
                datasets: [{
                    data: Object.values(categoryCount),
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#ec4899',
                        '#14b8a6',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: body.className.includes('light') ? '#1e293b' : '#e2e8f0'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Product Categories',
                        color: body.className.includes('light') ? '#1e293b' : '#e2e8f0'
                    }
                }
            }
        });
    }
}

// Initialize Product Manager
const productManager = new ProductManager();

// Update chart when theme changes
themeToggle.addEventListener('click', () => {
    productManager.updateCategoryChart();
}); 