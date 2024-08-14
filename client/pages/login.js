import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';


export default function Login() {


    const handleDiscordLogin = async () => {
        try {
            await signIn('discord', { callbackUrl: `${window.location.origin}/` }); 
        } catch (error) {
            console.error('Error during Discord login:', error);
        }
    };

    return (
        <div className="login-page min-h-screen flex flex-col items-center justify-center">
            <Head>
                <title>Iniciar Sesión - Watones Network</title>
                <meta name="description" content="Inicia sesión en Watones Network" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="navbar">
                <Link href="/">
                    <Image src="/logo.png" alt="Watones Logo" width={50} height={50} className="logo" />
                </Link>
            </header>

            <div className="login-container mt-8">
                <h1 className="login-title">Login</h1>
                <form className="login-form">
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>
                </form>

                <div className="other-options text-center mt-4">
                    <p>Or</p>
                    <button
                        onClick={handleDiscordLogin}
                        className="discord-login"
                        
                    >
                        <img src="/discord-logo.png" alt="Discord Logo" width={20} height={15}/>
                        Login with Discord
                    </button>
                </div>
            </div>
        </div>
    );
}