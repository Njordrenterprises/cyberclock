import { Title } from "@solidjs/meta";
import { useLocation } from "@solidjs/router";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";
import AppControls from "~/components/AppControls/AppControls";
import styles from "./projects.module.css";

export default function Projects() {
  const location = useLocation();

  return (
    <>
      <Title>CYBER CLOCK | Projects</Title>
      <div class="grid-background"></div>
      <Header />
      <main>
        <AppControls currentRoute={location.pathname} />
        <div class={styles.projectsContainer}>
          <h1 class={styles.title}>PROJECTS</h1>
          <div class={styles.content}>
            <p>Project management module loading...</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
