import React from 'react';

const ProofDetail = ({ proofData }) => {
    if (!proofData) {
        return <div>Cargando...</div>;
    }

    proofData.type = proofData.type.replace("s", "");
    proofData.type = proofData.type.charAt(0).toUpperCase() + proofData.type.slice(1);

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
    
    let time = new Date(proofData.time);
    let until = new Date(proofData.until);
    let duration;
    if (proofData.time == 0) {
       duration = "Permanente";
    }
    if (proofData.until == 0) {
        duration = "Permanente";
    }
    if (proofData.time != 0 && proofData.until != 0) {
        duration = until - time;
        duration = Math.floor(duration / 1000 / 60 / 60 / 24) + " días";
    }



    return (
        <div>
            <h1>Detalles de sancion</h1>
            <p><strong>Tipo de Sancion:</strong> {proofData.type}</p>
            <p><strong>ID:</strong> {proofData.id}</p>
            <p><strong>Usuario sancionado:</strong> {proofData.name}</p>
            <p><strong>UUID del usuario:</strong> {proofData.uuid}</p>
            <p><strong>Sancionado por:</strong> {proofData.banned_by_name}</p>
            <p><strong>Duracion: </strong> {duration}</p>
            <p></p>

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
