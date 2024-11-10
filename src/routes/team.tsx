import { Title } from "@solidjs/meta";
import { useLocation } from "@solidjs/router";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";
import AppControls from "~/components/AppControls/AppControls";
import styles from "./team.module.css";

export default function Team() {
  const location = useLocation();

  return (
    <>
      <Title>CYBER CLOCK | Team</Title>
      <div class="grid-background"></div>
      <Header />
      <main>
        <AppControls currentRoute={location.pathname} />
        <div class={styles.teamContainer}>
          <h1 class={styles.title}>TEAM</h1>
          <div class={styles.content}>
            <p>Team management module loading...</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 