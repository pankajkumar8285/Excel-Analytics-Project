
import ExcelUpload from "../models/upload.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateInsight = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await ExcelUpload.findById(fileId).lean();
  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  const insights = [];
  const columnDetails = [];

  for (const [colName, analysis] of Object.entries(file.columnAnalysis)) {
    const { type, nullCount, uniqueCount, sampleValues } = analysis;

    // Push to insight list
    if (type === "numeric") {
      insights.push(`📊 "${colName}" is a numeric column with ${uniqueCount} unique values.`);
    } else {
      insights.push(`🔠 "${colName}" is a categorical column with ${uniqueCount} unique values.`);
    }

    if (nullCount > 0) {
      insights.push(`⚠️ "${colName}" has ${nullCount} missing values.`);
    }

    columnDetails.push({
      name: colName,
      type,
      nullCount,
      uniqueCount,
      sampleValues: sampleValues.slice(0, 5),
    });
  }

  const summary = `✅ This dataset has ${file.totalRows} rows and ${file.totalColumns} columns with a data quality score of ${file.dataQualityScore}%.`;

  res.json({
    file: file.filename,
    summary,
    insights,
    columnDetails,
  });
});

export { generateInsight };
