import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, ThumbsUp, ThumbsDown, Copy, Check, X,
  ChevronDown, Sparkles, AlertTriangle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatasetStore, AlgorithmRecommendation } from "@/store/datasetStore";
import { cn } from "@/lib/utils";

const mockRecommendations: AlgorithmRecommendation[] = [
  {
    name: "XGBoost",
    confidence: 94,
    pros: ["Excellent accuracy on tabular data", "Handles missing values", "Built-in regularization"],
    cons: ["Can overfit on small datasets", "Many hyperparameters to tune"],
    performanceRange: { min: 0.89, max: 0.96 },
    explanation: "XGBoost is recommended because your dataset has a mix of numerical and categorical features with moderate size. Its gradient boosting approach excels at capturing complex feature interactions while the built-in regularization prevents overfitting.",
    whenItFails: "May struggle with very high-dimensional sparse data or when interpretability is critical. Consider simpler models if you need to explain predictions to stakeholders.",
    pythonCode: `from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split

# Initialize and train
model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)

# Evaluate
score = model.score(X_test, y_test)
print(f"Accuracy: {score:.4f}")`,
    isBestFit: true,
  },
  {
    name: "Random Forest",
    confidence: 88,
    pros: ["Robust to outliers", "Feature importance built-in", "Less prone to overfitting"],
    cons: ["Slower inference", "Large model size"],
    performanceRange: { min: 0.85, max: 0.92 },
    explanation: "Random Forest provides a good balance between accuracy and interpretability. It's particularly robust to noise and outliers in your dataset.",
    whenItFails: "May underperform on very high-dimensional data or when feature interactions are crucial. Not ideal for real-time inference with strict latency requirements.",
    pythonCode: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Accuracy: {score:.4f}")`,
    isBestFit: false,
  },
  {
    name: "LightGBM",
    confidence: 85,
    pros: ["Very fast training", "Memory efficient", "Great for large datasets"],
    cons: ["Sensitive to overfitting on small data", "Less intuitive parameters"],
    performanceRange: { min: 0.84, max: 0.93 },
    explanation: "LightGBM offers exceptional speed and efficiency, making it ideal for rapid experimentation and large-scale deployments.",
    whenItFails: "Can overfit on small datasets. May require careful tuning of leaf-wise growth parameters.",
    pythonCode: `import lightgbm as lgb
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

train_data = lgb.Dataset(X_train, label=y_train)
params = {
    'objective': 'binary',
    'metric': 'auc',
    'num_leaves': 31
}

model = lgb.train(params, train_data, num_boost_round=100)
predictions = model.predict(X_test)`,
    isBestFit: false,
  },
  {
    name: "Logistic Regression",
    confidence: 72,
    pros: ["Highly interpretable", "Fast training", "No hyperparameter tuning needed"],
    cons: ["Limited to linear boundaries", "May underfit complex patterns"],
    performanceRange: { min: 0.75, max: 0.82 },
    explanation: "Logistic Regression provides a strong baseline with excellent interpretability. Useful when you need to explain model decisions.",
    whenItFails: "Will struggle with non-linear relationships and complex feature interactions. Consider as a baseline, not the final model.",
    pythonCode: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

model = LogisticRegression(max_iter=1000, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Accuracy: {score:.4f}")`,
    isBestFit: false,
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="code-block text-xs overflow-x-auto">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}

function AlgorithmCard({ recommendation, index }: { recommendation: AlgorithmRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: recommendation.isBestFit ? [1, 1.02, 1] : 1,
      }}
      transition={{
        delay: index * 0.1,
        scale: {
          duration: 2,
          repeat: recommendation.isBestFit ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
      className={cn(
        "glass-card overflow-hidden transition-all",
        recommendation.isBestFit && "glow-border border-primary/50 shadow-lg shadow-primary/20"
      )}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {recommendation.isBestFit && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Trophy className="w-3 h-3" />
                Best Fit
              </div>
            )}
            <h3 className="text-lg font-bold">{recommendation.name}</h3>
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>

        {/* Confidence Score */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium text-primary">{recommendation.confidence}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${recommendation.confidence}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                recommendation.confidence >= 90
                  ? "bg-success"
                  : recommendation.confidence >= 75
                    ? "bg-primary"
                    : "bg-warning"
              )}
            />
          </div>
        </div>

        {/* Performance Range */}
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Expected:</span>
          <span className="font-medium">
            {(recommendation.performanceRange.min * 100).toFixed(0)}% - {(recommendation.performanceRange.max * 100).toFixed(0)}%
          </span>
        </div>

        {/* Pros & Cons Summary */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-success" /> Pros
            </p>
            <ul className="space-y-1">
              {recommendation.pros.slice(0, 2).map((pro) => (
                <li key={pro} className="text-xs text-muted-foreground">• {pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <ThumbsDown className="w-3 h-3 text-destructive" /> Cons
            </p>
            <ul className="space-y-1">
              {recommendation.cons.slice(0, 2).map((con) => (
                <li key={con} className="text-xs text-muted-foreground">• {con}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border/50"
          >
            <div className="p-4 space-y-4">
              {/* Explanation */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Why This Algorithm?
                </h4>
                <p className="text-sm text-muted-foreground">{recommendation.explanation}</p>
              </div>

              {/* When It Fails */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  When It Might Struggle
                </h4>
                <p className="text-sm text-muted-foreground">{recommendation.whenItFails}</p>
              </div>

              {/* Code Sample */}
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Start Code</h4>
                <CodeBlock code={recommendation.pythonCode} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AlgorithmRecommendations() {
  const {
    recommendations, setRecommendations, setCurrentStep, isAnalyzing, setIsAnalyzing,
    analysisResults, dataset, setTips, tips
  } = useDatasetStore();

  const [benchmarkResults, setBenchmarkResults] = useState<any[] | null>(null);

  useEffect(() => {
    // If we have analysis results but no recommendations, fetch them
    if (analysisResults && recommendations.length === 0 && !isAnalyzing) {
      const fetchRecommendations = async () => {
        try {
          setIsAnalyzing(true);
          const response = await fetch("http://localhost:8000/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              analysis: analysisResults,
              filename: dataset?.filename || "unknown.csv"
            }),
          });

          if (!response.ok) throw new Error("Failed to get recommendations");

          const data = await response.json();

          // Map backend response to Frontend model
          const mappedRecs: AlgorithmRecommendation[] = (data.recommendations || []).map((rec: any, index: number) => ({
            name: rec.algorithm,
            confidence: Math.round(rec.score), // Score is 0-100
            pros: rec.reasons || [], // Backend reasons
            cons: [], // Backend doesn't define cons dynamically yet, use static or empty
            performanceRange: { min: rec.score / 100 * 0.9, max: rec.score / 100 * 1.0 }, // Mock range based on score
            explanation: rec.explanation,
            whenItFails: "Consult documentation for specific edge cases.",
            pythonCode: `# Implementation for ${rec.algorithm}\nfrom sklearn import ...\n# Todo: Generate specific code`,
            isBestFit: index === 0,
            timeEstimate: (data.time_estimates && data.time_estimates[rec.algorithm]) || "Unknown"
          }));

          setRecommendations(mappedRecs);
          setTips(data.tips || []);

        } catch (error) {
          console.error(error);
          // Fallback to mock if failed? Or show error
        } finally {
          setIsAnalyzing(false);
        }
      };

      fetchRecommendations();
    }
  }, [analysisResults, recommendations, dataset, isAnalyzing, setRecommendations, setIsAnalyzing, setTips]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Algorithm Recommendations</h2>
        <p className="text-muted-foreground">
          Ranked by fit for your dataset and goals
        </p>

        {/* Competition Tips */}
        {tips && tips.length > 0 && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg max-w-2xl mx-auto text-left">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-warning" />
              Competition Insider Tips
            </h3>
            <ul className="space-y-1">
              {tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isAnalyzing ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="skeleton-loader w-16 h-6 rounded-full" />
                <div className="skeleton-loader w-32 h-6" />
              </div>
              <div className="skeleton-loader w-full h-2 rounded-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton-loader w-full h-16" />
                <div className="skeleton-loader w-full h-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <AlgorithmCard key={rec.name} recommendation={rec} index={index} />
          ))}
        </div>
      )}


      <div className="flex flex-col gap-4 mt-8">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setCurrentStep(2)}>
            Back to Fingerprint
          </Button>

          <Button
            onClick={async () => {
              setIsAnalyzing(true);
              try {
                // Better target column strategy
                const targetCol = analysisResults?.target_analysis?.name ||
                  (analysisResults?.columns ? analysisResults.columns[analysisResults.columns.length - 1] : "target");

                const response = await fetch("http://localhost:8000/benchmark", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    filename: dataset?.filename || "unknown.csv",
                    target_col: targetCol,
                    recommmendations: recommendations.map(r => ({ algorithm: r.name }))
                  }),
                });

                if (!response.ok) {
                  const err = await response.json();
                  throw new Error(err.detail || "Benchmark Failed");
                }

                const data = await response.json();
                setBenchmarkResults(data.results);
              } catch (e: any) {
                console.error(e);
                alert(`Benchmark Failed: ${e.message}`);
              }
              setIsAnalyzing(false);
            }}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {isAnalyzing ? "Running Benchmark..." : "Run Benchmark"}
          </Button>

          <Button variant="outline" onClick={() => {
            const { reset } = useDatasetStore.getState();
            reset();
          }}>
            Start New Analysis
          </Button>
        </div>

        {/* Benchmark Results Table */}
        {benchmarkResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card p-4 overflow-hidden"
          >
            <h3 className="font-bold mb-4">Benchmark Results</h3>
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-2 px-4 text-left font-medium">Algorithm</th>
                  <th className="py-2 px-4 text-left font-medium">Metric</th>
                  <th className="py-2 px-4 text-left font-medium">Value</th>
                  <th className="py-2 px-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkResults.map((res: any, i: number) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="py-2 px-4 font-medium">{res.Algorithm}</td>
                    <td className="py-2 px-4">{res.Metric}</td>
                    <td className="py-2 px-4 font-bold">{typeof res.Value === 'number' ? res.Value.toFixed(4) : res.Value}</td>
                    <td className={cn("py-2 px-4", res.Status === "Success" ? "text-green-500" : "text-red-500")}>
                      {res.Status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

    </motion.div>
  );
}
