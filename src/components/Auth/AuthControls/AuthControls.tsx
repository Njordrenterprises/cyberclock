import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { signOut } from '~/stores/auth.store';
import styles from './AuthControls.module.css';

const AuthControls: Component = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <div class={styles.authControlsContainer}>
      <button 
        onClick={handleSignOut}
        class={styles.authButton}
      >
        DISCONNECT
      </button>
    </div>
  );
};

export default AuthControls;
