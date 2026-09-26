import React from 'react';
import styles from '../styles/meetings_page.module.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

import AuthenticatedImage from '../../../components/AuthenticatedImage';

// Icons
const Icons = {
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  MoreHorizontal: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  HeartEnvelope: () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
      <path d="M12 16c0 0-4-3-4-5.5a2.5 2.5 0 0 1 5-1.5 2.5 2.5 0 0 1 5 1.5c0 2.5-4 5.5-4 5.5" fill="#6E1E37" stroke="none" />
    </svg>
  ),
  HelpCircle: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
};

const MeetingsPage = () => {
  return (
    <div className={styles.container}>
      <Sidebar activePage="meetings" />

      <div className={styles.mainLayout}>
        {/* Top Navbar */}
        <TopBar searchPlaceholder="Search profiles or events..." />

        {/* Content Body */}
        <div className={styles.pageBody}>
          
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.pageTitle}>Meeting Hub</h1>
              <div className={styles.pageSubtitle}>Manage your introductions and schedule new connections.</div>
            </div>
            <button className={styles.scheduleNewBtn}>Schedule New</button>
          </div>

          {/* Grid Layout */}
          <div className={styles.contentGrid}>
            
            {/* Left Column */}
            <div>
              {/* Upcoming Introductions */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icons.Calendar /> Upcoming Introductions
                </h2>
                <span className={styles.sectionSubtext}>2 Sessions Pending</span>
              </div>

              <div className={styles.upcomingGrid}>
                {/* Card 1: Aria Sharma */}
                <div className={styles.meetingCard}>
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.avatarWrapper}>
                      <AuthenticatedImage alt="Aria Sharma" className={styles.squareAvatar} />
                      <div className={styles.verifiedBadge}>✓</div>
                    </div>
                    <div className={styles.nameInfo}>
                      <div className={styles.cardName}>Aria Sharma</div>
                      <div className={styles.matchQuality}>Match Quality: 98%</div>
                    </div>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}><Icons.Clock /></span>
                    Today, 5:30 PM (IST)
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}><Icons.Video /></span>
                    Virtual Video Call
                  </div>

                  <div className={styles.cardActions}>
                    <button className={styles.primaryBtn}>Join Meeting</button>
                    <button className={styles.moreIconBtn}><Icons.MoreHorizontal /></button>
                  </div>
                </div>

                {/* Card 2: Ishani Gupta */}
                <div className={styles.meetingCard}>
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.avatarWrapper}>
                      <AuthenticatedImage alt="Ishani Gupta" className={styles.squareAvatar} />
                    </div>
                    <div className={styles.nameInfo}>
                      <div className={styles.cardName}>Ishani Gupta</div>
                      <div className={styles.matchQuality}>Handpicked Match</div>
                    </div>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}><Icons.Clock /></span>
                    Thursday, 24 Oct • 4:00 PM
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}><Icons.MapPin /></span>
                    Taj Mahal Palace, Mumbai
                  </div>

                  <div className={styles.cardActions}>
                    <button className={styles.outlinePillBtn}>View Profile</button>
                    <button className={styles.grayPillBtn}>Details</button>
                  </div>
                </div>
              </div>

              {/* Meeting History */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Meeting History</h2>
                <a href="#meetings" className={styles.sectionActionLink}>Full Log →</a>
              </div>

              <div className={styles.historyTableCard}>
                <div className={styles.tableHeader}>
                  <div>PROFILE</div>
                  <div>DATE</div>
                  <div>TYPE</div>
                  <div>STATUS</div>
                </div>
                
                <div className={styles.tableRow}>
                  <div className={styles.profileCell}>
                    <div className={`${styles.gradAvatar} ${styles.grad1}`}></div>
                    <span className={styles.tableName}>Vikram Mehta</span>
                  </div>
                  <div className={styles.tableCell}>12 Oct 2023</div>
                  <div className={styles.tableCell}>In-Person</div>
                  <div>
                    <span className={`${styles.statusPill} ${styles.statusCompleted}`}>COMPLETED</span>
                  </div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.profileCell}>
                    <div className={`${styles.gradAvatar} ${styles.grad2}`}></div>
                    <span className={styles.tableName}>Sneha Joshi</span>
                  </div>
                  <div className={styles.tableCell}>08 Oct 2023</div>
                  <div className={styles.tableCell}>Virtual Call</div>
                  <div>
                    <span className={`${styles.statusPill} ${styles.statusCompleted}`}>COMPLETED</span>
                  </div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.profileCell}>
                    <div className={`${styles.gradAvatar} ${styles.grad3}`}></div>
                    <span className={styles.tableName}>Rahul Singh</span>
                  </div>
                  <div className={styles.tableCell}>05 Oct 2023</div>
                  <div className={styles.tableCell}>Virtual Call</div>
                  <div>
                    <span className={`${styles.statusPill} ${styles.statusRescheduled}`}>RESCHEDULED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Calendar Widget */}
              <div className={styles.calendarWidget}>
                <div className={styles.calHeader}>
                  <div className={styles.calMonth}>October 2023</div>
                  <div className={styles.calNav}>
                    <Icons.ChevronLeft />
                    <Icons.ChevronRight />
                  </div>
                </div>
                
                <div className={styles.calGrid}>
                  <div className={styles.calDayLabel}>S</div>
                  <div className={styles.calDayLabel}>M</div>
                  <div className={styles.calDayLabel}>T</div>
                  <div className={styles.calDayLabel}>W</div>
                  <div className={styles.calDayLabel}>T</div>
                  <div className={styles.calDayLabel}>F</div>
                  <div className={styles.calDayLabel}>S</div>

                  <div className={`${styles.calDateCell} ${styles.dateMuted}`}>24</div>
                  <div className={`${styles.calDateCell} ${styles.dateMuted}`}>25</div>
                  <div className={`${styles.calDateCell} ${styles.dateMuted}`}>26</div>
                  <div className={`${styles.calDateCell} ${styles.dateMuted}`}>27</div>
                  <div className={`${styles.calDateCell} ${styles.dateMuted}`}>28</div>
                  <div className={`${styles.calDateCell} ${styles.dateMuted}`}>29</div>
                  <div className={`${styles.calDateCell} ${styles.dateMuted}`}>30</div>

                  <div className={styles.calDateCell}>1</div>
                  <div className={styles.calDateCell}>2</div>
                  <div className={styles.calDateCell}>3</div>
                  <div className={styles.calDateCell}>4</div>
                  <div className={styles.calDateCell}>
                    5<div className={styles.eventDot}></div>
                  </div>
                  <div className={styles.calDateCell}>6</div>
                  <div className={styles.calDateCell}>7</div>

                  <div className={styles.calDateCell}>
                    8<div className={styles.eventDot}></div>
                  </div>
                  <div className={styles.calDateCell}>9</div>
                  <div className={styles.calDateCell}>10</div>
                  <div className={styles.calDateCell}>11</div>
                  <div className={styles.calDateCell}>
                    12<div className={styles.eventDot}></div>
                  </div>
                  <div className={styles.calDateCell}>13</div>
                  <div className={styles.calDateCell}>14</div>

                  <div className={styles.calDateCell}>15</div>
                  <div className={styles.calDateCell}>16</div>
                  <div className={styles.calDateCell}>17</div>
                  <div className={styles.calDateCell}>18</div>
                  <div className={styles.calDateCell}>19</div>
                  <div className={styles.calDateCell}>20</div>
                  <div className={`${styles.calDateCell} ${styles.dateSelected}`}>21</div>

                  <div className={styles.calDateCell}>22</div>
                  <div className={styles.calDateCell}>23</div>
                  <div className={styles.calDateCell}>
                    24<div className={styles.eventDot}></div>
                  </div>
                  <div className={styles.calDateCell}>25</div>
                  <div className={styles.calDateCell}>26</div>
                  <div className={styles.calDateCell}>27</div>
                  <div className={styles.calDateCell}>28</div>
                </div>
              </div>

              {/* New Requests */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icons.HeartEnvelope /> New Requests
                </h2>
              </div>

              <div className={styles.requestCard}>
                <div className={styles.reqHeader}>
                  <AuthenticatedImage alt="Kavya Desai" className={styles.reqAvatar} />
                  <div>
                    <div className={styles.reqName}>Kavya Desai</div>
                    <div className={styles.reqSub}>Requested 2h ago</div>
                  </div>
                  <div className={styles.reqInfoIcon}><Icons.Info /></div>
                </div>
                
                <div className={styles.reqQuote}>
                  "Would love to connect over a quick coffee this weekend if you're available."
                </div>
                
                <div className={styles.reqActions}>
                  <button className={styles.primaryBtn}>Confirm</button>
                  <button className={styles.grayPillBtn}>Decline</button>
                </div>
              </div>

              {/* Need Help Deciding? Card */}
              <div className={styles.helpCard}>
                <div className={styles.helpIcon}><Icons.HeartEnvelope /></div>
                <div className={styles.helpTitle}>Need Help Deciding?</div>
                <div className={styles.helpDesc}>Our expert matchmakers can help you prepare for your first meeting and ensure a great experience.</div>
                <button className={styles.outlinePillBtn}>Talk to Expert</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingsPage;
