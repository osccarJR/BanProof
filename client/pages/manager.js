import { getSession } from "next-auth/react";
import connectToDatabase from "../lib/mongoose";
import { useEffect, useState } from "react";
import styles from "../styles/manager/manager.module.css";

const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
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

                            return { ...data, type: proof.punishmentType };
                        })
                );

                setPunishments(detailedPunishments);
                console.log(detailedPunishments);
            } catch (error) {
                console.error("Error fetching punishment details:", error);
            }
        };

        fetchPunishmentDetails();
    }, [filter]);

    const handleFilterChange = (type) => {
        setFilter(type);
    };

    if (!session || !session.roles.includes("management")) {
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
                        <th>Punishment Type</th>
                        <th>Punishment ID</th>
                        <th>User</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {punishments.map((punishment, index) => (
                        <tr key={index}>
                            <td>{capitalizeFirstLetter(punishment.type)}</td>
                            <td>{punishment.id}</td>
                            <td>{punishment.user}</td>
                            <td>{punishment.reason}</td>
                            <td>{punishment.date}</td>
                            <td>{punishment.duration}</td>
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