document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutBtn = document.getElementById('checkout-btn');
    const orderModal = document.getElementById('order-modal');
    const closeModal = document.querySelector('.close');
    const orderForm = document.getElementById('order-form');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    const deliveryFields = document.getElementById('delivery-fields');
    const deliveryNotice = document.getElementById('delivery-notice');
    
    // Configurar opciones de entrega
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'delivery') {
                deliveryFields.style.display = 'block';
                deliveryNotice.style.display = 'block';
            } else {
                deliveryFields.style.display = 'none';
                deliveryNotice.style.display = 'none';
            }
            updateCartTotal();
        });
    });
    
    // Cargar productos
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            displayProducts(data.featured, 'featured-products');
            displayProducts(data.comidaCriolla, 'comida-criolla-products');
            displayProducts(data.italiana, 'italiana-products');
            displayProducts(data.bebidas, 'bebidas-products');
            displayProducts(data.postres, 'postres-products');
        })
        .catch(error => console.error('Error loading products:', error));
    
    // Navegación entre secciones
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Actualizar clase activa en navegación
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active-section');
                }
            });
            
            // Scroll suave al inicio de la sección
            document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Mostrar productos
    function displayProducts(products, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="img/platos/${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">S/ ${product.price.toFixed(2)}</div>
                    <button class="add-to-cart">
                        <i class="fas fa-cart-plus"></i> Comprar
                    </button>
                </div>
            </div>
        `).join('');
        
        // Event listeners para botones de añadir al carrito
        document.querySelectorAll(`#${containerId} .add-to-cart`).forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    // Funcionalidad del carrito
    function addToCart(productId) {
        fetch('data/products.json')
            .then(response => response.json())
            .then(data => {
                // Buscar el producto en todas las categorías
                const allProducts = [...data.comidaCriolla, ...data.italiana, ...data.bebidas, ...data.postres, ...data.featured];
                const product = allProducts.find(p => p.id === productId);
                
                if (product) {
                    const existingItem = cart.find(item => item.id === product.id);
                    
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({
                            ...product,
                            quantity: 1
                        });
                    }
                    
                    updateCart();
                    showNotification(`${product.name} añadido al carrito`);
                }
            })
            .catch(error => console.error('Error adding to cart:', error));
    }
    
    function updateCart() {
        // Actualizar contador del carrito
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Actualizar lista de items en el carrito
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
            checkoutBtn.style.display = 'none';
        } else {
            checkoutBtn.style.display = 'block';
            
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="img/platos/${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">S/ ${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <button class="decrease-quantity"><i class="fas fa-minus"></i></button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity"><i class="fas fa-plus"></i></button>
                            <button class="cart-item-remove"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
                
                // Event listeners para acciones del carrito
                cartItemElement.querySelector('.decrease-quantity').addEventListener('click', () => {
                    updateQuantity(item.id, -1);
                });
                
                cartItemElement.querySelector('.increase-quantity').addEventListener('click', () => {
                    updateQuantity(item.id, 1);
                });
                
                cartItemElement.querySelector('.cart-item-remove').addEventListener('click', () => {
                    removeFromCart(item.id);
                });
            });
        }
        
        updateCartTotal();
    }
    
    function updateCartTotal() {
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        document.getElementById('total-amount').textContent = total.toFixed(2);
    }
    
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            updateCart();
        }
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        showNotification('Producto eliminado del carrito');
    }
    
    // Mostrar/ocultar carrito
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Mostrar modal de pedido
    checkoutBtn.addEventListener('click', () => {
        orderModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        orderModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Procesar pedido y enviar por WhatsApp
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const customerName = document.getElementById('customer-name').value;
        const customerAddress = document.getElementById('customer-address').value;
        const customerReference = document.getElementById('customer-reference').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const orderNotes = document.getElementById('order-notes').value;
        const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
        
        if (cart.length === 0) {
            showNotification('El carrito está vacío', true);
            return;
        }
        
        // Validar campos requeridos para delivery
        if (deliveryType === 'delivery' && (!customerAddress || !customerReference)) {
            showNotification('Por favor complete la dirección y referencia para envío', true);
            return;
        }
        
        // Crear mensaje para WhatsApp
        let message = `*NUEVO PEDIDO - SABORES DEL MUNDO*%0A%0A`;
        message += `*Cliente:* ${customerName}%0A`;
        message += `*Teléfono:* ${customerPhone}%0A`;
        message += `*Tipo de entrega:* ${deliveryType === 'delivery' ? 'Envío a domicilio' : 'Recoger en local'}%0A`;
        
        if (deliveryType === 'delivery') {
            message += `*Dirección:* ${customerAddress}%0A`;
            message += `*Referencia:* ${customerReference}%0A`;
        }
        
        message += `%0A*Detalle del Pedido:*%0A`;
        cart.forEach(item => {
            message += `- ${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}%0A`;
        });
        
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `%0A*Total:* S/ ${total.toFixed(2)}%0A%0A`;
        
        if (orderNotes) {
            message += `*Notas adicionales:*%0A${orderNotes}%0A%0A`;
        }
        
        // Abrir WhatsApp con el mensaje
        const whatsappUrl = `https://wa.me/+5352175957?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        // Mostrar confirmación
        showNotification('Pedido generado. Por favor complete la información en WhatsApp.');
        
        // Limpiar carrito y formulario
        cart = [];
        updateCart();
        orderForm.reset();
        orderModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Mostrar notificaciones
    function showNotification(message, isError = false) {
        notificationMessage.textContent = message;
        notification.className = isError ? 'notification error' : 'notification';
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.style.display = 'none';
                notification.classList.remove('fade-out');
            }, 300);
        }, 3000);
    }
    
    // Inicializar carrito
    updateCart();
    
    // Configurar campos de dirección inicialmente ocultos
    deliveryFields.style.display = 'none';
});
