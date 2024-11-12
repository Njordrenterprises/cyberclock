import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { Show, createEffect, type Component } from "solid-js";
import AuthForm from "~/components/Auth/AuthForm";
import { authState } from "~/stores/auth.store";
import styles from "./auth.module.css";

const Login: Component = () => {
  const navigate = useNavigate();
  
  createEffect(() => {
    const auth = authState();
    if (!auth.isLoading && auth.initialized && auth.user) {
      navigate('/', { replace: true });
    }
  });

  return (
    <div class={styles.authRoot}>
      <Title>CYBER CLOCK | LOGIN</Title>
      <div class="grid-background" />
      <div class="scanlines" />
      
      <Show
        when={!authState().isLoading && authState().initialized}
        fallback={
          <div class={styles.loadingContainer}>
            <div class={styles.loading}>INITIALIZING SECURE CONNECTION...</div>
          </div>
        }
      >
        <main class={styles.mainContent}>
          <div class={styles.authContainer}>
            <AuthForm />
          </div>
        </main>
      </Show>
    </div>
  );
};

export default Login;
