import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Timer, Target, Zap, Wrench, Code2, Lightbulb,
  ChevronRight, Trophy, TrendingUp, Settings2, Copy, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DatasetUpload } from "@/components/analyzer/DatasetUpload";
import { useDatasetStore } from "@/store/datasetStore";

interface CompetitionPlan {
  baseline: { model: string; expectedScore: string; time: string; code: string };
  advanced: { model: string; expectedScore: string; time: string; code: string };
  featureEngineering: string[];
  hyperparameters: { param: string; range: string; tip: string }[];
}

const timeBudgets = [
  { id: "5min", label: "5 min", description: "Quick baseline" },
  { id: "30min", label: "30 min", description: "Standard run" },
  { id: "2hrs", label: "2 hrs", description: "Full optimization" },
];

const metrics = [
  { id: "accuracy", label: "Accuracy" },
  { id: "f1", label: "F1 Score" },
  { id: "auc", label: "AUC-ROC" },
  { id: "rmse", label: "RMSE" },
  { id: "mae", label: "MAE" },
  { id: "log_loss", label: "Log Loss" },
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
      <pre className="code-block text-xs overflow-x-auto max-h-64">
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

const Competition = () => {
  const [timeBudget, setTimeBudget] = useState("30min");
  const [metric, setMetric] = useState("auc");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<CompetitionPlan | null>(null);

  const { analysisResults, dataset } = useDatasetStore();

  /* 
   * NEW STATE FOR BENCHMARK
   */
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<any[] | null>(null);

  const handleGeneratePlan = async () => {
    if (!analysisResults) {
      alert("Please upload and analyze a dataset first!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/competition/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis: analysisResults,
          filename: dataset?.filename || "unknown.csv"
        })
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setPlan(data);
      setShowResults(true);
    } catch (e) {
      console.error(e);
      alert("Failed to generate plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunBenchmark = async () => {
    if (!dataset || !plan) return;
    setIsBenchmarking(true);
    try {
      // Construct recommendations list from plan
      // We know plan has baseline.model and advanced.model (names)
      const recs = [
        { algorithm: plan.baseline.model },
        { algorithm: plan.advanced.model }
      ];

      const response = await fetch("http://localhost:8000/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: dataset.filename,
          target_col: analysisResults.target_analysis?.name || analysisResults.columns[analysisResults.columns.length - 1], // fallback to checking analysis or last col
          recommmendations: recs
        })
      });

      if (!response.ok) throw new Error("Benchmark Failed");
      const data = await response.json();
      setBenchmarkResults(data.results);
    } catch (e) {
      console.error(e);
      alert("Benchmark failed.");
    } finally {
      setIsBenchmarking(false);
    }
  };

  // If no dataset, show upload
  if (!dataset && !analysisResults) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] py-12">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-4">
                <Trophy className="w-4 h-4" />
                Competition Mode
              </div>
              <h1 className="text-3xl font-bold mb-2">Upload Competition Dataset</h1>
              <p className="text-muted-foreground">Upload your train.csv to generate a winning strategy.</p>
            </motion.div>

            <div className="max-w-xl mx-auto">
              <DatasetUpload />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-4">
              <Trophy className="w-4 h-4" />
              Competition Mode
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Kaggle-Ready Playbook
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get a competition-optimized strategy with baseline, advanced models,
              and winning feature engineering tips.
            </p>
          </motion.div>

          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="glass-card p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Time Budget */}
                <div>
                  <label className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-primary" />
                    Time Budget
                  </label>
                  <div className="flex gap-2">
                    {timeBudgets.map((budget) => (
                      <button
                        key={budget.id}
                        onClick={() => setTimeBudget(budget.id)}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-lg border transition-all text-center",
                          timeBudget === budget.id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-muted-foreground/50 text-muted-foreground"
                        )}
                      >
                        <p className="font-medium">{budget.label}</p>
                        <p className="text-xs mt-1">{budget.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metric */}
                <div>
                  <label className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Optimization Metric
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {metrics.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMetric(m.id)}
                        className={cn(
                          "px-3 py-2 rounded-lg border transition-all text-sm",
                          metric === m.id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-muted-foreground/50 text-muted-foreground"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleGeneratePlan}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Plan...
                  </>
                ) : (
                  <>
                    Generate Competition Plan
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          {showResults && plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Baseline Model */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-bold">Fast Baseline</h3>
                    <p className="text-sm text-muted-foreground">Get on the leaderboard quickly</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-muted-foreground">Expected Score</p>
                    <p className="text-lg font-bold text-info">{plan.baseline.expectedScore}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">Model: </span>
                  <span className="text-sm font-medium">{plan.baseline.model}</span>
                  <span className="text-xs text-muted-foreground ml-4">({plan.baseline.time})</span>
                </div>
                <CodeBlock code={plan.baseline.code} />
              </div>

              {/* Advanced Model */}
              <div className="glass-card p-6 glow-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Advanced Ensemble</h3>
                    <p className="text-sm text-muted-foreground">Push for top positions</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-muted-foreground">Expected Score</p>
                    <p className="text-lg font-bold text-primary">{plan.advanced.expectedScore}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">Model: </span>
                  <span className="text-sm font-medium">{plan.advanced.model}</span>
                  <span className="text-xs text-muted-foreground ml-4">({plan.advanced.time})</span>
                </div>
                <CodeBlock code={plan.advanced.code} />
              </div>

              {/* Benchmarking Section */}
              <div className="glass-card p-6 border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Real-time Benchmark</h3>
                    <p className="text-sm text-muted-foreground">Train and evaluate these models on your data right now.</p>
                  </div>
                  <Button onClick={handleRunBenchmark} disabled={isBenchmarking}>
                    {isBenchmarking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Code2 className="w-4 h-4 mr-2" />}
                    {isBenchmarking ? "Training..." : "Run Benchmark"}
                  </Button>
                </div>

                {benchmarkResults && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden rounded-lg border border-border bg-background"
                  >
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

              {/* Feature Engineering */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Feature Engineering Ideas</h3>
                    <p className="text-sm text-muted-foreground">Boost your score with better features</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {plan.featureEngineering.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Lightbulb className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Hyperparameter Hints */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-bold">Hyperparameter Tuning Guide</h3>
                    <p className="text-sm text-muted-foreground">Key parameters to optimize</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium">Parameter</th>
                        <th className="text-left py-2 font-medium">Range</th>
                        <th className="text-left py-2 font-medium">Tip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.hyperparameters.map((hp) => (
                        <tr key={hp.param} className="border-b border-border/50">
                          <td className="py-2 font-mono text-primary">{hp.param}</td>
                          <td className="py-2 text-muted-foreground">{hp.range}</td>
                          <td className="py-2 text-muted-foreground">{hp.tip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Competition;
