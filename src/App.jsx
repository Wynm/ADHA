import Background from './components/Background.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Arena from './components/Arena.jsx';
import Simulator from './components/Simulator.jsx';
import Shield from './components/Shield.jsx';
import Compass from './components/Compass.jsx';
import Calc from './components/Calc.jsx';
import Roadmap from './components/Roadmap.jsx';
import Fuel from './components/Fuel.jsx';
import Manifesto from './components/Manifesto.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
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
        <Compass />
        <div className="hairline mx-auto max-w-7xl" />
        <Calc />
        <div className="hairline mx-auto max-w-7xl" />
        <Roadmap />
        <div className="hairline mx-auto max-w-7xl" />
        <Fuel />
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
