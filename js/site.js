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