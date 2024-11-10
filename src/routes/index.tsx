import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import { useLocation } from "@solidjs/router";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";
import DigitalClock from "~/components/Clock/DigitalClock";
import DoomsdayButton from "~/components/UI/DoomsdayButton";
import AppControls from "~/components/AppControls/AppControls";

export default function Home() {
  const [isRunning, setIsRunning] = createSignal(false);
  const location = useLocation();

  return (
    <>
      <Title>CYBER CLOCK | Time is Money</Title>
      <div class="grid-background"></div>
      <Header />
      <main>
        <AppControls currentRoute={location.pathname} />
        <DigitalClock isRunning={isRunning()} />
        <DoomsdayButton 
          isRunning={isRunning()} 
          onClick={() => setIsRunning(!isRunning())} 
        />
      </main>
      <Footer />
    </>
  );
}
