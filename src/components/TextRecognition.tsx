import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
// import useSWRMutation from "swr/mutation";
import CameraCapture from "./camera/Camera";
import analyzeImage from "../utils/analyzeImage";
import VisitorRegForm from "./forms/visitorRegistration/VisitorRegForm";
import "./styles.scss";
// import BarcodeScannerCamera from "./camera/BarcodeScanner";
// import updateQRCode from "../utils/updateQRCode";
import { api } from "../../convex/_generated/api";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import useFetchOrganization from "../hooks/useFetchOrg";

const TextRecognition = () => {
  const createGuest = useMutation(api.functions.mutations.visitor.addVisitor);
  const { currentUser } = useFetchCurrentUser();
  const fetchSite = useQuery(api.sites.get);
  const siteId = fetchSite?.find(
    (site: any) => site.personnel[0] === currentUser
  );
  const { organizations } = useFetchOrganization(currentUser);

  console.log("organizations11", organizations);
  const [step, setStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [_, setDetectedText] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [idNumber, setIdNumber] = useState<string | null>(null);
  // const [guestInfo, ___] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [___, setIsSubmitting] = useState<boolean>(false);
  // const [__, setBarcodes] = useState<string[]>([]);
  // const [barcodeId, setBarcodeId] = useState<string | number>("No barcode");
  const navigate = useNavigate(); // Initialize the useNavigate hook

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
    setStep(2);
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
  console.log("currentUser", currentUser);
  const handleProcessImage = () => {
    setIsLoading(true);
    setStep(3);
    analyzeImage(selectedImage, setDetectedText, extractInformation)
      .then(() => {
        setIsLoading(false);
        setStep(4);
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
        //@ts-ignore
        siteId: siteId?._id,
        name: data.name,
        id_number: data.id_number,
        visiting_reason: data.visiting_reason,
        visiting_resident: data.visiting_resident,
        on_site: true,
        phoneNumber: data.phoneNumber,
        entry_time: data.entry_time,
        exit_time: data.exit_time,
      });
      console.log("Submitted successfully", result);
      setStep(5);
    } catch (error) {
      console.error(`Error is ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 5) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [step, navigate]);

  return (
    <div className="text-recog-container">
      {step === 1 && (
        <div>
          <CameraCapture onCapture={handleImageCapture} />
        </div>
      )}

      {step === 2 && selectedImage && (
        <div>
          <h3 className="preview-text">Preview Captured Image</h3>
          <img
            src={selectedImage}
            alt="Captured"
            style={{ width: "300px", height: "auto" }}
          />
          <button className="snap-button" onClick={handleProcessImage}>
            Process Identification
          </button>
        </div>
      )}

      {step === 3 && isLoading && (
        <div>
          <h3>Processing Image...</h3>
          <div className="spinner"></div>
        </div>
      )}

      {!isLoading && step === 4 && fullName && idNumber && (
        <div>
          <VisitorRegForm
            name={fullName}
            id_number={idNumber}
            entry_time={getCurrentDateTime()}
            onSubmitOp={handleFormSubmit}
          />
        </div>
      )}

      {/* {step === 5 && !isSubmitting && (
        <BarcodeScannerCamera
          setBarcodes={setBarcodes}
          setBarcodeId={setBarcodeId}
          handleSubmit={handleSubmitQRInfo}
        />
      )} */}

      {step === 5 && (
        <div className="success-container">
          <div className="checkmark">
            <span className="checkmark-circle"></span>
            <span className="checkmark-stem"></span>
            <span className="checkmark-kick"></span>
          </div>
          <h3>Done!</h3>
          <p>Redirecting to the homepage in 3 seconds...</p>{" "}
          {/* Display message */}
        </div>
      )}
    </div>
  );
};

export default TextRecognition;
