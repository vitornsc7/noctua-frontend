import LandingPageHeader from "../components/UI/landingPage/LandingPageHeader";
import HeroSection from "../components/UI/landingPage/HeroSection";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            <LandingPageHeader />
            <HeroSection />
        </main>
    );
}
