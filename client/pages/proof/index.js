import { useEffect, useState } from 'react';
import styles from '../../styles/proof/bans.module.css';

export default function BansPage() {
    const [bans, setBans] = useState([]);

    useEffect(() => {
        fetch('/api/bans')
            .then((res) => res.json())
            .then((data) => setBans(data));
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Lista de Baneos</h1>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Player</th>
                    <th>Banned By</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Expires</th>
                </tr>
                </thead>
                <tbody>
                {bans.map((ban) => (
                    <tr key={ban.id}>
                        <td className={styles.playerCell}>
                            <img src={`/api/player/avatar/${ban.name}`} alt={ban.name} className={styles.playerAvatar} />
                            {ban.name}
                        </td>
                        <td className={styles.bannedBy}>
                            <img src={`/icons/staff/${ban.banned_by_name}.png`} alt={ban.banned_by_name} className={styles.bannedByIcon} />
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
    );
}
