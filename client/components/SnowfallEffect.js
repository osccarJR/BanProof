import { useEffect } from "react";

function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = "🚀"; // Puedes cambiar esto a cualquier símbolo o carácter
    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.animationDuration = Math.random() * 5 + 5 + "s"; // Duración aleatoria entre 5s y 10s
    snowflake.style.fontSize = Math.random() * 20 + 10 + "px"; // Tamaño aleatorio entre 10px y 30px
    snowflake.style.setProperty("--x-pos", Math.random() - 0.5);

    document.body.appendChild(snowflake);

    // Elimina el copo de nieve del DOM una vez que termina la animación
    snowflake.addEventListener("animationend", () => {
        snowflake.remove();
    });
}

export default function SnowfallEffect() {
    useEffect(() => {
        const interval = setInterval(createSnowflake, 200); // Crea un copo de nieve cada 200ms

        // Limpia el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []);

    return null; // Este componente solo crea copos de nieve, no renderiza nada
}