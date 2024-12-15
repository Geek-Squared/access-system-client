import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CameraCapture from "./camera/Camera";
import analyzeImage from "../utils/analyzeImage";
import DynamicForm from "./forms/visitorRegistration/DynamicForm"; // Correct import
import "./styles.scss";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import useCreateVisitor from "../hooks/useSubmitForm";
import useFetchCustomForms from "../hooks/useRenderForms";

const TextRecognition = () => {
  const { user } = useFetchCurrentUser();
  const { createVisitor } = useCreateVisitor();
  const { forms } = useFetchCustomForms();

  const [step, setStep] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null); // Track selected form
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleImageCapture = (imageBase64: string) => {
    setSelectedImage(imageBase64);
    setStep(step + 1);
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
      await createVisitor(visitorDataToSubmit);
      setStep(6); // Go to success screen
    } catch (error) {
      console.error(`Error submitting form:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedForm = forms.find(
    (form: { id: number }) => form.id === selectedFormId
  );

  useEffect(() => {
    if (step === 6) {
      setTimeout(() => navigate("/"), 3000);
    }
  }, [step, navigate]);

  return (
    <div className="text-recog-container">
      {step === 0 && (
        <div className="option-container">
          <div className="option-container__actions">
            {/* Select form and go to manual entry */}
            <button
              className="option-container__button"
              onClick={() => {
                setSelectedFormId(1); // Example: select "Delivery" form
                setStep(5); // Go to DynamicForm step
              }}
            >
              Fill Delivery Form
            </button>
            <button
              className="option-container__button"
              onClick={() => {
                setSelectedFormId(2); // Example: select "Test Form"
                setStep(5);
              }}
            >
              Fill Test Form
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

      {step === 5 && selectedForm ? (
        <DynamicForm
          fields={selectedForm.fields}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        step === 5 && <p>Loading form...</p>
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
