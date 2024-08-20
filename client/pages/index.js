import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Home() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="home-page">
            <Head>
                <title>Watones Network</title>
                <meta name="description" content="Watones Network - El servidor más duro" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="navbar">
                <Link href="/">
                    <Image src="/logo.png" alt="Watones Logo" width={50} height={50} className="logo" />
                </Link>

                <div className="nav-buttons">
                    {session?.role === 'staff' || session?.role === 'admin' ? (
                        <button className="nav-button" onClick={() => window.location.href = '/proof'}>Pruebas</button>
                    ) : null}

                    {session?.role === 'admin' ? (
                        <button className="nav-button" onClick={() => window.location.href = '/manager'}>Management</button>
                    ) : null}
                </div>

                <div className="nav-links">
                    {session ? (
                        <div className="profile-menu">
                            <Image
                                src={session.user.image}
                                alt="Profile Picture"
                                width={40}
                                height={40}
                                className="profile-pic"
                                onClick={handleMenuToggle}
                            />
                            {menuOpen && (
                                <div className="dropdown-menu">
                                    <a href="/profile" className="menu-item" onClick={() => setMenuOpen(false)}>Ver Perfil</a>
                                    <button className="menu-item" onClick={() => signOut({ callbackUrl: '/' })}>Cerrar Sesión</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login" onClick={() => signIn('discord')}>Iniciar Sesión con Discord</button>
                    )}
                </div>
            </header>

            <main className="main-content">
                <Image
                    src="/logo.png"
                    alt="Watones Network Logo"
                    width={250}
                    height={250}
                    className="logo-heartbeat"
                />
                <p className="main-subtitle">Bienvenido a la pagina </p>
                <div className="buttons">
                    <button className="discord" onClick={() => window.location.href = 'https://discord.gg/watones'}>Discord
                    </button>
                    <button className="tienda"
                            onClick={() => window.location.href = 'https://tienda.watones.xyz/'}>Tienda
                    </button>
                </div>
            </main>
        </div>
    );
}