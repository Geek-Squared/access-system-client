import axios from "axios";
import { SetStateAction } from "react";

interface ExtractedInfo {
  lastName: string;
  firstNames: string;
  fullName: string;
  idNumber: string;
}

const extractNameInformation = (text: string): ExtractedInfo | null => {
  // First, find the ID number
  const idPattern = /\d{2}-\d{6,7}\s*[A-Z]\s*\d{2}/;
  const idMatch = text.match(idPattern);

  if (!idMatch) return null;

  // Get the text after the ID number
  const textAfterID = text
    .substring(text.indexOf(idMatch[0]) + idMatch[0].length)
    .trim();

  // Find the first date pattern (29/12/1993) to use as a boundary for names
  const datePattern = /\d{2}\/\d{2}\/\d{4}/;
  const dateMatch = textAfterID.match(datePattern);

  // If we found a date, only take the text before it
  const namesText = dateMatch
    ? textAfterID.substring(0, textAfterID.indexOf(dateMatch[0])).trim()
    : textAfterID;

  // Split the names text into words and filter out unwanted tokens
  const nameParts = namesText
    .split(/\s+/)
    .filter((part) => part.length > 1 && !["CIT", "OF", "THE"].includes(part));

  if (nameParts.length < 2) return null;

  const extractedInfo = {
    lastName: nameParts[0],
    firstNames: nameParts.slice(1).join(" "),
    fullName: `${nameParts.slice(1).join(" ")} ${nameParts[0]}`,
    idNumber: idMatch[0],
  };

  console.log("Extracted Info in function:", extractedInfo);
  return extractedInfo;
};

const analyzeImage = async (
  selectedImage: string,
  setDetectedText: (value: SetStateAction<string | null>) => void,
  callback: (extractedInfo: ExtractedInfo | null) => void
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
    console.log("cleanedText", cleanedText);
    setDetectedText(cleanedText);

    const extractedInfo = extractNameInformation(cleanedText);
    console.log("extractedInfo in analyzeImage:", extractedInfo);

    // Call the callback with the extracted info
    callback(extractedInfo);
  } catch (error) {
    console.error("Error analyzing image:", error);
    callback(null);
  }
};

export { analyzeImage, extractNameInformation, type ExtractedInfo };
