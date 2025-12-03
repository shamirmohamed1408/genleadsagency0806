import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const AISolutionsCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-card border border-primary/20 rounded-2xl p-12 text-center space-y-6 shadow-[0_0_50px_hsl(43_63%_61%/0.1)]"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full animate-glow">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold">
            Experience Our <span className="text-gradient">AI Solutions</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover how our custom AI solutions can streamline your operations, enhance customer
            engagement, and drive predictable revenue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button variant="hero" size="lg" asChild>
              <Link to="/services">Explore AI Solutions</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Schedule a Demo</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
