import React from 'react';
import styles from '../../../../styles/staff/proof.punishment.module.css';
import connectToDatabase from '@/lib/mongoose';

const isBufferTrue = (buffer) => buffer?.data?.[0] === 1;

const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
};

const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    
    if((end - start) / (1000 * 60 * 60 * 24) >= 1) {
        return `${Math.floor((end - start) / (1000 * 60 * 60 * 24))} días`;
    } else if((end - start) / (1000 * 60 * 60) >= 1) {
        return `${Math.floor((end - start) / (1000 * 60 * 60))} horas`;
    } else if((end - start) / (1000 * 60) >= 1) {
        return `${Math.floor((end - start) / (1000 * 60))} minutos`;
    } else if((end - start) / 1000 >= 1) {
        return `${Math.floor((end - start) / 1000)} segundos`;
    } else {
        return 'N/A';
    }
}

const ProofDetail = ({ proofData, hasProof, punishmentType }) => {
    if (!proofData) {
        return <div className={styles.loading}>Cargando...</div>;
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
            <div className={styles.punishmentContainer}>
                <h1>Detalles de sanción</h1>
                <p><strong>ID:</strong> {proofData.id}</p>
                <p><strong>Usuario sancionado:</strong> {proofData.banned_by_name || 'N/A'}</p>
                <p><strong>UUID del usuario:</strong> {proofData.uuid}</p>
                <p><strong>Sancionado por:</strong> {proofData.banned_by_name || 'N/A'}</p>
                <p><strong>Duración:</strong> {duration}</p>
                <p><strong>Fecha de inicio:</strong> {time}</p>
                <p><strong>Fecha de finalización:</strong> {until}</p>
                <p><strong>Razón:</strong> {proofData.reason || 'N/A'}</p>
                <p><strong>Activa:</strong> {active ? 'Si' : 'No'}</p>
                <p><strong>Removida por:</strong> {proofData.removed_by_name || 'N/A'}</p>
                <p><strong>Razón de unban:</strong> {proofData.removed_by_reason || 'N/A'}</p>
                <p><strong>IP:</strong> {proofData.ip || 'N/A'}</p>
                <p><strong>Sancion por ip:</strong> {ipban ? 'Si' : 'No'}</p>
                <p><strong>Origen:</strong> {proofData.server_origin || 'N/A'}</p>
                <p><strong>Silenciosa:</strong> {silent ? 'Si' : 'No'}</p>
                <p><strong>Fecha Removida:</strong> {proofData.removed_by_date ? new Date(proofData.removed_by_date).toLocaleString() : 'N/A'}</p>
                <button className={styles.proofButton} onClick={() => window.location.href = `/proof/${punishmentType}/${proofData.id}/upload`}>{hasProof ? 'Ver Pruebas' : 'Click para agregar pruebas'}</button>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { type_of_punishment, id } = context.params;

    const apiUrl = `http://localhost:3000/api/${type_of_punishment}/id/${id}`;

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

        
        const { db } = await connectToDatabase();

        if (!db) {
            throw new Error('Database connection failed.');
        }

        const collection = db.collection('punishments');
        let punishmentType = type_of_punishment;
        
        const punishment = await collection.findOne({ punishmentId: id , punishmentType: punishmentType });

        const hasProof = punishment !== null;

        return {
            props: {
                proofData,
                hasProof,
                punishmentType

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
