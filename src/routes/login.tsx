import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { Show, createEffect } from "solid-js";
import AuthForm from "~/components/Auth/AuthForm";
import { authState } from "~/stores/auth.store";
import styles from "./auth.module.css";

export default function Login() {
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  createEffect(() => {
    if (!authState().isLoading && authState().user) {
      navigate('/', { replace: true });
    }
  });

  return (
    <div class={styles.authRoot}>
      <Title>CYBER CLOCK | LOGIN</Title>
      <div class="grid-background"></div>
      
      <Show
        when={!authState().isLoading}
        fallback={null}
      >
        <main class={styles.mainContent}>
          <div class={styles.authContainer}>
            <AuthForm />
          </div>
        </main>
      </Show>
    </div>
  );
}
