import React from 'react';
import styles from '../../../../styles/staff/proof.punishment.module.css';
const db = require('../../../../lib/database');

const isBufferTrue = (buffer) => buffer?.data?.[0] === 1;

const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
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

const ProofDetail = ({ proofData, hasProof, type_of_punishment: punishmentType , name }) => {
    if (!proofData) {
        return <div className={styles.loading}>Cargando...</div>;
    }
   
    //check if punishmenttype contains a s at the end and remove it
    if(punishmentType.charAt(punishmentType.length - 1) === 's') {
        punishmentType = punishmentType.slice(0, -1);
        window.location.href = `/proof/${punishmentType}/${proofData.id}`;

    }


    const silent = isBufferTrue(proofData.silent);
    const ipban = isBufferTrue(proofData.ipban);
    const ipbanWildcard = isBufferTrue(proofData.ipban_wildcard);
    const active = isBufferTrue(proofData.active);


    const time = formatTimestamp(proofData.time);
    const until = formatTimestamp(proofData.until);
    const duration = formatDuration(proofData.time, proofData.until);



    return (
        <div className={styles.container}>
            <div className={styles.punishmentCard}>
                <h1 className={styles.title}>Detalles de sanción</h1>
                <p><strong>ID:</strong> {proofData.id}</p>
                <p><strong>Usuario sancionado:</strong> {name || 'N/A'}</p>
                <p><strong>UUID del usuario:</strong> {proofData.uuid}</p>
                <p><strong>Sancionado por:</strong> {proofData.banned_by_name || 'N/A'}</p>
                <p><strong>Duración:</strong> {duration}</p>
                <p><strong>Fecha de inicio:</strong> {time}</p>
                <p><strong>Fecha de finalización:</strong> {until}</p>
                <p><strong>Razón:</strong> {proofData.reason || 'N/A'}</p>
                <p><strong>Activa:</strong> {active ? 'Sí' : 'No'}</p>
                <p><strong>Removida por:</strong> {proofData.removed_by_name || 'N/A'}</p>
                <p><strong>Razón de unban:</strong> {proofData.removed_by_reason || 'N/A'}</p>
                <p><strong>IP:</strong> {proofData.ip || 'N/A'}</p>
                <p><strong>Sanción por IP:</strong> {ipban ? 'Sí' : 'No'}</p>
                <p><strong>Origen:</strong> {proofData.server_origin || 'N/A'}</p>
                <p><strong>Silenciosa:</strong> {silent ? 'Sí' : 'No'}</p>
                <p><strong>Fecha Removida:</strong> {proofData.removed_by_date ? new Date(proofData.removed_by_date).toLocaleString() : 'N/A'}</p>
                <button className={styles.proofButton} onClick={() => {
                    hasProof ? window.location.href = `/proof/${punishmentType}/${proofData.id}/view`
                        : window.location.href = `/proof/${punishmentType}/${proofData.id}/upload`;
                }}>
                    {hasProof ? 'Ver Pruebas' : 'Click para agregar pruebas'}
                </button>
            </div>
        </div>
    );

};

export async function getServerSideProps(context) {
    let { type_of_punishment, id } = context.params;
    let punishmentType;
    if(type_of_punishment.charAt(type_of_punishment.length - 1) === 's') {
        punishmentType = type_of_punishment.slice(0, -1);
    } else {
        punishmentType = type_of_punishment;
    }

    const apiUrl = `http://localhost:3000/api/${punishmentType}/id/${id}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let proofData = await response.json();

        if (Array.isArray(proofData)) {
            proofData = proofData[0];
        }

        if (typeof proofData !== 'object' || proofData === null) {
            throw new Error('Expected proofData to be an object.');
        }



       
        

        const punishment = await db.getPunishmentByTypeAndId(punishmentType, id);
        console.log(punishment);

        const hasProof = punishment.length > 0;
        let name = await fetch(`http://localhost:3000/api/getName/${proofData.uuid}`).then(res => res.json());
        name = name?.name || null

        return {
            props: {
                proofData,
                hasProof,
                type_of_punishment,
                name
            },
        };
    } catch (error) {
        console.error('Error obteniendo data de pruebas:', error);
        return {
            notFound: true,
        };
    }
}

export default ProofDetail;