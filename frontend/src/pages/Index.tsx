import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { motion } from "framer-motion";
import { Brain, Sparkles, Code2, Gauge, Target, BookOpen } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Detection",
    description: "Automatically detects your task type: classification, regression, clustering, or time-series.",
  },
  {
    icon: Sparkles,
    title: "Dataset Fingerprinting",
    description: "Analyzes class imbalance, missing values, feature types, and correlations.",
  },
  {
    icon: Target,
    title: "Ranked Recommendations",
    description: "Get confidence scores, pros/cons, and expected performance for each algorithm.",
  },
  {
    icon: Code2,
    title: "Ready-to-Use Code",
    description: "Copy Python snippets to start training immediately with best practices.",
  },
  {
    icon: Gauge,
    title: "Competition Mode",
    description: "Optimized recommendations for Kaggle-style competitions with time budgets.",
  },
  {
    icon: BookOpen,
    title: "Learn Why",
    description: "Understand when and why each algorithm works best for your data.",
  },
];

const Index = () => {
  return (
    <Layout>
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Choose Right</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MalgoCAT analyzes your dataset and recommends the best algorithms
              based on proven machine learning principles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="floating-card group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card glow-border p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Perfect Algorithm?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Upload your dataset and get personalized ML algorithm recommendations
              in seconds. No more trial and error.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href="/analyzer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transition-all"
              >
                Start Analyzing
                <Sparkles className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with ML expertise. Powered by data science principles.</p>
          <p className="mt-2">© 2024 MalgoCAT. All rights reserved.</p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
