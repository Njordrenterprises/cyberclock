import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { GlitchText } from "~/components/UI/GlitchText";
import styles from "./disconnect.module.css";

export default function Disconnect() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => {
    setIsClient(true);
  });

  const handleReconnect = () => {
    navigate('/auth', { replace: true });
  };

  return (
    <div class={styles.disconnectRoot}>
      <Title>CYBER CLOCK | SYSTEM DISCONNECT</Title>
      {isClient() && <div class={styles.glitchOverlay} />}
      {isClient() && <div class={styles.scanlines} />}
      
      <main class={styles.content}>
        <div class={styles.warningContainer}>
          <h1 class={styles.warningTitle}>
            {isClient() ? <GlitchText text="SYSTEM DISCONNECT" /> : "SYSTEM DISCONNECT"}
          </h1>
          <div class={styles.glitchText}>
            {isClient() ? <GlitchText text="CONNECTION TERMINATED" /> : "CONNECTION TERMINATED"}
          </div>
          
          <div class={styles.terminalText}>
            <p>{'>'} Initiating quantum vault sequence...</p>
            <p>{'>'} Encrypting temporal data...</p>
            <p>{'>'} Archiving in DEEP STORAGE VAULT-23...</p>
            <p>{'>'} Your timeline is preserved. Forever.</p>
          </div>

          <div class={styles.statsContainer}>
            <div class={styles.stat}>
              <span>VAULT STATUS</span>
              <span class={styles.value}>SEALED</span>
            </div>
            <div class={styles.stat}>
              <span>DATA INTEGRITY</span>
              <span class={styles.value}>100%</span>
            </div>
          </div>

          <div class={styles.vaultMessage}>
            Your chronological footprint has been secured in our underground quantum vault.
            Time never dies. It just waits.
          </div>

          <button 
            onClick={handleReconnect}
            class={styles.reconnectButton}
          >
            REINITIALIZE CONNECTION
          </button>
        </div>
      </main>
    </div>
  );
}
