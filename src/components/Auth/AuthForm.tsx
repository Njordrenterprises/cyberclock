import { createSignal, Show } from 'solid-js'
import { signInWithEmail, signUp, authError, setAuthError } from '~/stores/auth.store'
import styles from './AuthForm.module.css'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    setAuthError(null)

    try {
      if (isSignUp()) {
        const { error } = await signUp(email(), password())
        if (!error) {
          // Show confirmation message but don't redirect
          setEmail('')
          setPassword('')
          setIsSignUp(false)
        }
      } else {
        await signInWithEmail(email(), password())
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class={styles.container}>
      <form class={styles.form} onSubmit={handleSubmit}>
        <h2 class={styles.title}>
          {isSignUp() ? 'CREATE ACCOUNT' : 'ACCESS TERMINAL'}
        </h2>
        
        <div class={styles.inputGroup}>
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            placeholder="ENTER EMAIL"
            required
            disabled={loading()}
            class={styles.input}
          />
        </div>

        <div class={styles.inputGroup}>
          <input
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            placeholder="ENTER PASSWORD"
            required
            disabled={loading()}
            class={styles.input}
          />
        </div>

        <Show when={authError()}>
          <div class={styles.error}>{authError()}</div>
        </Show>

        <button 
          type="submit" 
          class={styles.submitButton}
          disabled={loading()}
        >
          {loading() ? 'PROCESSING...' : isSignUp() ? 'CREATE' : 'CONNECT'}
        </button>

        <button 
          type="button"
          class={styles.switchMode}
          onClick={() => setIsSignUp(!isSignUp())}
          disabled={loading()}
        >
          <span class={styles.switchText}>
            {isSignUp() ? 'EXISTING USER?' : 'CREATE NEW ACCOUNT'}
          </span>
        </button>
      </form>
    </div>
  )
}
