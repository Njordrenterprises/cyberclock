import { Component, createSignal, createEffect, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import styles from './ProjectTimer.module.css';

interface TeamMember {
  id: string;
  name: string;
  rate: number;
  share: number;
}

interface ProjectTimerProps {
  projectId: string;
  projectRate: number;
  teamMembers: TeamMember[];
}

interface TimerStore {
  startTime: number;
  intervalId: number | NodeJS.Timeout;
}

const ProjectTimer: Component<ProjectTimerProps> = (props) => {
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const [isRunning, setIsRunning] = createSignal(false);
  const [profit, setProfit] = createSignal(0);
  const [store, setStore] = createStore<TimerStore>({
    startTime: 0,
    intervalId: 0,
  });

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProfit = (seconds: number) => {
    const hours = seconds / 3600;
    return hours * props.projectRate;
  };

  const startTimer = () => {
    setIsRunning(true);
    setStore('startTime', Date.now() - elapsedTime() * 1000);
    const intervalId = setInterval(() => {
      const currentTime = Math.floor((Date.now() - store.startTime) / 1000);
      setElapsedTime(currentTime);
      setProfit(calculateProfit(currentTime));
    }, 1000);
    setStore('intervalId', intervalId as unknown as number);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(store.intervalId);
  };

  const resetTimer = () => {
    stopTimer();
    setElapsedTime(0);
    setProfit(0);
  };

  return (
    <div class={styles.timerContainer}>
      <div class={styles.matrixBackground}></div>
      
      <div class={styles.timeDisplay}>
        <div class={styles.glowText}>{formatTime(elapsedTime())}</div>
        <div class={styles.profitDisplay}>
          <span class={styles.label}>PROFIT:</span>
          <span class={styles.amount}>${profit().toFixed(2)}</span>
        </div>
      </div>

      <div class={styles.teamProfit}>
        {props.teamMembers.map(member => (
          <div class={styles.memberProfit}>
            <span class={styles.memberName}>{member.name}</span>
            <span class={styles.memberShare}>
              ${(profit() * (member.share / 100)).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div class={styles.controls}>
        <button 
          class={`${styles.controlButton} ${styles.startButton}`}
          onClick={() => isRunning() ? stopTimer() : startTimer()}
        >
          {isRunning() ? 'PAUSE' : 'START'}
        </button>
        <button 
          class={`${styles.controlButton} ${styles.resetButton}`}
          onClick={resetTimer}
        >
          RESET
        </button>
      </div>
    </div>
  );
};

export default ProjectTimer;
