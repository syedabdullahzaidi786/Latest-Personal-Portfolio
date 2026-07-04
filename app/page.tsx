import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/ui/Navbar').then(m => ({ default: m.Navbar })));
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen').then(m => ({ default: m.LoadingScreen })));
const Footer = dynamic(() => import('@/components/ui/Footer').then(m => ({ default: m.Footer })));
const SplineRobot = dynamic(() => import('@/components/3d/SplineRobot').then(m => ({ default: m.SplineRobot })), { ssr: false });

const HeroSection = dynamic(() => import('@/components/hero/HeroSection').then(m => ({ default: m.HeroSection })));
const AboutSection = dynamic(() => import('@/components/about/AboutSection').then(m => ({ default: m.AboutSection })));
const WorkSection = dynamic(() => import('@/components/work/WorkSection').then(m => ({ default: m.WorkSection })));
const TechStackSection = dynamic(() => import('@/components/tech-stack/TechStackSection').then(m => ({ default: m.TechStackSection })));
const ContactSection = dynamic(() => import('@/components/contact/ContactSection').then(m => ({ default: m.ContactSection })));

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <LoadingScreen />

      <div className="relative z-10">
        <Navbar />

        <HeroSection />

        <AboutSection />

        <WorkSection />

        <TechStackSection />

        <ContactSection />

        <Footer />
      </div>

      <SplineRobot />
    </main>
  );
}
