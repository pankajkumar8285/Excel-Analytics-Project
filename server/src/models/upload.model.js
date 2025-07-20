import mongoose from 'mongoose';

const columnAnalysisSchema = new mongoose.Schema({
  type: String, // "numeric" or "categorical"
  nullCount: Number,
  uniqueCount: Number,
  sampleValues: [mongoose.Schema.Types.Mixed],
});

const excelUploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  totalRows: Number,
  totalColumns: Number,
  columns: [String],
  dataPreview: [mongoose.Schema.Types.Mixed], // First 10 rows
  columnAnalysis: {
    type: Map,
    of: columnAnalysisSchema,
  },
  dataQualityScore: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ExcelUpload", excelUploadSchema);
