import { Component, createSignal } from 'solid-js';
import styles from './DoomsdayButton.module.css';
import TimerRing from './TimerRing';
import { timerDb } from '../../db/timer.db';

interface DoomsdayButtonProps {
  isRunning: boolean;
  onClick: () => void;
}

const DoomsdayButton: Component<DoomsdayButtonProps> = (props) => {
  const [currentTimerId, setCurrentTimerId] = createSignal<number | null>(null);

  const handleClick = () => {
    if (!props.isRunning) {
      const id = timerDb.startTimer();
      setCurrentTimerId(id as number);
    } else if (currentTimerId()) {
      timerDb.stopTimer(currentTimerId()!);
      setCurrentTimerId(null);
    }
    props.onClick();
  };

  return (
    <div class={styles.doomsdayContainer}>
      <button 
        class={`${styles.doomsdayButton} ${props.isRunning ? styles.active : ''}`}
        onClick={handleClick}
      >
        <div class={styles.buttonCore}>
          <div class={styles.buttonInner}>
            <span class={styles.buttonText}>
              {props.isRunning ? 'TERMINATE' : 'INITIATE'}
            </span>
          </div>
        </div>
        <div class={styles.buttonWarning}>
          <span>{props.isRunning ? 'SYSTEM ACTIVE' : 'SYSTEM READY'}</span>
        </div>
      </button>
      <TimerRing isActive={props.isRunning} />
    </div>
  );
};

export default DoomsdayButton;
