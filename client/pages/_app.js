import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import '../styles/globals.css';
import '../styles/loginpage.css';

function Auth({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <p>Cargando...</p>;

    if (!session && router.pathname !== '/') {
        router.push('/');
        return null;
    }

    return children;
}

function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Auth>
                <Component {...pageProps} />
            </Auth>
        </SessionProvider>
    );
}

export default MyApp;
