const analyzeCarImage = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message:
          "GEMINI_API_KEY is not configured on the server. Please add it to your .env file.",
      });
    }

    const { imageData, mimeType } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ message: "imageData is required." });
    }

    // Extract base64 and mime type
    let base64Data = imageData;
    let resolvedMime = mimeType || "image/jpeg";

    const match = imageData.match(/^data:(.+);base64,(.+)$/);
    if (match) {
      resolvedMime = match[1];
      base64Data = match[2];
    }

    // Validate image type - only support common formats
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(resolvedMime.toLowerCase())) {
      return res.status(400).json({
        message: `Unsupported image type: ${resolvedMime}. Please use JPEG, PNG, or WebP format.`,
      });
    }

    // Normalize JPEG mime type
    if (resolvedMime.toLowerCase() === "image/jpg") {
      resolvedMime = "image/jpeg";
    }

    // Validate base64 data exists
    if (!base64Data || base64Data.length === 0) {
      return res.status(400).json({
        message: "Invalid image data. Please ensure the image is properly encoded.",
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "You are a car expert. Analyze this car image and return concise details: brand, model (or closest guess), approximate year range, body type (SUV/sedan/hatchback/etc.), and 2-3 notable features. Respond in 3-6 short bullet points.",
                },
                {
                  inline_data: {
                    mime_type: resolvedMime,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse Gemini API response:", parseError);
      return res.status(500).json({
        message: "Invalid response from Gemini API. Please try again.",
      });
    }

    if (!response.ok) {
      console.error("Gemini API error:", data);
      const errorMsg = data.error?.message || `API returned status ${response.status}`;
      return res.status(response.status >= 400 && response.status < 500 ? response.status : 500).json({
        message: `Gemini API error: ${errorMsg}`,
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("\n")
        .trim() || "";

    if (!text) {
      return res.status(500).json({
        message: "Gemini API did not return any description. Please try with a different image.",
      });
    }

    return res.json({
      description: text,
    });
  } catch (error) {
    console.error("analyzeCarImage error:", error);
    return res.status(500).json({
      message: error.message || "Server error while analyzing image. Please try again.",
    });
  }
};

module.exports = { analyzeCarImage };
