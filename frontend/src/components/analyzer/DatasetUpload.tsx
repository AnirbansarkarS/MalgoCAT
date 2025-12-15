import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatasetStore, DatasetInfo } from "@/store/datasetStore";
import { cn } from "@/lib/utils";

export function DatasetUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dataset, setDataset, setCurrentStep } = useDatasetStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    setError(null);
    
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be under 50MB");
      return;
    }

    // Mock dataset analysis
    const mockAnalysis: DatasetInfo = {
      filename: file.name,
      size: file.size,
      rows: Math.floor(Math.random() * 10000) + 500,
      columns: Math.floor(Math.random() * 30) + 5,
      taskType: ["classification", "regression", "clustering", "time-series"][
        Math.floor(Math.random() * 4)
      ] as DatasetInfo["taskType"],
      features: [
        "age", "income", "score", "category", "timestamp", 
        "value", "label", "feature_a", "feature_b"
      ].slice(0, Math.floor(Math.random() * 6) + 4),
    };

    setDataset(mockAnalysis);
  }, [setDataset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const taskTypeLabels = {
    classification: "Classification",
    regression: "Regression",
    clustering: "Clustering",
    "time-series": "Time Series",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Upload Your Dataset</h2>
        <p className="text-muted-foreground">
          Drop your CSV file to start the analysis
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          dataset && "border-primary/50 bg-primary/5"
        )}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {dataset ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold mb-4">{dataset.filename}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
              <div className="glass-card p-3">
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="font-medium">{formatFileSize(dataset.size)}</p>
              </div>
              <div className="glass-card p-3">
                <p className="text-xs text-muted-foreground">Rows</p>
                <p className="font-medium">{dataset.rows.toLocaleString()}</p>
              </div>
              <div className="glass-card p-3">
                <p className="text-xs text-muted-foreground">Columns</p>
                <p className="font-medium">{dataset.columns}</p>
              </div>
              <div className="glass-card p-3">
                <p className="text-xs text-muted-foreground">Task Type</p>
                <p className="font-medium text-primary">
                  {dataset.taskType ? taskTypeLabels[dataset.taskType] : "Unknown"}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold mb-2">
              {isDragging ? "Drop your file here" : "Drag and drop your CSV file"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV files up to 50MB</span>
            </div>
          </>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {dataset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <Button onClick={() => setCurrentStep(1)} size="lg">
            Continue to Problem Context
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
