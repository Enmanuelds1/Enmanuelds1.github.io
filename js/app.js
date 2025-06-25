document.addEventListener('DOMContentLoaded', function() {
    const scheduleButton = document.getElementById('schedule-appointment');
    const appointmentModal = document.getElementById('appointment-modal');
    const closeModal = document.querySelector('.close');
    const appointmentForm = document.getElementById('appointment-form');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // Cargar productos
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            displayProducts(data.featured, 'featured-products');
        })
        .catch(error => console.error('Error loading products:', error));

    // Mostrar modal de cita
    scheduleButton.addEventListener('click', () => {
        appointmentModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', () => {
        appointmentModal.style.display = 'none';
        document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === appointmentModal) {
            appointmentModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Procesar cita
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;

        // Crear mensaje para WhatsApp
        let message = `*Nueva Cita Agendada*%0A%0A`;
        message += `*Cliente:* ${customerName}%0A`;
        message += `*Teléfono:* ${customerPhone}%0A`;

        // Abrir WhatsApp con el mensaje
        const whatsappUrl = `https://wa.me/+5354325288?text=${message}`;
        window.open(whatsappUrl, '_blank');

        // Mostrar confirmación
        showNotification('Cita agendada. Por favor completa la información en WhatsApp.');

        // Limpiar formulario
        appointmentForm.reset();
        appointmentModal.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Mostrar notificaciones
    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.style.display = 'flex';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Mostrar productos
    function displayProducts(products, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$ ${product.price.toFixed(2)}</div>
            </div>
        `).join('');
    }
});
