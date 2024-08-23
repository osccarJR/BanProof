import { getSession } from "next-auth/react";
import styles from '../../styles/staff/proof.module.css';
export default function Manager({ session }) {
    if (!session || !session.roles.includes('management') && !session.roles.includes('staff')) {
        return <p>Acceso no autorizado. Por favor, inicia sesión con una cuenta de staff.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Lista de sanciones:</h1>
                <p>En esta página podrás ver todas las sanciones que se han aplicado a los usuarios.</p>
                
                <div className={styles.punishments}>
                    <div className={styles.punishment}>
                      <th>
                        <td>Usuario</td>
                        <td>Fecha</td>
                        <td>Motivo</td>
                        <td>Staff</td>
                        <td>Acción</td>
                      </th>
                      

                        
                    </div>
                </div>

            </div>
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