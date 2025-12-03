import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const BrandNarrative = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
            The digital world is <span className="text-gradient">noisy</span>.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your message gets lost. Growth feels like a game of chance.
          </p>
          <p className="text-xl leading-relaxed">
            At <span className="text-primary font-semibold">Genleads</span>, we replace chance with{" "}
            <span className="text-secondary font-semibold">intelligence</span>. We cut through the
            noise with precision, turning data into direction and strategy into sustainable success.
          </p>
          <div className="pt-8">
            <div className="inline-block px-6 py-2 border border-primary/20 rounded-full bg-primary/5">
              <p className="text-sm text-primary">
                Data-Driven · AI-Powered · Results-Focused
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
