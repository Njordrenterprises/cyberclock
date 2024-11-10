import { Component } from 'solid-js';
import styles from './TimerRing.module.css';

interface TimerRingProps {
  isActive: boolean;
}

const TimerRing: Component<TimerRingProps> = (props) => {
  return (
    <div class={`${styles.ringContainer} ${props.isActive ? styles.active : ''}`}>
      <div class={styles.ring}></div>
    </div>
  );
};

export default TimerRing;
