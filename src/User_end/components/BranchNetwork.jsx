import styles from '../pages/styles/branch_network.module.css';

const branches = [
  {
    id: 1,
    city: 'Mumbai',
    address: 'The Regal Palace, Bandra West\nMumbai, MH 400050',
    phone: '+91 22 2640 1234',
  },
  {
    id: 2,
    city: 'Delhi',
    address: 'Aurobindo Place, Hauz Khas\nNew Delhi, DL 110016',
    phone: '+91 11 4165 5678',
  },
  {
    id: 3,
    city: 'Bangalore',
    address: 'UB City, Vittal Mallya Road\nBangalore, KA 560001',
    phone: '+91 80 4112 9000',
  },
];

export default function BranchNetwork() {
  return (
    <section className={styles.section} id="branches">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Our Physical <span className={styles.titleAccent}>Presence</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {branches.map((branch) => (
            <div key={branch.id} className={styles.card}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className={styles.cityName}>{branch.city}</h3>
              <p className={styles.address}>{branch.address}</p>
              <span className={styles.phone}>{branch.phone}</span>
            </div>
          ))}
        </div>

        <div className={styles.bannerWrapper}>
          <img 
            src="https://images.unsplash.com/photo-1570160897040-30430ade2218?w=1400&q=80" 
            alt="Gateway of India at sunset" 
            className={styles.bannerImage}
          />
        </div>
      </div>
    </section>
  );
}
