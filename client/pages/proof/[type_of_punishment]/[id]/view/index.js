import React from "react";
import connectToDatabase from "@/lib/mongoose";
const ProofDetail = ({ proofData }) => {
    if (!proofData) {
        return <div>Cargando...</div>;
    }

    const { proofType, proofContent } = proofData;



    return (
        <div>
            <h1>Pruebas de sancion id: {proofData.punishmentId}</h1>
            {proofType === "image" && (
                <img src={proofContent} alt="Prueba" style={{ maxWidth: "30%" }} />
            )}
            {proofType === "video" && (
                <video controls style={{ maxWidth: "30%" }}>
                    <source src={proofContent} type="video/mp4" />
                    Tu buscador no soporta videos.
                </video>
            )}
            {proofType === "url" && (
                <a href={proofContent} target="_blank" rel="noopener noreferrer">
                    {proofContent}
                </a>
            )}
        </div>
    );

}

export async function getServerSideProps(context) {
    const { type_of_punishment, id } = context.params;

    const { db } = await connectToDatabase();

    const collection = db.collection("punishments");

    let punishmentType = type_of_punishment;

    const proofData = await collection.findOne({
        punishmentId: id,
        punishmentType: punishmentType,
    });

    return {
        props: {
            proofData: JSON.parse(JSON.stringify(proofData)),
        },
    };
}

export default ProofDetail;