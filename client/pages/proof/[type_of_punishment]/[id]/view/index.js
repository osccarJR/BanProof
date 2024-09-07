import React from "react";
const db = require('../../../../../lib/database');
const ProofDetail = ({ proofData }) => {
    if (!proofData) {
        return <div>Cargando...</div>;
    }

    const { proof_type, proof_content } = proofData;



    return (
        <div>
            <h1>Pruebas de sancion id: {proofData.punishment_id}</h1>
            {proof_type === "image" && (
                <img src={proof_content} alt="Prueba" style={{ maxWidth: "30%" }} />
            )}
            {proof_type === "video" && (
                <video controls style={{ maxWidth: "30%" }}>
                    <source src={proof_content} type="video/mp4" />
                    Tu buscador no soporta videos.
                </video>
            )}
            {proof_type === "url" && (
                <a href={proof_content} target="_blank" rel="noopener noreferrer">
                    {proof_content}
                </a>
            )}
        </div>
    );

}

export async function getServerSideProps(context) {
    const { type_of_punishment, id } = context.params;

    
    const proofData = await db.getPunishmentByTypeAndId(type_of_punishment, id);
   

    return {
        props: {
            proofData: JSON.parse(JSON.stringify(proofData[0])),
        },
    };
}

export default ProofDetail;