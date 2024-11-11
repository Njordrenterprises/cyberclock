import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { signOut } from '~/stores/auth.store';
import { isOnline } from '~/stores/syncStore';
import styles from './AuthControls.module.css';

const AuthControls: Component = () => {
  const [isLoading, setIsLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (isLoading()) return;
    
    setIsLoading(true);
    try {
      if (!isOnline()) {
        throw new Error('Cannot sign out while offline');
      }
      
      await signOut();
      navigate('/disconnect', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class={styles.authControlsContainer}>
      <button 
        onClick={handleSignOut}
        class={styles.authButton}
        disabled={isLoading()}
      >
        {isLoading() ? 'DISCONNECTING...' : 'DISCONNECT'}
      </button>
    </div>
  );
};

export default AuthControls;
