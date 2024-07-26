// Generar copos de nieve
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // Caída entre 5 a 10 segundos
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = `${Math.random() * 10 + 10}px`; // Tamaño entre 10px y 20px
    snowflake.style.setProperty('--x-pos', Math.random() - 0.5);

    snowflake.innerHTML = '❄'; // Puedes cambiar el símbolo de nieve si lo deseas

    document.body.appendChild(snowflake);

    // Eliminar el copo de nieve después de que caiga
    setTimeout(() => {
        snowflake.remove();
    }, 10000);
}

// Crear copos de nieve continuamente
setInterval(createSnowflake, 200);
