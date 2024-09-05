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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);

        const files = form.getAll('file-upload').filter(file => file.size > 0);
        const urls = form.getAll('url').filter(url => url.trim() !== '');
        const currentUrl = window.location.pathname;
        const punishmentId = currentUrl.split('/')[3];
        const punishmentType = currentUrl.split('/')[2];

        let proofType, proofContent = [];

        if (files.length > 0) {

            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/uploadFile', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                return data.fileUrl;
            });

            proofContent = await Promise.all(uploadPromises);
            proofType = files[0].type.startsWith('video') ? 'video' : 'image';
        } else if (urls.length > 0) {
            proofContent = urls;
            proofType = 'url';
        } else {
            return alert('Debes subir al menos un archivo o agregar una URL');
        }

        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: session?.id,
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
            window.location.href = `/proof/${punishmentType}s/${punishmentId}`;
        }).catch((error) => {
                console.error('Error:', error);
                alert('Error al subir las pruebas');
            }
        );
    };

    return (
        <div className={styles.container}>
            {/* Barra de navegación */}
            <nav className={styles.navbar}>
                <h1>Sistema de Sanciones</h1>
                <ul>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <li><a href="/">Inicio</a></li>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <li><a href="/proof">Sanciones</a></li>
                </ul>
            </nav>

            {/* Contenedor de subida */}
            <div className={styles.content}>
                <h1>Subir pruebas para la sancion</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                        className={styles.inputFile}
                    />
                    <p className={styles.orText}>o</p>
                    <label>
                        <input type="text" placeholder="URL" name="url" className={styles.inputUrl} />
                    </label>
                    <button type="submit" className={styles.submitButton}>Subir</button>
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
