import { getSession } from "next-auth/react";
const db = require('../lib/database');
import { useEffect, useState } from "react";
import styles from "../styles/manager/manager.module.css";
import { Checkbox } from "@nextui-org/react";
import { CheckmarkIcon } from "../icons/CheckmarkIcon";
import { CrossmarkIcon } from "../icons/CrossmarkIcon";

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

const updateProof = async (proof) => {
    let { punishment_id, punishment_type, isValid, validated } = proof;
    isValid = !isValid;
    validated = !validated;
    const response = await fetch('/api/updateValidity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ punishment_id, punishment_type, isValid, validated }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Error updating proof:', data);
    } else {
        console.log('Proof updated:', data);
    }

    return data;

}
export default function Manager({ session, punishmentProofs }) {
    const [punishments, setPunishments] = useState([]);
    const [filter, setFilter] = useState("all");
    const [selectedProof, setSelectedProof] = useState(null);

    useEffect(() => {
        
        const fetchPunishmentDetails = async () => {
            try {
                const detailedPunishments = await Promise.all(
                    punishmentProofs
                        .filter((proof) => filter === "all" || proof.punishment_type === filter)
                        .map(async (proof) => {
                            const response = await fetch(`/api/${proof.punishment_type}/id/${proof.punishment_id}`);
                            const data = await response.json();
                            const name = await fetch(`/api/getName/${data.uuid}`).then((res) => res.json());

                            return { ...data, type: proof.punishment_type, username: name.name, punishmentProof: proof };
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
    const handleCheckboxChange = async (punishmentProof, isValid) => {
        // Deselect the previously selected proof if not selecting the same proof
        if (selectedProof && (selectedProof.punishment_id !== punishmentProof.punishment_id || selectedProof.punishment_type !== punishmentProof.punishment_type)) {
            await updateProof({ ...selectedProof, isValid: false, validated: false });
        }

        
        if (selectedProof && selectedProof.punishment_id === punishmentProof.punishment_id && selectedProof.punishment_type === punishmentProof.punishment_type && selectedProof.isValid === isValid) {
            setSelectedProof(null);
            await updateProof({ ...punishmentProof, isValid: false, validated: false });
        } else {
            
            const updatedProof = { ...punishmentProof, isValid, validated: isValid !== undefined ? true : false };
            setSelectedProof(updatedProof);
            await updateProof(updatedProof);
        }
    };


    if (!session || !(session.roles.includes("management") || session.roles.includes("Dev"))) {
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
                            <td>{formatDuration(punishment.time, punishment.until)}</td>
                            <td><button className={styles.proofButton} onClick={() => window.location.href = `/proof/${punishment.type}/${punishment.id}/view`}>Click Para acceder a las pruebas</button></td>

                            <td>
                                <button className={styles.proofButton} onClick={() => window.location.href = `/proof/${punishment.type}/${punishment.id}/edit`}>Editar Pruebas</button>
                                <button className={styles.proofButton} onClick={() => window.location.href = `/proof/${punishment.type}/${punishment.id}/delete`}>Eliminar Pruebas</button>
                            </td>
                            <td>

                                <div className={styles.checkboxContainer}>
                                    <Checkbox
                                        isSelected={selectedProof?.punishment_id === punishment.punishmentProof.punishment_id && selectedProof.punishment_type === punishment.punishmentProof.punishment_type && selectedProof.isValid === true}
                                        icon={<CheckmarkIcon />}
                                        classNames={{
                                            base: styles.customCheckboxBase,
                                            icon: styles.customCheckboxIcon,
                                            wrapper: styles.customCheckboxWrapper,
                                        }}

                                        onChange={() => handleCheckboxChange(punishment.punishmentProof, true)}

                                    ></Checkbox>
                                    <Checkbox
                                        isSelected={selectedProof?.punishment_id === punishment.punishmentProof.punishment_id && selectedProof.punishment_type === punishment.punishmentProof.punishment_type && selectedProof.isValid === false}
                                        icon={<CrossmarkIcon />}
                                        classNames={{
                                            base: styles.customCheckboxBase,
                                            icon: styles.customCheckboxIcon,
                                            wrapper: styles.customCheckboxWrapper,
                                        }}
                                        onChange={() => handleCheckboxChange(punishment.punishmentProof, false)}
                                    ></Checkbox>
                                </div>

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
    await db.connectToDatabase();

    const punishmentProofs = await db.getAllPunishments();
    console.log(punishmentProofs);
    if (!punishmentProofs) {
        return {
            props: {
                session,
                punishmentProofs: [],
            },
        };
    }


    return {
        props: {
            session,
            punishmentProofs: JSON.parse(JSON.stringify(punishmentProofs)),

        },
    };
}