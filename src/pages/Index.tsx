import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Hero3D } from "@/components/Hero3D";
import { ClientMarquee } from "@/components/ClientMarquee";
import { BrandNarrative } from "@/components/BrandNarrative";
import { ServicePillars } from "@/components/ServicePillars";
import { AISolutionsCTA } from "@/components/AISolutionsCTA";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Hero3D />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-fade-in">
            We Build Intelligent
            <br />
            <span className="text-gradient">Growth Engines</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Fusing AI-driven strategy with human creativity to generate leads that matter.
          </p>
          <Button variant="hero" size="lg" className="animate-fade-in" asChild>
            <Link to="/services">
              Explore Our Solutions
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <ClientMarquee />
      <BrandNarrative />
      <ServicePillars />
      <AISolutionsCTA />
      
      <Footer />
    </div>
  );
};

export default Index;
