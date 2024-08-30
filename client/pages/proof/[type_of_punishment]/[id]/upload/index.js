import React, { useState } from 'react';
import styles from '../../../../../styles/staff/proof.upload.module.css';
import { useSession } from 'next-auth/react';

const ProofUpload = () => {
    const [filePreviews, setFilePreviews] = useState([]);
    const { data: session } = useSession();
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = new FormData(event.target);

        const files = form.getAll('file-upload').filter(file => file.size > 0); 
        const urls = form.getAll('url').filter(url => url.trim() !== ''); 
        const currentUrl = window.location.pathname;
        const punishmentId = currentUrl.split('/')[3];
        const punishmentType = currentUrl.split('/')[2];
        const proofContent = files.length > 0 ? files.map(file => URL.createObjectURL(file)) : urls;
        const proofType = files.length > 0 ? 'file' : 'url';
        console.log(urls)
        console.log(files)

        if (files.length === 0 && urls.length === 0) {
            return alert('Debes subir al menos un archivo o agregar una URL');
        }


        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: session.user.id,
                proofType,
                proofContent,
                punishmentId,
                punishmentType,
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Error al subir las pruebas');
            }
            alert('Pruebas subidas correctamente');
            window.location.reload();
        }).catch((error) => {
            console.error('Error:', error);
            alert('Error al subir las pruebas');
        }
        );

    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Subir pruebas para la sancion</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="file-upload" className={styles.fileUpload}>
                        Seleccionar archivos
                    </label>
                    <input
                        type="file"
                        accept="image/*, video/*"
                        name="file-upload"
                        id="file-upload"
                        multiple
                        onChange={handleFileChange}
                    />
                    <p>o</p>
                    <label>
                        <input type="text" placeholder="URL" name="url" />
                    </label>
                    <button type="submit">Subir</button>
                </form>

                {filePreviews.length > 0 && (
                    <div className={styles.previewContainer}>
                        {filePreviews.map((preview, index) => (
                            <div key={index} className={styles.previewItem}>
                                {preview.endsWith('.mp4') ? (
                                    <video src={preview} controls className={styles.previewMedia} />
                                ) : (
                                    <img src={preview} alt={`Preview ${index}`} className={styles.previewMedia} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProofUpload;
