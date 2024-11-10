import { Component, createSignal, createEffect, onCleanup } from 'solid-js';
import styles from './DigitalClock.module.css';
import { timerDb } from '../../db/timer.db';

interface DigitalClockProps {
  isRunning: boolean;
}

const DigitalClock: Component<DigitalClockProps> = (props) => {
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const [lastSync, setLastSync] = createSignal(0);
  const [intervalId, setIntervalId] = createSignal<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return {
      time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };
  };

  // DB Sync Effect
  createEffect(() => {
    const syncTimer = setInterval(() => {
      const lastSession = timerDb.getLastSession();
      const totalTime = timerDb.getTotalTime();
      
      if (lastSession && props.isRunning) {
        const currentElapsed = Date.now() - lastSession.start_time;
        const previousTime = totalTime?.total || 0;
        setElapsedTime(previousTime + currentElapsed);
      } else if (totalTime) {
        setElapsedTime(totalTime.total);
      }
      setLastSync(Date.now());
    }, 100);

    onCleanup(() => clearInterval(syncTimer));
  });

  // UI Update Effect
  createEffect(() => {
    if (props.isRunning && !intervalId()) {
      const id = setInterval(() => {
        const timeSinceSync = Date.now() - lastSync();
        setElapsedTime(prev => prev + timeSinceSync);
        setLastSync(Date.now());
      }, 50);
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
        {formatTime(elapsedTime()).time}
      </div>
      <div class={styles.dateDisplay}>
        {formatTime(elapsedTime()).date}
      </div>
    </div>
  );
};

export default DigitalClock;
