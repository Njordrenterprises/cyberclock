import { Component } from 'solid-js';
import styles from './DoomsdayButton.module.css';

interface DoomsdayButtonProps {
  isRunning: boolean;
  onClick: () => void;
}

const DoomsdayButton: Component<DoomsdayButtonProps> = (props) => {
  return (
    <div class={styles.doomsdayContainer}>
      <button 
        class={`${styles.doomsdayButton} ${props.isRunning ? styles.active : ''}`}
        onClick={props.onClick}
      >
        <div class={styles.buttonCore}>
          <div class={styles.buttonInner}>
            <span class={styles.buttonText}>
              {props.isRunning ? 'TERMINATE' : 'INITIATE'}
            </span>
          </div>
        </div>
        <div class={styles.buttonRing}></div>
        <div class={styles.buttonWarning}>
          <span>{props.isRunning ? 'SYSTEM ACTIVE' : 'SYSTEM READY'}</span>
        </div>
      </button>
    </div>
  );
};

export default DoomsdayButton;
