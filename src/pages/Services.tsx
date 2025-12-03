import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Services3D } from "@/components/Services3D";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, 
  MessageSquare, 
  Phone, 
  Target, 
  TrendingUp, 
  Globe, 
  Share2,
  Play
} from "lucide-react";

const aiVoiceAgents = [
  {
    industry: "Hospitals & Clinics",
    icon: Phone,
    description: "HIPAA-compliant AI assistants for appointment scheduling, patient inquiries, and follow-ups.",
  },
  {
    industry: "Restaurants",
    icon: Phone,
    description: "24/7 reservation management, order taking, and customer service automation.",
  },
  {
    industry: "Home Services",
    icon: Phone,
    description: "Automated booking, quote requests, and service inquiries for contractors and maintenance.",
  },
];

const metaAdsResults = [
  {
    client: "E-commerce Brand",
    objective: "Sales",
    strategy: "Deployed UGC-style reaction videos to build trust",
    results: "10:1 ROAS, 35% decrease in Cost Per Purchase",
  },
  {
    client: "B2B SaaS Company",
    objective: "Lead Generation",
    strategy: "Used problem-solution 'before-and-after' ad creative",
    results: "60% lower Cost Per Lead, 14,000+ qualified leads",
  },
  {
    client: "Real Estate Agency",
    objective: "Sales",
    strategy: "Hyper-local targeting with compelling property videos",
    results: "Sold 250 houses with 10x return on ad spend",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Services3D />
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
            Our <span className="text-gradient">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Comprehensive digital solutions designed to accelerate your growth
          </motion.p>
        </div>
      </section>

      {/* AI Solutions */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Brain className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-heading font-bold mb-4">AI Solutions</h2>
            <p className="text-xl text-muted-foreground">
              Transform your operations with intelligent automation, chatbots, and AI calling assistants
            </p>
          </div>

          {/* AI Voice Agents */}
          <div className="mb-16">
            <h3 className="text-2xl font-heading font-bold text-center mb-8">
              AI Calling Assistants by Industry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiVoiceAgents.map((agent, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background border border-border rounded-lg p-6 hover:border-primary/50 transition-all"
                >
                  <agent.icon className="w-8 h-8 text-primary mb-4" />
                  <h4 className="text-xl font-heading font-bold mb-3">{agent.industry}</h4>
                  <p className="text-muted-foreground mb-4">{agent.description}</p>
                  <Button variant="outline" size="sm" className="w-full group">
                    <Play className="w-4 h-4 mr-2 group-hover:text-primary" />
                    Play Demo
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Automation & Chatbots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-background border border-border rounded-lg p-6">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h4 className="text-xl font-heading font-bold mb-3">AI Chatbots</h4>
              <p className="text-muted-foreground">
                Intelligent conversational AI that handles customer inquiries 24/7, improving response times and customer satisfaction.
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-6">
              <Brain className="w-8 h-8 text-primary mb-4" />
              <h4 className="text-xl font-heading font-bold mb-3">Process Automation</h4>
              <p className="text-muted-foreground">
                Streamline repetitive tasks, reduce operational costs, and free your team to focus on high-value activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paid Ad Campaigns */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Target className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-heading font-bold mb-4">Paid Ad Campaigns</h2>
            <p className="text-xl text-muted-foreground">
              Meta & Google Ads strategies optimized for maximum ROI
            </p>
          </div>

          {/* Meta Ads Results Showcase */}
          <div className="mb-8">
            <h3 className="text-2xl font-heading font-bold text-center mb-8">
              Meta Ads Results Showcase
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {metaAdsResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_63%_61%/0.3)] hover:-translate-y-1.5 flex flex-col h-full group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="text-xl font-heading font-bold">{result.client}</h4>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Objective</p>
                      <p className="font-semibold text-foreground">{result.objective}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Strategy</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.strategy}</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Results</p>
                      <div className="relative">
                        <div className="h-1.5 bg-primary/20 rounded-full overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ delay: index * 0.2 + 0.3, duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          />
                        </div>
                        <p className="font-bold text-primary text-lg">{result.results}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Website Development */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-4xl text-center">
          <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-heading font-bold mb-4">Website Development</h2>
          <p className="text-xl text-muted-foreground mb-8">
            High-performance, conversion-focused websites that directly contribute to revenue growth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="font-bold mb-2">Performance Optimized</h4>
              <p className="text-sm text-muted-foreground">Lightning-fast load times and Core Web Vitals compliance</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Mobile-First</h4>
              <p className="text-sm text-muted-foreground">Responsive designs that work flawlessly on all devices</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Conversion Focused</h4>
              <p className="text-sm text-muted-foreground">Strategic UX designed to turn visitors into customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Management */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Share2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-heading font-bold mb-4">Social Media Management</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Strategic content creation and community building that drives real engagement
          </p>
          <div className="bg-card border border-border rounded-lg p-8">
            <p className="text-muted-foreground mb-4">
              From startup brands to established businesses, we craft social strategies that build authentic connections, 
              increase visibility, and drive measurable results across all major platforms.
            </p>
            <Button variant="hero" asChild>
              <Link to="/testimonials">See Our Success Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's discuss how our services can accelerate your growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/testimonials">View Case Studies</Link>
            </Button>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
};

export default Services;
