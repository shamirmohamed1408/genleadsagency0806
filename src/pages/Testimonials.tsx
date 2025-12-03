import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Testimonials3D } from "@/components/Testimonials3D";
import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Globe } from "lucide-react";

const testimonials = [
  {
    client: "Phoenix HR Solutions",
    service: "Social Media Management",
    duration: "10 months",
    result: "Grew their LinkedIn presence from 250 to 900 followers—a 260% increase—through strategic content and creative execution.",
    metric: "260% Growth",
    icon: TrendingUp,
  },
  {
    client: "Destination India",
    service: "Social Media Management",
    duration: "Ongoing",
    result: "Drove a significant increase in foot traffic and visitor numbers for the Los Angeles-based restaurant.",
    metric: "Increased Footfall",
    icon: Users,
  },
  {
    client: "Various Startups",
    service: "Website Development",
    duration: "Multiple Projects",
    result: "Delivered professional, high-performance websites that directly contributed to improved overall revenue and market presence for multiple startup clients.",
    metric: "Revenue Growth",
    icon: Globe,
  },
  {
    client: "Coming Soon",
    service: "Your Success Story",
    duration: "TBD",
    result: "We're excited to help your business achieve remarkable results. Join our growing list of satisfied clients.",
    metric: "Your Results Here",
    icon: Star,
  },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Testimonials3D />
      </div>
      
      <div className="relative z-10">
        <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6"
          >
            Client <span className="text-gradient">Success Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Real results from real partnerships. See how we've helped businesses grow.
          </motion.p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto auto-rows-fr">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_63%_61%/0.2)] flex flex-col h-full group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-heading font-bold mb-2">
                      {testimonial.client}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.service} · {testimonial.duration}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0 ml-4">
                    <testimonial.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                  {testimonial.result}
                </p>

                <div className="pt-6 border-t border-border mt-auto">
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                    <p className="text-sm font-bold text-primary">{testimonial.metric}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">250+</p>
              <p className="text-muted-foreground">Properties Sold</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">14K+</p>
              <p className="text-muted-foreground">Qualified Leads</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">260%</p>
              <p className="text-muted-foreground">Average Growth</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">10:1</p>
              <p className="text-muted-foreground">Best ROAS</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our growing list of successful clients
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_30px_hsl(43_63%_61%/0.4)]"
            >
              Get Started Today
            </a>
          </motion.div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
};

export default Testimonials;
