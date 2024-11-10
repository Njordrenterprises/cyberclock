import { Title } from "@solidjs/meta";
import { useLocation } from "@solidjs/router";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";
import AppControls from "~/components/AppControls/AppControls";
import styles from "./stats.module.css";

export default function Stats() {
  const location = useLocation();

  return (
    <>
      <Title>CYBER CLOCK | Stats</Title>
      <div class="grid-background"></div>
      <Header />
      <main>
        <AppControls currentRoute={location.pathname} />
        <div class={styles.statsContainer}>
          <h1 class={styles.title}>STATS</h1>
          <div class={styles.content}>
            <p>Statistics module loading...</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
