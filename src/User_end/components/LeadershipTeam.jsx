import styles from '../pages/styles/about_page.module.css';

const team = [
  {
    id: 1,
    name: 'Amara Deshmukh',
    role: 'FOUNDER & LEAD MATCHMAKER',
    bio: 'With over 20 years in community counseling, Amara brings an unparalleled depth of understanding to traditional Indian values and modern aspirations.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80', // Professional headshot
  },
  {
    id: 2,
    name: 'Rohan Kapoor',
    role: 'MANAGING DIRECTOR',
    bio: 'A strategic visionary with a background in premium hospitality, Rohan ensures that every member receives a seamless, world-class experience.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80', // Professional headshot
  },
  {
    id: 3,
    name: 'Vikram Singh',
    role: 'HEAD OF VERIFIED RELATIONS',
    bio: 'Vikram leads our elite verification team, maintaining the highest standards of safety and authenticity for our discerning global membership base.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80', // Professional headshot
  },
];

export default function LeadershipTeam() {
  return (
    <section className={styles.teamSection}>
      <div className={styles.teamContainer}>
        
        {/* Heading Block */}
        <div className={styles.teamHeader}>
          <span className={styles.teamEyebrow}>THE EXPERTS</span>
          <h2 className={styles.teamMainHeading}>
            Profiles of expert matchmakers and founders.
          </h2>
        </div>

        {/* Team Grid */}
        <div className={styles.teamGrid}>
          {team.map((member) => (
            <div key={member.id} className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className={styles.teamImage}
                />
              </div>
              <div className={styles.teamContent}>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamBio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
