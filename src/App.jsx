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
      <a href="#arena" className="skip-link">تخطَّ إلى المحتوى</a>
      <Background />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Journey />
        <div className="hairline mx-auto max-w-7xl" />
        <DecisionCard />
        <div className="hairline mx-auto max-w-7xl" />
        <Arena />
        <div className="hairline mx-auto max-w-7xl" />
        <Suspense fallback={<div className="mx-auto max-w-7xl px-8 py-32 text-center text-[12px] text-slate-600">يُحمّل المحاكي…</div>}>
          <Simulator />
        </Suspense>
        <div className="hairline mx-auto max-w-7xl" />
        <Shield />
        <div className="hairline mx-auto max-w-7xl" />
        <ScamLab />
        <div className="hairline mx-auto max-w-7xl" />
        <ScamGame />
        <div className="hairline mx-auto max-w-7xl" />
        <Compass />
        <div className="hairline mx-auto max-w-7xl" />
        <PreMortem />
        <div className="hairline mx-auto max-w-7xl" />
        <Calc />
        <div className="hairline mx-auto max-w-7xl" />
        <Purchasing />
        <div className="hairline mx-auto max-w-7xl" />
        <Platforms />
        <div className="hairline mx-auto max-w-7xl" />
        <AssetVault />
        <div className="hairline mx-auto max-w-7xl" />
        <Roadmap />
        <div className="hairline mx-auto max-w-7xl" />
        <Curriculum />
        <div className="hairline mx-auto max-w-7xl" />
        <Tracker />
        <div className="hairline mx-auto max-w-7xl" />
        <Cases />
        <div className="hairline mx-auto max-w-7xl" />
        <Lexicon />
        <div className="hairline mx-auto max-w-7xl" />
        <Scripts />
        <div className="hairline mx-auto max-w-7xl" />
        <Review />
        <div className="hairline mx-auto max-w-7xl" />
        <ShareCard />
        <div className="hairline mx-auto max-w-7xl" />
        <PlanExport />
        <div className="hairline mx-auto max-w-7xl" />
        <Fuel />
        <Manifesto />
        <div className="hairline mx-auto max-w-7xl" />
        <Faq />
      </main>
      <Footer />
      <CommandPalette />
      <Onboarding />
      </div>
    </StoreProvider>
  );
}
