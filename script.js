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