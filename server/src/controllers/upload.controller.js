import XLSX from "xlsx";
import fs from "fs";
import ExcelUpload from "../models/upload.model.js";
import moment from "moment";

// Detect column type
const getColumnType = (values) => {
  const numericCount = values.filter((v) => typeof v === "number").length;
  const total = values.length;
  return numericCount / total > 0.6 ? "numeric" : "categorical";
};

// Upload and analyze Excel file
const uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const columns = Object.keys(jsonData[0]);
    const totalRows = jsonData.length;
    const columnAnalysis = {};

    columns.forEach((col) => {
      const values = jsonData.map((row) => row[col]).filter((v) => v !== undefined);
      const nullCount = totalRows - values.length;
      const uniqueValues = [...new Set(values)];
      const type = getColumnType(values);

      columnAnalysis[col] = {
        type,
        nullCount,
        uniqueCount: uniqueValues.length,
        sampleValues: values.slice(0, 5),
      };
    });

    const dataPreview = jsonData.slice(0, 10);

    const totalCells = totalRows * columns.length;
    const nullCells = Object.values(columnAnalysis).reduce((sum, col) => sum + col.nullCount, 0);
    const dataQualityScore = ((totalCells - nullCells) / totalCells * 100).toFixed(2);

    const uploadDoc = new ExcelUpload({
      filename: req.file.originalname,
      uploadedBy: req.user?._id || null, // ✅ associates file with user
      totalRows,
      totalColumns: columns.length,
      columns,
      dataPreview,
      columnAnalysis,
      dataQualityScore,
    });

    await uploadDoc.save();
    fs.unlinkSync(filePath); // Clean up uploaded file

    res.status(200).json({
      success: true,
      message: "File uploaded and parsed successfully.",
      metadata: {
        totalRows,
        totalColumns: columns.length,
        columns,
        columnAnalysis,
        dataQualityScore,
      },
      dataPreview,
    });
  } catch (err) {
    console.error("Error parsing file:", err);
    res.status(500).json({ success: false, message: "Parsing failed" });
  }
};

// Get summary stats for current user's files
const getFileStats = async (req, res) => {
  const userId = req.user._id;
  const todayStart = moment().startOf("day").toDate();
  const weekStart = moment().startOf("isoWeek").toDate();

  const totalFiles = await ExcelUpload.countDocuments({ uploadedBy: userId });
  const todayFiles = await ExcelUpload.countDocuments({
    uploadedBy: userId,
    createdAt: { $gte: todayStart },
  });
  const thisWeekFiles = await ExcelUpload.countDocuments({
    uploadedBy: userId,
    createdAt: { $gte: weekStart },
  });

  const recentFilesCounts = await ExcelUpload.find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .countDocuments();

  const largeFileCount = await ExcelUpload.find({ uploadedBy: userId })
    .sort({ fileSize: -1 })
    .limit(5)
    .countDocuments();

  const largestFiles = await ExcelUpload.find({ uploadedBy: userId })
    .sort({ fileSize: -1 })
    .limit(5);

  res.json({
    totalFiles,
    recentFilesCounts,
    largeFileCount,
    todayFiles,
    thisWeekFiles,
    largestFiles,
  });
};

// Get recent file activity for current user
const getRecentActivity = async (req, res) => {
  const userId = req.user._id;

  const recentFiles = await ExcelUpload.find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .limit(5);
  const recent = await ExcelUpload.find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ recent, recentFiles });
};

const getUploadHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = await ExcelUpload.find({ uploadedBy: userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, files });
  } catch (err) {
    console.error("Error fetching upload history:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




const getUploadsPerDay = async (req, res) => {
  const sevenDaysAgo = moment().subtract(6, 'days').startOf('day');

  const uploads = await ExcelUpload.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo.toDate() },
        ...(req.user && { uploadedBy: req.user._id }) // user-specific
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(uploads);
};




export { uploadExcel, getFileStats, getRecentActivity, getUploadHistory,getUploadsPerDay };
