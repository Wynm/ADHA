import { StoreProvider } from './lib/store.jsx';
import { Suspense, lazy } from 'react';
import Background from './components/Background.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Arena from './components/Arena.jsx';
const Simulator = lazy(() => import('./components/Simulator.jsx'));
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
import ScamGame from './components/ScamGame.jsx';
import Onboarding from './components/Onboarding.jsx';
import Purchasing from './components/Purchasing.jsx';
import Platforms from './components/Platforms.jsx';
import AssetVault from './components/AssetVault.jsx';
import Curriculum from './components/Curriculum.jsx';
import Journey from './components/Journey.jsx';
import Rule from './components/Rule.jsx';
import Faq from './components/Faq.jsx';
import DecisionCard from './components/DecisionCard.jsx';
import Review from './components/Review.jsx';
import Calc from './components/Calc.jsx';
import Roadmap from './components/Roadmap.jsx';
import Fuel from './components/Fuel.jsx';
import Manifesto from './components/Manifesto.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <StoreProvider>
      <div className="noise relative min-h-screen bg-ink text-slate-200">
        <a href="#decision" className="skip-link">تخطَّ إلى المحتوى</a>
        <Background />
        <Nav />
        <main className="relative z-10">
          <Hero />
          <Journey />
          <Rule />
          <DecisionCard />
          <Rule />
          <Arena />
          <Rule />
          <Suspense fallback={<div className="mx-auto max-w-7xl px-8 py-32 text-center text-[12px] text-slate-600">يُحمّل المحاكي…</div>}>
            <Simulator />
          </Suspense>
          <Rule />
          <Shield />
          <Rule />
          <ScamLab />
          <Rule />
          <ScamGame />
          <Rule />
          <Compass />
          <Rule />
          <PreMortem />
          <Rule />
          <Calc />
          <Rule />
          <Purchasing />
          <Rule />
          <Platforms />
          <Rule />
          <AssetVault />
          <Rule />
          <Roadmap />
          <Rule />
          <Curriculum />
          <Rule />
          <Tracker />
          <Rule />
          <Review />
          <Rule />
          <Cases />
          <Rule />
          <Lexicon />
          <Rule />
          <Scripts />
          <Rule />
          <ShareCard />
          <Rule />
          <PlanExport />
          <Rule />
          <Fuel />
          <Manifesto />
          <Rule />
          <Faq />
        </main>
        <Footer />
        <CommandPalette />
        <Onboarding />
      </div>
    </StoreProvider>
  );
}
