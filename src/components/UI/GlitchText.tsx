import { Component, splitProps } from 'solid-js';
import styles from './GlitchText.module.css';

interface GlitchTextProps {
  text: string;
  class?: string;
}

export const GlitchText: Component<GlitchTextProps> = (props) => {
  const [local, rest] = splitProps(props, ['text', 'class']);
  
  return (
    <div class={`${styles.glitchWrapper} ${local.class || ''}`} {...rest}>
      <div class={styles.glitch} data-text={local.text}>
        {local.text}
      </div>
    </div>
  );
};
