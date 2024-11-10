import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import styles from './AppControls.module.css';

interface AppControlsProps {
  currentRoute: string;
}

const AppControls: Component<AppControlsProps> = (props) => {
  return (
    <div class={styles.controlsContainer}>
      <div class={styles.controlsGrid}>
        <A 
          href="/" 
          class={`${styles.controlButton} ${styles.timerBtn} ${props.currentRoute === '/' ? styles.active : ''}`}
        >
          TIMER
        </A>
        <A 
          href="/projects" 
          class={`${styles.controlButton} ${styles.projectsBtn} ${props.currentRoute === '/projects' ? styles.active : ''}`}
        >
          PROJECTS
        </A>
        <A 
          href="/team" 
          class={`${styles.controlButton} ${styles.teamBtn} ${props.currentRoute === '/team' ? styles.active : ''}`}
        >
          TEAM
        </A>
        <A 
          href="/stats" 
          class={`${styles.controlButton} ${styles.statsBtn} ${props.currentRoute === '/stats' ? styles.active : ''}`}
        >
          STATS
        </A>
      </div>
    </div>
  );
};

export default AppControls; 