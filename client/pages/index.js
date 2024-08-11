import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
                <div className="nav-links">
                    <button className="login" onClick={() => window.location.href = '/login'}>Iniciar Sesión</button>
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
                <p className="main-subtitle">Bienvendio ala pagina </p>
                <p className="main-subtitle">de tools para el staff </p>
                <div className="buttons">
                    <button className="discord" onClick={() => window.location.href = 'https://discord.com'}>Discord
                    </button>
                    <button className="tienda"
                            onClick={() => window.location.href = 'https://tienda.watones.xyz/'}>Tienda
                    </button>
                </div>
            </main>
        </div>
    );
}