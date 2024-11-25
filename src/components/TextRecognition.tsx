import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CameraCapture from "./camera/Camera";
import analyzeImage from "../utils/analyzeImage";
import VisitorRegForm from "./forms/visitorRegistration/VisitorRegForm";
import "./styles.scss";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import useCreateVisitor from "../hooks/useCreateVisitor";

const TextRecognition = () => {
  const { user } = useFetchCurrentUser();
  const { createVisitor } = useCreateVisitor();

  const [step, setStep] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [idNumber, setIdNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const [licenseRegNumber, setLicenseRegNumber] = useState<string | null>(null);
  const [vehicleMake, setVehicleMake] = useState<string | null>(null);
  const [_, setExpiryDate] = useState<string | null>(null);
  const [__, setDetectedText] = useState<string | null>(null);
  console.log("user", user);
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleImageCapture = (imageBase64: string) => {
    setSelectedImage(imageBase64);
    setStep(step + 1);
  };

  const extractInformationFromLicense = (text: string) => {
    // List of unwanted keywords to filter out from the detected text
    const unwantedKeywords = [
      "Signature",
      "Special Condition",
      "Com",
      "Nice",
      "Regin",
      "Car",
      "Bark",
      "Road Traffic",
      "Chapter",
      "Ced",
      "Many",
      "Condition",
      "of",
      "Zimbabwe",
      "Drivers",
      "Licence",
    ];

    // Step 1: Filter out unwanted keywords from the detected text
    let cleanedText = text;
    unwantedKeywords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleanedText = cleanedText.replace(regex, "");
    });

    // Step 2: Regex to match a full name, assuming it can be in the form of:
    // - FirstName MiddleName Surname
    // - Surname FirstName MiddleName
    const nameRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;

    // Step 3: Regex to match ID numbers with alphanumeric characters and digits
    const idNumberRegex =
      /\b(\d{2,}-\d{5,}|\d+[A-Z]+\s+\d+-\d+|\d+-\d+\s\d+|\d+[A-Z]+\d+)\b/;

    const nameMatches = cleanedText.match(nameRegex);
    const idMatch = cleanedText.match(idNumberRegex);

    // If names are found, determine the correct order (First name followed by surname)
    if (nameMatches && nameMatches.length >= 1) {
      // Assuming the last matched name part is the surname, reorder accordingly
      const orderedName = nameMatches.join(" ").split(/\s+/);
      const surname = orderedName.pop(); // Assuming the last word is the surname
      const fullName = `${surname} ${orderedName.join(" ")}`;
      setFullName(fullName.trim());
    } else {
      console.warn("Unable to extract full name from text:", text);
    }

    // If we found an ID number match
    if (idMatch) {
      setIdNumber(idMatch[0]);
    } else {
      console.warn("Unable to extract ID number from text:", text);
    }
  };

  const extractLicenseDiskInfo = (text: string) => {
    const regNumberRegex = /Reg no\s+([A-Z0-9]+)/i;
    const makeRegex = /NISSAN|TOYOTA|FORD|HONDA/i;
    const expiryDateRegex = /\d{2}\/\d{2}\/\d{4}/;

    const regMatch = text.match(regNumberRegex);
    if (regMatch) {
      setLicenseRegNumber(regMatch[1]);
    }

    const makeMatch = text.match(makeRegex);
    if (makeMatch) {
      setVehicleMake(makeMatch[0]);
    }

    const expiryMatch = text.match(expiryDateRegex);
    if (expiryMatch) {
      setExpiryDate(expiryMatch[0]);
    }
  };

  const handleProcessImage = () => {
    setIsLoading(true);
    const stepHandler =
      step === 2 ? extractInformationFromLicense : extractLicenseDiskInfo;
    analyzeImage(selectedImage, setDetectedText, stepHandler)
      .then(() => {
        setIsLoading(false);
        setStep(step + 1);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    const visitorDataToSubmit = {
      security_personnel: user,
      siteId: user?.sitesId,
      name: data.name,
      userId: user?.id,
      idNumber: data.id_number,
      visitingReason: data.visiting_reason,
      visiting: data.visiting_resident,
      vehicleMake: data.vehicle_make,
      vehiclePlate: data.license_reg_number,
      onSite: true,
      phone: data.phoneNumber,
      entryTime: new Date(data.entry_time).toISOString(),
      exitTime: data.exit_time
        ? new Date(data.exit_time).toISOString()
        : undefined,
    };
    try {
      setStep(6);
      createVisitor(visitorDataToSubmit);
    } catch (error) {
      console.error(`Error is ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 6) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [step, navigate]);

  return (
    <div className="text-recog-container">
      {step === 0 && (
        <div className="option-container">
        <div className="option-container__actions">
          <button className="option-container__button" onClick={() => setStep(1)}>
            Scan Identification
          </button>
          <button className="option-container__button" onClick={() => setStep(5)}>
            Enter Manually
          </button>
        </div>
      </div>
      )}

      {step === 1 && (
        <div>
          <CameraCapture
            title="Identification"
            onCapture={handleImageCapture}
          />
        </div>
      )}

      {step === 2 && selectedImage && (
        <div>
          <h3 className="preview-text">Preview Captured ID Image</h3>
          <img src={selectedImage} alt="Captured" style={{ width: "300px" }} />
          <button onClick={handleProcessImage}>
            {isLoading ? "Processing..." : "Process Identification"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <CameraCapture
            title="Car Registration"
            onCapture={handleImageCapture}
          />
        </div>
      )}

      {step === 4 && selectedImage && (
        <div>
          <h3 className="preview-text">Preview Captured License Disk Image</h3>
          <img
            src={selectedImage}
            alt="Captured License Disk"
            style={{ width: "300px" }}
          />
          <button onClick={handleProcessImage}>
            {isLoading ? "Processing..." : "Process License Disk"}
          </button>
        </div>
      )}

      {step === 5 && (
        <VisitorRegForm
          //@ts-expect-error
          name={fullName}
          //@ts-expect-error
          id_number={idNumber}
          license_reg_number={licenseRegNumber}
          vehicle_make={vehicleMake}
          entry_time={getCurrentDateTime()}
          onSubmitOp={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {step === 6 && (
        <div className="success-container">
          <h3>Done!</h3>
          <p>Redirecting to the homepage in 3 seconds...</p>
        </div>
      )}
    </div>
  );
};

export default TextRecognition;
