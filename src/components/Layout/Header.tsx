import { Component } from 'solid-js';
import { GlitchText } from '../UI/GlitchText';
import styles from './Header.module.css';

const Header: Component = () => {
  return (
    <header class={styles.header}>
      <GlitchText text="CYBER CLOCK" />
    </header>
  );
};

export default Header;
