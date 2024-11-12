import { Component, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { signInWithEmail, signUp, authError, setAuthError } from '~/stores/auth.store';
import { isServer } from 'solid-js/web';
import styles from './AuthForm.module.css';

const AuthForm: Component = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (isServer) return;
    
    setLoading(true);
    setAuthError(null);

    try {
      if (isSignUp()) {
        const { error } = await signUp(email(), password());
        if (!error) {
          setEmail('');
          setPassword('');
          setIsSignUp(false);
          navigate('/', { replace: true });
        }
      } else {
        const { data, error } = await signInWithEmail(email(), password());
        if (!error && data?.session) {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class={styles.container}>
      <form class={styles.form} onSubmit={handleSubmit}>
        <h2 class={styles.title}>ACCESS TERMINAL</h2>
        <div class={styles.inputGroup}>
          <input
            type="email"
            placeholder="ENTER EMAIL"
            required
            class={styles.input}
            value={isServer ? '' : email()}
            onInput={!isServer ? (e) => setEmail(e.currentTarget.value) : undefined}
            disabled={loading()}
          />
        </div>
        <div class={styles.inputGroup}>
          <input
            type="password"
            placeholder="ENTER PASSWORD"
            required
            class={styles.input}
            value={isServer ? '' : password()}
            onInput={!isServer ? (e) => setPassword(e.currentTarget.value) : undefined}
            disabled={loading()}
          />
        </div>
        <Show when={!isServer && authError()}>
          <div class={styles.error} role="alert">{authError()}</div>
        </Show>
        <button 
          type="submit" 
          class={styles.submitButton}
          disabled={loading()}
        >
          {isServer ? 'CONNECT' : (loading() ? 'PROCESSING...' : (isSignUp() ? 'CREATE' : 'CONNECT'))}
        </button>
        <button 
          type="button"
          class={styles.switchMode}
          onClick={!isServer ? () => setIsSignUp(!isSignUp()) : undefined}
          disabled={loading()}
        >
          <span class={styles.switchText}>
            {isServer ? 'CREATE NEW ACCOUNT' : (isSignUp() ? 'EXISTING USER?' : 'CREATE NEW ACCOUNT')}
          </span>
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
