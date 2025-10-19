document.addEventListener('DOMContentLoaded', function() {
    const gameCarousel = document.querySelector('.game-carousel');
    const gameCards = document.querySelectorAll('.game-card');
    // Calcula el ancho de las tarjetas al inicio
    const cardWidth = 100; // Obtiene el ancho de la primera tarjeta
    let currentIndex = 0;

    const prevButton = document.createElement('button');
    prevButton.classList.add('carousel-control', 'prev');
    prevButton.innerHTML = '&#10094;';
    document.querySelector('#carrousel').appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('carousel-control', 'next');
    nextButton.innerHTML = '&#10095;';
    document.querySelector('#carrousel').appendChild(nextButton);

    function updateCarousel() {
        const scrollPosition = currentIndex * cardWidth;
        gameCarousel.scrollLeft = scrollPosition;
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < gameCards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    });

    updateCarousel();
});

document.addEventListener('DOMContentLoaded', function() {
    const games = document.getElementById('games');
    const listgames = document.getElementById('list-games');
    const viewgames = document.getElementById('view-games');
    const homeButton = document.getElementById('home');
    const carrousel = document.getElementById('carrousel');
    const alienContainer = document.querySelector('.alien-container');

    homeButton.addEventListener('click', () => {
        carrousel.style.display = 'none';
        alienContainer.style.display = 'block';
        games.style.display = 'none';
    });

    viewgames.addEventListener('click', () => {
        carrousel.style.display = 'block';
        alienContainer.style.display = 'none';
    });

    listgames.addEventListener('click', () => {
        if (games.style.display === 'block') {
            games.style.display = 'none';
        } else {
            games.style.display = 'block';
        }
    });
});

// Código que debe ir en el proyecto de Arcade (e.g., games-js/index.js o <script> tag)

function applyStylesFromURL() {
    // 1. Obtener la parte de la URL que contiene los parámetros
    const params = new URLSearchParams(window.location.search);
    
    // 2. Obtener el parámetro 'style'
    const styleParam = params.get('style');

    if (styleParam) {
        const decodedStyle = decodeURIComponent(styleParam); 

        // 3. Evaluar el parámetro y aplicar los estilos
        
        // --- LÓGICA DE FONDO (Si mantienes el fondo) ---
        if (decodedStyle.includes('bg:')) {
            // Ejemplo: style=bg:#0d1117
            const bgMatch = decodedStyle.match(/bg:([^;]+)/);
            if (bgMatch && document.body) {
                            console.log(bgMatch);

                document.body.style.backgroundColor = bgMatch[1];
                document.body.style.backgroundImage = "none";
                document.body.style.margin = '0px'; 
                
                document.querySelector('.footer-content').style.display = 'none';
            }
        }
        
        // --- LÓGICA DE OVERFLOW (Nueva Lógica) ---
        if (decodedStyle.includes('overflow:hidden')) {
            // Aplicar overflow: hidden al HTML
            document.documentElement.style.overflow = 'hidden'; 
            
            // Aplicar overflow: hidden al BODY
            if (document.body) {
                document.body.style.overflow = 'hidden'; 
                document.body.style.margin = '0px'; 
            }
            
            console.log('Overflow: hidden aplicado al <html> y al <body>.');
        }

        console.log(`Estilos aplicados desde URL: ${decodedStyle}`);
    }
}

// Ejecutar la función tan pronto como el DOM del proyecto de Arcade esté listo
document.addEventListener('DOMContentLoaded', applyStylesFromURL);