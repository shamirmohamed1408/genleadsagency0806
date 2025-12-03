import { motion } from "framer-motion";

const clients = [
  "Phoenix HR Solutions",
  "Destination India",
  "TechStart Inc",
  "CloudScale",
  "DataDrive",
  "AI Ventures",
];

export const ClientMarquee = () => {
  return (
    <section className="py-12 border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-4">
        <p className="text-center text-muted-foreground text-sm uppercase tracking-wider">
          Trusted by Industry Leaders
        </p>
      </div>
      <motion.div
        className="flex gap-8 items-center"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {[...clients, ...clients, ...clients].map((client, index) => (
          <div
            key={index}
            className="flex-shrink-0 text-xl font-heading font-bold text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap"
          >
            {client}
          </div>
        ))}
      </motion.div>
    </section>
  );
};
