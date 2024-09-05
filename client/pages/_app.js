import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import '../styles/globals.css';
import '../styles/loginpage.css';
import '../styles/staff/profile.module.css';
import '../styles/staff/proof.punishment.module.css';
import '../styles/staff/proof.module.css';
import '../styles/staff/proof.upload.module.css';
import '../styles/manager/manager.module.css';
import { NextUIProvider } from "@nextui-org/react";

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
        <NextUIProvider>
            <SessionProvider session={pageProps.session}>
                <Auth>
                    <Component {...pageProps} />
                </Auth>
            </SessionProvider>
        </NextUIProvider>
    );
}

export default MyApp;
