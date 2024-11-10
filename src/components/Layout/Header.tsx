import { Component } from 'solid-js';
import { GlitchText } from '../UI/GlitchText';
import styles from './Header.module.css';

const Header: Component = () => {
  return (
    <header class={styles.header}>
      <GlitchText text="CYBER CLOCK" />
      <nav class={styles.nav}>
        <a href="/projects" class={styles.link}>Projects</a>
        <a href="/team" class={styles.link}>Team</a>
        <a href="/stats" class={styles.link}>Stats</a>
      </nav>
    </header>
  );
};

export default Header;
