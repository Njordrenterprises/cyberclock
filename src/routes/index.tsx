import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { ProtectedRoute } from "~/app";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";
import DigitalClock from "~/components/Clock/DigitalClock";
import DoomsdayButton from "~/components/UI/DoomsdayButton";
import AppControls from "~/components/AppControls/AppControls";
import AuthControls from "~/components/Auth/AuthControls/AuthControls";
import AuthForm from "~/components/Auth/AuthForm";
import { authState } from "~/stores/auth.store";
import styles from "./auth.module.css";

export default function Home() {
  const [isRunning, setIsRunning] = createSignal(false);
  const location = useLocation();

  return (
    <div class={styles.root}>
      <Title>CYBER CLOCK | Time is Money</Title>
      <div class="grid-background"></div>
      <Header />
      
      <Show
        when={!authState().isLoading}
        fallback={null}
      >
        <Show
          when={authState().user}
          fallback={
            <main class={styles.mainContent}>
              <div class={styles.authContainer}>
                <AuthForm />
              </div>
            </main>
          }
        >
          <ProtectedRoute>
            <AuthControls />
            <main>
              <AppControls currentRoute={location.pathname} />
              <DigitalClock isRunning={isRunning()} />
              <DoomsdayButton 
                isRunning={isRunning()} 
                onClick={() => setIsRunning(!isRunning())} 
              />
            </main>
          </ProtectedRoute>
        </Show>
      </Show>
      
      <Footer />
    </div>
  );
}
