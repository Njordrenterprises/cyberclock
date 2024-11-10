import { Component, createSignal, onCleanup } from 'solid-js';
import styles from './DigitalClock.module.css';

const DigitalClock: Component = () => {
  const [time, setTime] = createSignal(new Date());

  const timer = setInterval(() => setTime(new Date()), 1000);

  onCleanup(() => clearInterval(timer));

  return (
    <div class={styles.clockContainer}>
      <div class={styles.timeDisplay}>
        {time().toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </div>
      <div class={styles.dateDisplay}>
        {time().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>
    </div>
  );
};

export default DigitalClock;
