import { Title } from "@solidjs/meta";
import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";
import AuthForm from "~/components/Auth/AuthForm";
import { authState } from "~/stores/auth.store";
import styles from "./auth.module.css";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if already authenticated
  createEffect(() => {
    if (authState().user && !authState().isLoading) {
      navigate('/', { replace: true });
    }
  });

  return (
    <>
      <Title>CYBER CLOCK | Access Terminal</Title>
      <div class="grid-background"></div>
      <Header />
      <main>
        <div class={styles.authContainer}>
          <AuthForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
