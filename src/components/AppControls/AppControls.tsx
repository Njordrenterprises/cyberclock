import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import styles from './AppControls.module.css';

interface AppControlsProps {
  currentRoute: string;
}

const AppControls: Component<AppControlsProps> = (props) => {
  return (
    <div class={styles.controlsContainer}>
      <A 
        href="/" 
        class={`${styles.controlButton} ${props.currentRoute === '/' ? styles.active : ''}`}
      >
        TIMER
      </A>
      <A 
        href="/projects" 
        class={`${styles.controlButton} ${props.currentRoute === '/projects' ? styles.active : ''}`}
      >
        PROJECTS
      </A>
      <A 
        href="/team" 
        class={`${styles.controlButton} ${props.currentRoute === '/team' ? styles.active : ''}`}
      >
        TEAM
      </A>
      <A 
        href="/stats" 
        class={`${styles.controlButton} ${props.currentRoute === '/stats' ? styles.active : ''}`}
      >
        STATS
      </A>
    </div>
  );
};

export default AppControls; 