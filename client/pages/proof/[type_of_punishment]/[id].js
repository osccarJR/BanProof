import React from 'react';
import styles from '../../../styles/staff/proof.punishment.module.css';
const ProofDetail = ({ proofData }) => {
    if (!proofData) {
        return <div className={styles.loading}>Cargando...</div>;
    }

    const formattedType = proofData.type.charAt(0).toUpperCase() + proofData.type.slice(1).replace('s', '');
    
    /*
      Cosas que podes obtener de la sancion
      proofData.type
      proofData.id
      proofData.uuid
      proofData.name
      proofData.ip
      proofData.reason
      proofData.banned_by_name
      proofData.banned_by_uuid
      proofData.removed_by_name
      proofData.removed_by_uuid
      proofData.removed_by_reason
      proofData.time
      proofData.until
      proofData.server_scope
      proofData.server_origin
      proofData.silent
      proofData.ipban
      proofData.active
    */
    
   

      const time = proofData.time ? new Date(proofData.time).toLocaleString() : 'N/A';
      const until = proofData.until ? new Date(proofData.until).toLocaleString() : 'Permanente';
      const duration = (proofData.time && proofData.until) 
      ? `${Math.floor((new Date(proofData.until) - new Date(proofData.time)) / (1000 * 60 * 60 * 24))} días`
      : 'Permanente';
  

    return (
        <div className={styles.container}>
             <div className={styles.punishmentContainer}>
                <h1>Detalles de sanción</h1>
                <p><strong>Tipo de Sanción:</strong> {formattedType}</p>
                <p><strong>ID:</strong> {proofData.id}</p>
                <p><strong>Usuario sancionado:</strong> {proofData.name}</p>
                <p><strong>UUID del usuario:</strong> {proofData.uuid}</p>
                <p><strong>Sancionado por:</strong> {proofData.banned_by_name}</p>
                <p><strong>Duración:</strong> {duration}</p>
                <p><strong>Fecha de inicio:</strong> {time}</p>     
                <p><strong>Fecha de finalización:</strong> {until}</p>           
            </div>

        </div>
    );
};

export async function getServerSideProps(context) {
    const { type_of_punishment, id } = context.params;

    try {
        // Obtener data de el plugin de bungee
        const response = await fetch(`http://localhost:8080/getPunishment?type=${type_of_punishment}&id=${id}`);
        const proofData = await response.json();

        
        if (!proofData) {
            return {
                notFound: true,
            };
        }
        console.log(proofData);
        return {
            props: {
                proofData, 
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
