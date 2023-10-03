// Función para mostrar y llenar habilidades
function showAndFillSkills(containerId, fillCount) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    const bubble = container.querySelector('.bubble');
    const fillBar = container.querySelector('.skills-fill');
    const tick = container.querySelector('.tick'); // Nuevo elemento para el símbolo de verificación

    // Llenar gradualmente la barra de habilidades
    fillBar.style.transition = 'width 3s ease';
    fillBar.style.width = fillCount + '%';

    // Mostrar puntaje y símbolo de verificación al final del llenado
    fillBar.addEventListener('transitionend', function () {
        bubble.textContent = `Puntaje: ${fillCount}%`;
        tick.style.display = 'block'; // Mostrar el símbolo de verificación
    });
}

// Función para ocultar la burbuja de habilidades y restablecer la barra de habilidades
function hideAndResetSkills(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bubble = container.querySelector('.bubble');
    const tick = container.querySelector('.tick');

    // Ocultar la burbuja de habilidades y el símbolo de verificación
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(0)';
    tick.style.display = 'none';

    // Restablecer la barra de habilidades a cero
    const fillBar = container.querySelector('.skills-fill');
    fillBar.style.width = '0';
}

// Agregar eventos 'mouseenter' y 'mouseleave' a cada elemento de habilidades técnica
const skillContainers = document.querySelectorAll('.skills-container');

skillContainers.forEach((container) => {
    const bubbleId = container.querySelector('.bubble').id;
    const fillCount = parseFloat(container.dataset.fillCount);

    container.addEventListener('mouseenter', function () {
        showAndFillSkills(bubbleId, fillCount);
    });

    container.addEventListener('mouseleave', function () {
        hideAndResetSkills(bubbleId);
    });
});


// Función para mostrar y ocultar detalles de experiencia
function toggleExperience(targetId) {
    const details = document.getElementById(targetId);
    if (!details) return;

    const isVisible = details.style.display === 'block';
    const buttons = document.querySelectorAll('.experience-button');

    // Oculta todos los detalles de experiencia
    document.querySelectorAll('.experience-details').forEach((el) => {
        el.style.display = 'none';
    });

    // Actualiza el estado de visibilidad de los botones
    buttons.forEach((button) => {
        const buttonTarget = button.getAttribute('data-target');
        if (buttonTarget === targetId) {
            button.textContent = isVisible ? button.getAttribute('data-tooltip') : buttonTarget;
            button.classList.toggle('active', !isVisible);
        } else {
            button.classList.remove('active');
        }
    });

    // Muestra u oculta el detalle seleccionado
    details.style.display = isVisible ? 'none' : 'block';
}

// Agregar eventos 'click' a cada botón de experiencia
const experienceButtons = document.querySelectorAll('.experience-button');

experienceButtons.forEach((button) => {
    const targetId = button.getAttribute('data-target');

    button.addEventListener('click', function () {
        toggleExperience(targetId);
    });
});
