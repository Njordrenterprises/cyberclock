import { Component, createSignal, createEffect, onCleanup } from 'solid-js';
import styles from './DigitalClock.module.css';

interface DigitalClockProps {
  isRunning: boolean;
}

const DigitalClock: Component<DigitalClockProps> = (props) => {
  const [time, setTime] = createSignal(new Date());
  const [intervalId, setIntervalId] = createSignal<ReturnType<typeof setInterval> | null>(null);

  createEffect(() => {
    if (props.isRunning && !intervalId()) {
      const id = setInterval(() => setTime(new Date()), 1000);
      setIntervalId(id);
    } else if (!props.isRunning && intervalId()) {
      clearInterval(intervalId()!);
      setIntervalId(null);
    }
  });

  onCleanup(() => {
    if (intervalId()) {
      clearInterval(intervalId()!);
    }
  });

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
