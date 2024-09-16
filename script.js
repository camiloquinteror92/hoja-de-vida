// Función para mostrar y llenar habilidades
function showAndFillSkills(containerId, fillCount) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    const bubble = container.querySelector('.bubble');
    const fillBar = container.querySelector('.skills-fill');
    const tick = container.querySelector('.tick');
    const resetButton = container.querySelector('.reset-button');

    // Animación suave para llenar la barra de habilidades
    fillBar.style.width = '0'; // Restablecer la barra a cero
    fillBar.style.transition = 'width 2s ease';
    fillBar.style.width = fillCount + '%';

    // Mostrar puntaje y símbolo de verificación al final del llenado
    setTimeout(function () {
        bubble.textContent = `Puntaje: ${fillCount}%`;
        tick.style.display = 'block';
        if (resetButton) {
            resetButton.style.display = 'block';
        }
    }, 2000); // Retraso para coincidir con la duración de la transición
}

// Función para ocultar la burbuja de habilidades y restablecer la barra de habilidades
function hideAndResetSkills(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bubble = container.querySelector('.bubble');
    const tick = container.querySelector('.tick');
    const resetButton = container.querySelector('.reset-button');

    // Ocultar la burbuja de habilidades, el símbolo de verificación y el botón de restablecer
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(0)';
    tick.style.display = 'none';
    if (resetButton) {
        resetButton.style.display = 'none';
    }

    // Restablecer la barra de habilidades a cero
    const fillBar = container.querySelector('.skills-fill');
    fillBar.style.width = '0';
}

// Función para manejar eventos táctiles en dispositivos móviles
function handleTouchEvents(containerId, fillCount) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.addEventListener('touchstart', function () {
        showAndFillSkills(containerId, fillCount);
    });

    container.addEventListener('touchend', function () {
        hideAndResetSkills(containerId);
    });
}

// Agregar eventos táctiles a cada elemento de habilidades técnica
const skillContainers = document.querySelectorAll('.skills-container');

skillContainers.forEach((container) => {
    const bubbleId = container.querySelector('.bubble').id;
    const fillCount = parseFloat(container.dataset.fillCount);

    // Agregar eventos táctiles
    handleTouchEvents(bubbleId, fillCount);

    // Mantener los eventos de mouse para escritorio
    container.addEventListener('mouseenter', function () {
        showAndFillSkills(bubbleId, fillCount);
    });

    container.addEventListener('mouseleave', function () {
        hideAndResetSkills(bubbleId);
    });
});

// Función para cambiar el tema entre claro y oscuro
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
}

// Agregar evento al botón de cambio de tema
const themeToggleButton = document.getElementById('theme-toggle-button');

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
}

// Función para cambiar el tema a claro
function setLightTheme() {
    document.body.classList.remove('dark-theme');
}

// Función para cambiar el tema a oscuro
function setDarkTheme() {
    document.body.classList.add('dark-theme');
}

// Agregar evento al botón de tema claro
const lightThemeButton = document.getElementById('light-theme-button');
if (lightThemeButton) {
    lightThemeButton.addEventListener('click', setLightTheme);
}

// Agregar evento al botón de tema oscuro
const darkThemeButton = document.getElementById('dark-theme-button');
if (darkThemeButton) {
    darkThemeButton.addEventListener('click', setDarkTheme);
}



// Function to handle experience button clicks
function handleExperienceButtonClick(event) {
    // Hide all experience details
    const allExperienceDetails = document.querySelectorAll('.experience-details');
    allExperienceDetails.forEach(detail => {
        detail.style.display = 'none';
    });

    // Show the related experience details based on the button's data-target attribute
    const targetId = event.currentTarget.getAttribute('data-target');
    const targetExperience = document.getElementById(targetId);
    if (targetExperience) {
        targetExperience.style.display = 'block';
    }
}

// Add click event listeners to all experience buttons
const experienceButtons = document.querySelectorAll('.experience-button');
experienceButtons.forEach(button => {
    button.addEventListener('click', handleExperienceButtonClick);
});

// Añade esto al principio de tu archivo script.js

document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loading-overlay');
    const content = document.querySelector('.container');

    // Ocultar el loader y mostrar el contenido después de un breve retraso
    setTimeout(function() {
        if (loader) {
            loader.style.display = 'none';
        }
        if (content) {
            content.style.opacity = '1';
        }
    }, 500);  // Ajusta este valor según sea necesario

    // Mecanismo de respaldo: ocultar el loader después de 5 segundos en cualquier caso
    setTimeout(function() {
        if (loader) {
            loader.style.display = 'none';
        }
        if (content) {
            content.style.opacity = '1';
        }
    }, 5000);
});