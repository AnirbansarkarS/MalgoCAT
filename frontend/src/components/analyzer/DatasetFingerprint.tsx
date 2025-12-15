import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Scale, AlertTriangle, Hash, TrendingUp, Grid3X3,
  CheckCircle2, AlertCircle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatasetStore, DatasetFingerprint as FingerprintType } from "@/store/datasetStore";

const fingerprintCards = [
  {
    id: "classImbalance",
    label: "Class Imbalance",
    icon: Scale,
    getValue: (fp: FingerprintType) => `${(fp.classImbalance.ratio * 100).toFixed(0)}%`,
    getSeverity: (fp: FingerprintType) => fp.classImbalance.severity,
    getDescription: (fp: FingerprintType) => 
      fp.classImbalance.severity === "low" 
        ? "Classes are well balanced" 
        : fp.classImbalance.severity === "medium"
        ? "Some imbalance detected"
        : "Significant imbalance - consider SMOTE",
  },
  {
    id: "missingValues",
    label: "Missing Values",
    icon: AlertTriangle,
    getValue: (fp: FingerprintType) => `${(fp.missingValueRatio * 100).toFixed(1)}%`,
    getSeverity: (fp: FingerprintType) => 
      fp.missingValueRatio < 0.05 ? "low" : fp.missingValueRatio < 0.2 ? "medium" : "high",
    getDescription: (fp: FingerprintType) => 
      fp.missingValueRatio < 0.05 
        ? "Minimal missing data" 
        : fp.missingValueRatio < 0.2
        ? "Moderate missing data"
        : "High missing data - imputation needed",
  },
  {
    id: "featureTypes",
    label: "Feature Types",
    icon: Hash,
    getValue: (fp: FingerprintType) => 
      `${fp.featureTypes.numerical}N / ${fp.featureTypes.categorical}C`,
    getSeverity: () => "low" as const,
    getDescription: (fp: FingerprintType) => 
      `${fp.featureTypes.numerical} numerical, ${fp.featureTypes.categorical} categorical features`,
  },
  {
    id: "correlation",
    label: "Correlation Strength",
    icon: TrendingUp,
    getValue: (fp: FingerprintType) => fp.correlationStrength,
    getSeverity: (fp: FingerprintType) => 
      fp.correlationStrength === "weak" ? "high" : fp.correlationStrength === "moderate" ? "medium" : "low",
    getDescription: (fp: FingerprintType) => 
      fp.correlationStrength === "weak" 
        ? "Weak feature correlations" 
        : fp.correlationStrength === "moderate"
        ? "Moderate feature correlations"
        : "Strong correlations - consider feature selection",
  },
  {
    id: "sparseness",
    label: "Sparseness",
    icon: Grid3X3,
    getValue: (fp: FingerprintType) => `${(fp.sparseness * 100).toFixed(0)}%`,
    getSeverity: (fp: FingerprintType) => 
      fp.sparseness < 0.1 ? "low" : fp.sparseness < 0.5 ? "medium" : "high",
    getDescription: (fp: FingerprintType) => 
      fp.sparseness < 0.1 
        ? "Dense feature matrix" 
        : fp.sparseness < 0.5
        ? "Moderately sparse"
        : "High sparsity - consider sparse algorithms",
  },
];

const severityIcons = {
  low: CheckCircle2,
  medium: Info,
  high: AlertCircle,
};

const severityColors = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
};

export function DatasetFingerprintPanel() {
  const { fingerprint, setFingerprint, setCurrentStep, isAnalyzing, setIsAnalyzing } = useDatasetStore();

  useEffect(() => {
    if (!fingerprint) {
      setIsAnalyzing(true);
      // Simulate analysis
      const timer = setTimeout(() => {
        const mockFingerprint: FingerprintType = {
          classImbalance: {
            ratio: Math.random() * 0.4 + 0.1,
            severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
          },
          missingValueRatio: Math.random() * 0.15,
          featureTypes: {
            numerical: Math.floor(Math.random() * 15) + 5,
            categorical: Math.floor(Math.random() * 8) + 2,
            text: Math.floor(Math.random() * 3),
          },
          correlationStrength: ["weak", "moderate", "strong"][Math.floor(Math.random() * 3)] as "weak" | "moderate" | "strong",
          sparseness: Math.random() * 0.3,
        };
        setFingerprint(mockFingerprint);
        setIsAnalyzing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fingerprint, setFingerprint, setIsAnalyzing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Dataset Fingerprint</h2>
        <p className="text-muted-foreground">
          Understanding your data characteristics
        </p>
      </div>

      {isAnalyzing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card p-4">
              <div className="skeleton-loader w-8 h-8 rounded-lg mb-3" />
              <div className="skeleton-loader w-24 h-4 mb-2" />
              <div className="skeleton-loader w-16 h-6 mb-2" />
              <div className="skeleton-loader w-full h-3" />
            </div>
          ))}
        </div>
      ) : fingerprint ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fingerprintCards.map((card, index) => {
            const severity = card.getSeverity(fingerprint);
            const SeverityIcon = severityIcons[severity];
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="floating-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <SeverityIcon className={`w-5 h-5 ${severityColors[severity]}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className="text-xl font-bold mb-2">{card.getValue(fingerprint)}</p>
                <p className="text-xs text-muted-foreground">
                  {card.getDescription(fingerprint)}
                </p>
              </motion.div>
            );
          })}
        </div>
      ) : null}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)} disabled={isAnalyzing}>
          Get Recommendations
        </Button>
      </div>
    </motion.div>
  );
}
