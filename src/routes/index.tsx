import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import Header from "~/components/Layout/Header";
import Footer from "~/components/Layout/Footer";
import DigitalClock from "~/components/Clock/DigitalClock";
import ProjectTimer from "~/components/Clock/ProjectTimer";

export default function Home() {
  // Example team members - later we'll fetch this from Supabase
  const [teamMembers] = createSignal([
    { id: "1", name: "GHOST", rate: 100, share: 40 },
    { id: "2", name: "CIPHER", rate: 85, share: 30 },
    { id: "3", name: "NEXUS", rate: 75, share: 30 }
  ]);

  return (
    <>
      <Title>CYBER CLOCK | Time is Money</Title>
      <div class="grid-background"></div>
      <Header />
      <main>
        <DigitalClock />
        <ProjectTimer 
          projectId="demo-1"
          projectRate={150}
          teamMembers={teamMembers()}
        />
      </main>
      <Footer />
    </>
  );
}
