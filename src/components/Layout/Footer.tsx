import { Component, createSignal, onMount, onCleanup } from 'solid-js';
import styles from './Footer.module.css';

const Footer: Component = () => {
  const startTime = new Date();
  const [uptime, setUptime] = createSignal('0:00:00');

  const calculateUptime = () => {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  let timer: number;

  onMount(() => {
    timer = window.setInterval(() => {
      setUptime(calculateUptime());
    }, 1000);
  });

  onCleanup(() => {
    clearInterval(timer);
  });

  return (
    <footer class={styles.footer}>
      <div class={styles.content}>
        TIME ONLINE: {uptime()}
      </div>
    </footer>
  );
};

export default Footer;
