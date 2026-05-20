import { useEffect } from "react";
import LandingPageHeader from "../components/UI/landingPage/LandingPageHeader";
import HeroSection from "../components/UI/landingPage/HeroSection";
import PorQueUsarLandingPage from "../components/UI/landingPage/PorQueUsarLandingPage";
import ComoFuncionaLandingPage from "../components/UI/landingPage/ComoFuncionaLandingPage";
import SegurancaLandingPage from "../components/UI/landingPage/SegurancaLandingPage";
import FaqLandingPage from "../components/UI/landingPage/FaqLandingPage";
import LandingPageFooter from "../components/UI/landingPage/LandingPageFooter";

export default function LandingPage() {
    useEffect(() => {
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousHtmlOverflowX = document.documentElement.style.overflowX;
        const previousBodyOverflow = document.body.style.overflow;
        const previousBodyOverflowX = document.body.style.overflowX;

        document.documentElement.style.overflow = "auto";
        document.documentElement.style.overflowX = "hidden";
        document.body.style.overflow = "auto";
        document.body.style.overflowX = "hidden";

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.documentElement.style.overflowX = previousHtmlOverflowX;
            document.body.style.overflow = previousBodyOverflow;
            document.body.style.overflowX = previousBodyOverflowX;
        };
    }, []);

    return (
        <main className="min-h-screen bg-white">
            <LandingPageHeader />
            <HeroSection />
            <PorQueUsarLandingPage />
            <ComoFuncionaLandingPage />
            <SegurancaLandingPage />
            <FaqLandingPage />
            <LandingPageFooter />
        </main>
    );
}
