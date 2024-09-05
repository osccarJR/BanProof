import { getSession } from "next-auth/react";
import connectToDatabase from "../lib/mongoose";
import { useEffect, useState } from "react";
import styles from "../styles/manager/manager.module.css";

const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';

    if ((end - start) / (1000 * 60 * 60 * 24) >= 1) {
        return `${Math.floor((end - start) / (1000 * 60 * 60 * 24))} días`;
    } else if ((end - start) / (1000 * 60 * 60) >= 1) {
        return `${Math.floor((end - start) / (1000 * 60 * 60))} horas`;
    } else if ((end - start) / (1000 * 60) >= 1) {
        return `${Math.floor((end - start) / (1000 * 60))} minutos`;
    } else if ((end - start) / 1000 >= 1) {
        return `${Math.floor((end - start) / 1000)} segundos`;
    } else {
        return 'N/A';
    }
}

const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
};

export default function Manager({ session, punishmentProofs }) {
    const [punishments, setPunishments] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {

        const fetchPunishmentDetails = async () => {
            try {
                const detailedPunishments = await Promise.all(
                    punishmentProofs
                        .filter((proof) => filter === "all" || proof.punishmentType === filter)
                        .map(async (proof) => {
                            const response = await fetch(`/api/${proof.punishmentType}/id/${proof.punishmentId}`);
                            const data = await response.json();
                            const name = await fetch(`/api/getName/${data.uuid}`).then((res) => res.json());

                            return { ...data, type: proof.punishmentType, username: name.name };
                        })
                );

                setPunishments(detailedPunishments);
                
            } catch (error) {
                console.error("Error fetching punishment details:", error);
            }
        };

        fetchPunishmentDetails();
    }, [filter]);

    const handleFilterChange = (type) => {
        setFilter(type);
    };

    if (!session || !(session.roles.includes("management") || !session.roles.includes("Dev"))) {
        return <p>Acceso no autorizado. Por favor, inicia sesión con una cuenta de administrador.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.filterButtons}>
                <button
                    className={`${styles.filterButton} ${filter === "all" ? styles.filterButtonActive : ""}`}
                    onClick={() => handleFilterChange("all")}
                >
                    Todos
                </button>
                <button
                    className={`${styles.filterButton} ${filter === "ban" ? styles.filterButtonActive : ""}`}
                    onClick={() => handleFilterChange("ban")}
                >
                    Bans
                </button>
                <button
                    className={`${styles.filterButton} ${filter === "mute" ? styles.filterButtonActive : ""}`}
                    onClick={() => handleFilterChange("mute")}
                >
                    Mutes
                </button>
                <button
                    className={`${styles.filterButton} ${filter === "kick" ? styles.filterButtonActive : ""}`}
                    onClick={() => handleFilterChange("kick")}
                >
                    Kicks
                </button>
                <button
                    className={`${styles.filterButton} ${filter === "warn" ? styles.filterButtonActive : ""}`}
                    onClick={() => handleFilterChange("warn")}
                >
                    Warns
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tipo de sancion</th>
                        <th>ID</th>
                        <th>Usuario Sancionado</th>
                        <th>Razon</th>
                        <th>Fecha</th>
                        <th>Duracion</th>
                        <th>Pruebas</th>
                        <th>Acciones</th>
                        <th>Validas?</th>
                    </tr>
                </thead>
                <tbody>
                    {punishments.map((punishment, index) => (
                        <tr key={index}>
                            <td>{capitalizeFirstLetter(punishment.type)}</td>
                            <td>{punishment.id}</td>
                            <td>{punishment.username}</td>
                            <td>{punishment.reason}</td>
                            <td>{formatTimestamp(punishment.time)}</td>
                            <td>{formatDuration(punishment.time,punishment.until)}</td>
                            <td><button className={styles.proofButton} onClick={() => window.location.href = `/proof/${punishment.type}/${punishment.id}/view`}>Click Para acceder a las pruebas</button></td>
                            
                            <td>
                                <button className={styles.proofButton} onClick={() => window.location.href = `/proof/${punishment.type}/${punishment.id}/edit`}>Editar Pruebas</button>
                                <button className={styles.proofButton} onClick={() => window.location.href = `/proof/${punishment.type}/${punishment.id}/delete`}>Eliminar Pruebas</button>
                            </td>
                            <td>
                            { /* Add checkmark circle and cross circle for proof rating  with checkbox*/}


                            </td>

                    
                        </tr>
                    ))}
                </tbody>
            </table>
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

    const { db } = await connectToDatabase();

    const punishmentProofs = await db.collection("punishments").find({}).toArray();

    return {
        props: {
            session,
            punishmentProofs: JSON.parse(JSON.stringify(punishmentProofs))
        },
    };
}