import { StoreProvider } from './lib/store.jsx';
import Background from './components/Background.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Arena from './components/Arena.jsx';
import Simulator from './components/Simulator.jsx';
import Shield from './components/Shield.jsx';
import Compass from './components/Compass.jsx';
import Tracker from './components/Tracker.jsx';
import PlanExport from './components/PlanExport.jsx';
import Cases from './components/Cases.jsx';
import Lexicon from './components/Lexicon.jsx';
import PreMortem from './components/PreMortem.jsx';
import ScamLab from './components/ScamLab.jsx';
import Scripts from './components/Scripts.jsx';
import ShareCard from './components/ShareCard.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Calc from './components/Calc.jsx';
import Roadmap from './components/Roadmap.jsx';
import Fuel from './components/Fuel.jsx';
import Manifesto from './components/Manifesto.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <StoreProvider>
      <div className="noise relative min-h-screen bg-ink text-slate-200">
      <Background />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Arena />
        <div className="hairline mx-auto max-w-7xl" />
        <Simulator />
        <div className="hairline mx-auto max-w-7xl" />
        <Shield />
        <div className="hairline mx-auto max-w-7xl" />
        <ScamLab />
        <div className="hairline mx-auto max-w-7xl" />
        <Compass />
        <div className="hairline mx-auto max-w-7xl" />
        <PreMortem />
        <div className="hairline mx-auto max-w-7xl" />
        <Calc />
        <div className="hairline mx-auto max-w-7xl" />
        <Roadmap />
        <div className="hairline mx-auto max-w-7xl" />
        <Tracker />
        <div className="hairline mx-auto max-w-7xl" />
        <Cases />
        <div className="hairline mx-auto max-w-7xl" />
        <Lexicon />
        <div className="hairline mx-auto max-w-7xl" />
        <Scripts />
        <div className="hairline mx-auto max-w-7xl" />
        <ShareCard />
        <div className="hairline mx-auto max-w-7xl" />
        <PlanExport />
        <div className="hairline mx-auto max-w-7xl" />
        <Fuel />
        <Manifesto />
      </main>
      <Footer />
      <CommandPalette />
      </div>
    </StoreProvider>
  );
}
