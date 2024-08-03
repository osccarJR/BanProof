import Head from 'next/head';
import Image from 'next/image';
import { signIn, signOut, useSession } from "next-auth/react";
import SnowfallEffect from '../components/SnowfallEffect'; // Ajusta la ruta correcta

export default function Home() {
    const { data: session } = useSession();

    return (
        <div className="container">
            <SnowfallEffect /> {/* Usa el componente para la animación */}
            <Head>
                <title>Watones Network</title>
                <meta name="description" content="Watones Network - El servidor más duro" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="navbar">
                <Image src="/logo.png" alt="Watones Logo" width={50} height={50} className="logo" />
                <div className="nav-links">
                    {session ? (
                        <>
                            <p>Bienvenido, {session.user.name}!</p>
                            <button className="management" onClick={() => window.location.href = '/manager'}>Management</button>
                            <button className="logout" onClick={() => signOut()}>Cerrar Sesión</button>
                        </>
                    ) : (
                        <button className="iniciar-sesion" onClick={() => signIn("discord")}>Iniciar Sesión</button>
                    )}
                </div>
            </header>

            <main className="main-content">
                <h1 className="main-title">Watones Network</h1>
                <p className="main-subtitle">El servidor más duro</p>
                <div className="buttons">
                    <button className="discord" onClick={() => window.location.href='https://discord.com'}>Discord</button>
                    <button className="tienda" onClick={() => window.location.href='https://tienda.watones.xyz/'}>Tienda</button>
                </div>
            </main>
        </div>
    );
}