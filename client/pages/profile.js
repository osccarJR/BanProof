import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';  // Importa Link para la navegación
import { useEffect, useState } from 'react';
import styles from '../styles/staff/profile.module.css';  // Importa el CSS local

export default function ProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        if (!session) {
            router.push('/');  // Redirige si no está autenticado
        } 
    }, [session]);

    if (!session) {
        return <p>Cargando...</p>;  // Mostrar un mensaje de carga
    }
    
    return (
        <div className={styles.profileContainer}>
            {/* Barra de Navegación similar a la de index.js */}
            <header className={styles.navbar}>
                <Link href="/">
                    <Image src="/logo.png" alt="Watones Logo" width={50} height={50} className={styles.logo} />
                </Link>
            </header>

            <div className={styles.profilePage}>
                <h1 className={styles.title}>Perfil de {session.user.name}</h1>
                <div className={styles.profileHeader}>
                    <Image
                        src={session.user.image}
                        alt="Imagen de Perfil de Discord"
                        width={100}
                        height={100}
                        className={styles.profilePic}
                    />
                    <div className={styles.profileInfo}>
                        <p><strong>Nombre:</strong> {session.user.name}</p>
                        <p><strong>Tag de Discord:</strong> {session.user.tag ? session.user.tag : "Sin Tag"}</p>
                        <p><strong>Email:</strong> {session.user.email ? session.user.email : "Correo no disponible"}</p>
                        <p><strong>Rol:</strong> {session?.roles?.length > 0 ? session.roles[1] : "Sin Rol"}</p>
                        
                    </div>
                </div>
                <div className={styles.profileActions}>
                    <button className={styles.editButton}>Editar Perfil</button>
                </div>
            </div>
        </div>
    );
}
