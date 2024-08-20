import { getSession } from "next-auth/react";

export default function Manager({ session }) {
    if (!session || !session.roles.includes('management') && !session.roles.includes('staff')) {
        return <p>Acceso no autorizado. Por favor, inicia sesión con una cuenta de staff.</p>;
    }

    return (
        <div>
            <h1>Página de Pruebas</h1>
            <p>Bienvenido {session.user.name}!</p>a
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