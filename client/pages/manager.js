// pages/manager.js

import { getSession } from "next-auth/react";

export default function Manager({ session }) {
    if (!session) {
        return <p>Acceso no autorizado. Por favor, inicia sesión.</p>;
    }

    return (
        <div>
            <h1>Página de Gestión</h1>
            <p>Bienvenido {session.user.name}!</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}