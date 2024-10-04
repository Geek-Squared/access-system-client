import axios from "axios";
import { SetStateAction } from "react";

const analyzeImage = async (
  selectedImage: string,
  setDetectedText: {
    (value: SetStateAction<string | null>): void;
    (arg0: any): void;
  },
  extractInformation: { (text: string): void; (arg0: any): void }
) => {
  const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDR9WK20k8GYh3J-dZi27A3eOZf_do4khA`;

  const imageRequest = {
    requests: [
      {
        image: {
          content: selectedImage.split(",")[1],
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 10,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(visionApiUrl, imageRequest);
    const detectedText =
      response.data.responses[0]?.fullTextAnnotation?.text || "No text found";
    const cleanedText = detectedText.replace(/[^A-Za-z0-9\s\/-]/g, "");
    setDetectedText(cleanedText);
    extractInformation(cleanedText);
  } catch (error) {
    console.error("Error analyzing image:", error);
  }
};

export default analyzeImage;
