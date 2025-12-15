import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { 
  Book, Code2, Zap, HelpCircle, 
  ExternalLink, Github, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";

const docSections = [
  {
    title: "Getting Started",
    icon: Zap,
    items: [
      { title: "Quick Start Guide", description: "Upload your first dataset in 2 minutes" },
      { title: "Understanding Results", description: "How to interpret algorithm recommendations" },
      { title: "Best Practices", description: "Tips for getting accurate recommendations" },
    ],
  },
  {
    title: "Features",
    icon: Book,
    items: [
      { title: "Dataset Analysis", description: "How MalgoCAT fingerprints your data" },
      { title: "Competition Mode", description: "Kaggle-optimized recommendations" },
      { title: "Algorithm Cards", description: "Detailed breakdown of each recommendation" },
    ],
  },
  {
    title: "API Reference",
    icon: Code2,
    items: [
      { title: "REST API", description: "Integrate MalgoCAT into your workflow" },
      { title: "Python SDK", description: "Use MalgoCAT programmatically" },
      { title: "Webhooks", description: "Get notified when analysis completes" },
    ],
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    items: [
      { title: "Supported Formats", description: "CSV, Parquet, and more" },
      { title: "Data Privacy", description: "How we handle your datasets" },
      { title: "Accuracy", description: "How recommendations are generated" },
    ],
  },
];

const Docs = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Documentation
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to get the most out of MalgoCAT
            </p>
          </motion.div>

          {/* Doc Sections */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
            {docSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <a
                        href="#"
                        className="group block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? We're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="gap-2">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </Button>
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Docs;
