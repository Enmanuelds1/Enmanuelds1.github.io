document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos los elementos del carrusel
    const trabajos = document.querySelectorAll('.trabajo');
    const galeriaContainer = document.querySelector('.galeria-container');
    const totalTrabajos = trabajos.length;
    let currentIndex = 0;
    
    // Si no hay trabajos, salimos
    if (totalTrabajos === 0) return;
    
    // Creamos los botones de navegación
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&lt;';
    prevButton.className = 'carousel-button prev';
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&gt;';
    nextButton.className = 'carousel-button next';
    
    // Creamos un contenedor para el carrusel
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'carousel-wrapper';
    
    // Movemos los trabajos al nuevo contenedor
    trabajos.forEach(trabajo => {
        carouselWrapper.appendChild(trabajo);
    });
    
    // Reemplazamos el contenedor original con nuestro carrusel
    galeriaContainer.innerHTML = '';
    galeriaContainer.appendChild(prevButton);
    galeriaContainer.appendChild(carouselWrapper);
    galeriaContainer.appendChild(nextButton);
    
    // Mostramos solo el trabajo actual
    function showCurrentTrabajo() {
        // Ocultamos todos los trabajos
        trabajos.forEach(trabajo => {
            trabajo.style.display = 'none';
        });
        
        // Mostramos solo el trabajo actual
        trabajos[currentIndex].style.display = 'block';
    }
    
    // Event listeners para los botones
    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + totalTrabajos) % totalTrabajos;
        showCurrentTrabajo();
    });
    
    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalTrabajos;
        showCurrentTrabajo();
    });
    
    // Mostramos el primer trabajo al cargar
    showCurrentTrabajo();
    
    // Añadimos estilos para los botones (podrías mover esto a CSS)
    const style = document.createElement('style');
    style.textContent = `
        .carousel-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
        }
        
        .trabajo {
            width: 100%;
            margin: 0 auto;
            transition: opacity 0.5s ease;
        }
        
        .carousel-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            font-size: 2rem;
            padding: 0.5rem 1rem;
            cursor: pointer;
            border-radius: 50%;
            z-index: 10;
            transition: background-color 0.3s ease;
        }
        
        .carousel-button:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
        
        .prev {
            left: 10px;
        }
        
        .next {
            right: 10px;
        }
        
        .galeria-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 2rem 0;
        }
    `;
    document.head.appendChild(style);
});
document.addEventListener('DOMContentLoaded', function() {
    // Productos para el modal
    const productos = [
        "Cuadros originales",
        "Cuadros de madera con luces",
        "Cuadros de cartulina gruesa",
        "Portafotos de acrílico",
        "Llaveros personalizados",
        "Acordeón de recuerdos con fotos",
        "Tendedera de fotos sencillas",
        "Tendederas de fotos con luces",
        "Marco de madera con luces y tendedera",
        "Cajas personalizadas",
        "Bolsas de regalos",
        "Sobres personalizados",
        "Tarjetas de presentación",
        "Invitaciones para eventos festivos",
        "Impresiones en papel fotográfico",
        "Fotos polaroid",
        "Impresiones en papel normal (color/B&N)",
        "Escaneo de documentos",
        "Fotocopias",
        "Impresiones en cartulina"
    ];

    // Elementos del DOM
    const modal = document.getElementById('catalogoModal');
    const verCatalogoBtn = document.getElementById('verCatalogoBtn');
    const closeModal = document.querySelector('.close-modal');
    const modalProductos = document.querySelector('.modal-productos');

    // Función para abrir el modal
    verCatalogoBtn.addEventListener('click', function() {
        // Limpiar y cargar productos en el modal
        modalProductos.innerHTML = '';
        productos.forEach(producto => {
            const productoItem = document.createElement('div');
            productoItem.className = 'producto-item';
            productoItem.innerHTML = `<p>${producto}</p>`;
            modalProductos.appendChild(productoItem);
        });
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    });

    // Función para cerrar el modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Efecto de hover para las categorías (puedes personalizar más)
    const categorias = document.querySelectorAll('.categoria');
    categorias.forEach(categoria => {
        categoria.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
        });
        
        categoria.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Efecto hover para las tarjetas de contacto
    const infoCards = document.querySelectorAll('.info-card, .redes-card');
    
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
        });
    });
    
   
    
    // Efecto de carga para los elementos
    const contactoItems = document.querySelectorAll('.info-item, .red-social');
    contactoItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
});