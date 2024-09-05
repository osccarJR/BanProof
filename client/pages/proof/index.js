import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/proof/bans.module.css'; // Importa el nuevo estilo

export default function BansPage() {
    const [bans, setBans] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/bans')
            .then((res) => res.json())
            .then((data) => setBans(data));
    }, []);

    const handleRowClick = (banId) => {
        router.push(`/proof/ban/${banId}/upload`);
    };

    return (
        <div className={styles.container}>
            {/* Headbar similar al de la página de upload */}
            <div className={styles.navbar}>
                <h1 className={styles.navTitle}>BanProof Panel</h1>
                <ul className={styles.navLinks}>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/proof">Baneos</a></li>
                </ul>
            </div>

            <h1 className={styles.title}>Lista de Baneos</h1>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Player</th>
                        <th>Banned By</th>
                        <th>Razon</th>
                        <th>Fecha</th>
                        <th>Expira</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bans.map((ban) => (
                        <tr key={ban.id} className={styles.tableRow} onClick={() => handleRowClick(ban.id)}>
                            <td className={styles.playerCell}>
                                <img src={`/api/player/avatar/${ban.name}`} alt={ban.name} className={styles.playerAvatar} />
                                {ban.name}
                            </td>
                            <td className={styles.bannedBy}>
                                <img src={`/icons/staff/${ban.banned_by_name}.png`} className={styles.bannedByIcon} />
                                {ban.banned_by_name}
                            </td>
                            <td>{ban.reason}</td>
                            <td>{new Date(ban.time).toLocaleString()}</td>
                            <td className={`${styles.expires} ${ban.until && ban.until < Date.now() ? styles.expired : ''}`}>
                                {ban.until ? new Date(ban.until).toLocaleString() : 'Permanente'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
