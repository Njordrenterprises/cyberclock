import { Component } from 'solid-js';
import styles from './Footer.module.css';

const Footer: Component = () => {
  return (
    <footer class={styles.footer}>
      <div class={styles.content}>
        <span class={styles.copyright}>CYBER CLOCK © {new Date().getFullYear()}</span>
        <div class={styles.links}>
          <a href="/privacy" class={styles.link}>PRIVACY</a>
          <a href="/terms" class={styles.link}>TERMS</a>
          <a href="/support" class={styles.link}>SUPPORT</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
