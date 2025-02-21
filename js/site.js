document.getElementById('toggleLightButton').addEventListener('click', function() {
    const lamp = document.querySelector('.lamp');
    const light = document.querySelector('.light');
    const lightIcon = document.getElementById('lightIcon');
    const button = document.getElementById('toggleLightButton');
    const body = document.body;

    // Cambiar la opacidad de la luz
    light.style.opacity = light.style.opacity === '0' ? '0.8' : '0';

    // Cambiar el icono, el fondo del cuerpo y el estado del botón
    if (light.style.opacity === '0') {
        lightIcon.classList.replace('bi-lightbulb', 'bi-lightbulb-off');
        button.classList.remove('light-on');
        body.style.background = '#0f1018'; 
        lamp.style.boxShadow = 'none';
        lamp.style.animation = 'none';
    } else {
        lightIcon.classList.replace('bi-lightbulb-off', 'bi-lightbulb');
        button.classList.add('light-on');
        body.style.background = 'linear-gradient(to bottom, #1a1c28 0%, #12131c 50%, #0b0c11 100%)'; // Fondo cuando la luz está encendida
        lamp.style.boxShadow = '0px 0px 10px rgba(255, 255, 0, 0.8)';
        lamp.style.animation = 'swing 2s infinite ease-in-out';
    }
});

document.getElementById("toggleContactForm").addEventListener("click", function () {
    var contactForm = document.getElementById("contact-form");
    if (contactForm.style.display === "none" || contactForm.style.display === "") {
        contactForm.style.display = "block";
    } else {
        contactForm.style.display = "none";
    }
});