import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import CameraCapture from "./camera/Camera";
import analyzeImage from "../utils/analyzeImage";
import VisitorRegForm from "./forms/visitorRegistration/VisitorRegForm";
import "./styles.scss";
import { api } from "../../convex/_generated/api";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";

const TextRecognition = () => {
  const createGuest = useMutation(api.functions.mutations.visitor.addVisitor);
  const { currentUser } = useFetchCurrentUser();
  const fetchSite = useQuery(api.sites.get);
  const siteId = fetchSite?.find(
    (site: any) => site.personnel[0] === currentUser
  );

  const [step, setStep] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [idNumber, setIdNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const [licenseRegNumber, setLicenseRegNumber] = useState<string | null>(null);
  const [vehicleMake, setVehicleMake] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string | null>(null);

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

  const extractInformation = (text: string) => {
    const idRegex = /\d{2}-\d{6,7}\s\w\s\d{2}/;
    const concatenatedNameRegex =
      /SURNAME\s*FIRST NAME\s*DATE OF BIRTH\s*([A-Z\s]+)\d{2}\/\d{2}\/\d{4}/i;
    const nameAfterCITRegex = /CIT\s?[MF]\s*([A-Z\s]+?)\s+\d{2}\/\d{2}\/\d{4}/i;
    const separatedNameRegex = /SURNAME\s+([A-Z]+)\s+FIRST NAME\s+([A-Z\s]+)/i;

    const idMatch = text.match(idRegex);
    if (idMatch) {
      setIdNumber(idMatch[0]);
    }

    const concatenatedNameMatch = text.match(concatenatedNameRegex);
    if (concatenatedNameMatch) {
      const names = concatenatedNameMatch[1].trim();
      const nameParts = names.split(/\s+/);
      if (nameParts.length >= 2) {
        const surname = nameParts[0];
        const firstName = nameParts.slice(1).join(" ");
        setFullName(`${surname} ${firstName}`);
        return;
      }
    }

    const nameAfterCITMatch = text.match(nameAfterCITRegex);
    if (nameAfterCITMatch) {
      const fullNameExtracted = nameAfterCITMatch[1].trim();
      setFullName(fullNameExtracted);
      return;
    }

    const separatedNameMatch = text.match(separatedNameRegex);
    if (separatedNameMatch) {
      const surname = separatedNameMatch[1].trim();
      const firstName = separatedNameMatch[2].trim();
      setFullName(`${firstName} ${surname}`);
      return;
    }

    console.warn("Unable to extract full name from text:", text);
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
      step === 2 ? extractInformation : extractLicenseDiskInfo;
    analyzeImage(selectedImage, setDetectedText, stepHandler)
      .then(() => {
        setIsLoading(false);
        setStep(step + 1); // Move to the next step based on current state
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await createGuest({
        security_personnel: currentUser,
        //@ts-expect-error - to fix this
        siteId: siteId?._id,
        name: data.name,
        id_number: data.id_number,
        visiting_reason: data.visiting_reason,
        visiting_resident: data.visiting_resident,
        vehicle_make: data.vehicle_make,
        license_reg_number: data.license_reg_number,
        on_site: true,
        phoneNumber: data.phoneNumber,
        entry_time: data.entry_time,
        exit_time: data.exit_time,
      });
      console.log("Submitted successfully", result);
      setStep(6);
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
        <div>
          <button onClick={() => setStep(1)}>Scan Identification</button>
          <button onClick={() => setStep(5)}>Enter Manually</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <CameraCapture onCapture={handleImageCapture} />
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
          <CameraCapture onCapture={handleImageCapture} />
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
          //@ts-expect-error - to fix this
          name={fullName}
          //@ts-expect-error - to fix this
          id_number={idNumber}
          license_reg_number={licenseRegNumber}
          vehicle_make={vehicleMake}
          //@ts-expect-error - to fix this
          expiry_date={expiryDate}
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
