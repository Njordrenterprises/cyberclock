import { Component, createSignal } from 'solid-js';
import { signOut } from '../../../stores/auth.store';
import { isOnline } from '../../../stores/syncStore';
import { useNavigate } from '@solidjs/router';
import styles from './AuthControls.module.css';

interface AuthControlsProps {}

const AuthControls: Component<AuthControlsProps> = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleSignOut = async () => {
    if (isLoading()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isOnline()) {
        throw new Error('Cannot sign out while offline');
      }
      
      navigate('/disconnect', { replace: true });
      await signOut();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      console.error('Sign out error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div class={styles.authControlsContainer}>
      <button 
        onClick={handleSignOut}
        class={styles.authButton}
        disabled={isLoading()}
        aria-busy={isLoading()}
      >
        {isLoading() ? 'DISCONNECTING...' : 'DISCONNECT'}
      </button>
      {error() && (
        <div class={styles.error} role="alert">
          {error()}
        </div>
      )}
    </div>
  );
};

export default AuthControls;
