import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Target, Globe, Share2 } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Solutions",
    description: "Intelligent automation, chatbots, and AI calling assistants that transform operations.",
  },
  {
    icon: Target,
    title: "Paid Ad Campaigns",
    description: "Meta & Google Ads optimized for maximum ROI and sustainable growth.",
  },
  {
    icon: Globe,
    title: "Website Development",
    description: "High-performance, conversion-focused websites built for modern businesses.",
  },
  {
    icon: Share2,
    title: "Social Media Management",
    description: "Strategic content creation and community building that drives engagement.",
  },
];

export const ServicePillars = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 px-4 bg-card">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Core <span className="text-gradient">Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive digital services designed for measurable growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_63%_61%/0.2)]"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
