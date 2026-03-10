import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaImage, FaCar, FaCalendarAlt, FaCogs, FaStar } from "react-icons/fa";

const API = "http://localhost:3000/api";

const CarImageAnalyzer = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [parsedData, setParsedData] = useState(null);

  const parseAnalysisResult = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const data = {
      rawLines: [],
    };

    lines.forEach((line) => {
      const trimmed = line.trim().replace(/^[-•]\s*/, "");
      data.rawLines.push(trimmed);

      if (trimmed.toLowerCase().includes("brand")) {
        const match = trimmed.match(/brand[:\s]+(.+?)(?:\n|$)/i);
        data.brand = match ? match[1].trim() : trimmed;
      } else if (trimmed.toLowerCase().includes("model")) {
        const match = trimmed.match(/model[:\s]+(.+?)(?:\n|$)/i);
        data.model = match ? match[1].trim() : trimmed;
      } else if (trimmed.toLowerCase().includes("year")) {
        const match = trimmed.match(/year[:\s]+(.+?)(?:\n|$)/i);
        data.year = match ? match[1].trim() : trimmed;
      } else if (trimmed.toLowerCase().includes("body type")) {
        const match = trimmed.match(/body\s+type[:\s]+(.+?)(?:\n|$)/i);
        data.bodyType = match ? match[1].trim() : trimmed;
      } else if (
        trimmed.toLowerCase().includes("features") ||
        trimmed.toLowerCase().includes("notable")
      ) {
        const match = trimmed.match(/features?[:\s]+(.+?)(?:\n|$)/i);
        data.features = match ? match[1].trim() : trimmed;
      }
    });

    return data;
  };

  const analyzeImage = async (dataUrl, mimeType) => {
    setLoading(true);
    setError("");
    setResult("");
    setParsedData(null);

    try {
      const res = await axios.post(`${API}/analyze-car-image`, {
        imageData: dataUrl,
        mimeType,
      });
      const description =
        res.data.description || "No details found for this image.";
      setResult(description);
      setParsedData(parseAnalysisResult(description));
    } catch (err) {
      console.error("Error analyzing image", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to analyze image.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type - only allow common image formats
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const fileType = file.type.toLowerCase();

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (!allowedTypes.includes(fileType)) {
      setError("Unsupported image format. Please use JPEG, PNG, or WebP.");
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("Image is too large. Please use an image smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      analyzeImage(dataUrl, file.type);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handlePasteEvent = useCallback(
    (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        const itemType = item.type.toLowerCase();
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (item.type.startsWith("image/") && allowedTypes.includes(itemType)) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    },
    [], // handleFile does not change
  );

  useEffect(() => {
    window.addEventListener("paste", handlePasteEvent);
    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [handlePasteEvent]);

  return (
    <div className="mt-6 max-w-5xl mx-auto px-4">
      <div
        className={`relative border-2 border-dashed rounded-2xl px-4 py-5 sm:px-6 sm:py-6 bg-zinc-900/70 backdrop-blur-sm transition ${
          isDragging
            ? "border-emerald-400 bg-emerald-500/5"
            : "border-zinc-700/80 hover:border-emerald-500/60"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex-shrink-0">
            <FaImage className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm sm:text-base font-medium text-zinc-100">
              Drag & drop or paste a car image
            </p>
            <p className="text-xs sm:text-sm text-zinc-400">
              Drop an image of a car here or copy & paste it (Ctrl + V).
              Supports JPEG, PNG, and WebP formats. Gemini AI will try to
              identify the car and describe key details.
            </p>
          </div>
        </div>

        {preview && (
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="sm:w-48 w-full">
              <img
                src={preview}
                alt="Uploaded car"
                className="w-full h-32 sm:h-40 object-cover rounded-xl border border-zinc-700"
              />
            </div>
            <div className="flex-1">
              {loading && (
                <p className="text-sm text-zinc-300">Analyzing image...</p>
              )}
              {!loading && result && (
                <>
                  {(parsedData?.brand ||
                    parsedData?.model ||
                    parsedData?.year ||
                    parsedData?.bodyType ||
                    parsedData?.features) && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 space-y-3 mb-3">
                      {parsedData.brand && (
                        <div className="flex items-center gap-2">
                          <FaCar className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-zinc-300">Brand:</span>
                          <span className="text-sm text-zinc-100 font-medium">
                            {parsedData.brand}
                          </span>
                        </div>
                      )}
                      {parsedData.model && (
                        <div className="flex items-center gap-2">
                          <FaCar className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-zinc-300">Model:</span>
                          <span className="text-sm text-zinc-100 font-medium">
                            {parsedData.model}
                          </span>
                        </div>
                      )}
                      {parsedData.year && (
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-zinc-300">Year:</span>
                          <span className="text-sm text-zinc-100 font-medium">
                            {parsedData.year}
                          </span>
                        </div>
                      )}
                      {parsedData.bodyType && (
                        <div className="flex items-center gap-2">
                          <FaCogs className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-zinc-300">
                            Body Type:
                          </span>
                          <span className="text-sm text-zinc-100 font-medium">
                            {parsedData.bodyType}
                          </span>
                        </div>
                      )}
                      {parsedData.features && (
                        <div className="flex items-center gap-2">
                          <FaStar className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-zinc-300">
                            Features:
                          </span>
                          <span className="text-sm text-zinc-100 font-medium">
                            {parsedData.features}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-sm text-zinc-200 whitespace-pre-wrap bg-zinc-900/70 border border-zinc-700 rounded-xl px-3 py-2">
                    {result}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 text-xs sm:text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};

export default CarImageAnalyzer;
