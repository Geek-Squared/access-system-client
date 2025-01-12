import { FC, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { analyzeImage, ExtractedInfo } from "../../../utils/analyzeImage";
import CameraCapture from "../../camera/Camera";
import "./styles.scss";

type FieldOption = {
  value: string | number;
  label: string;
};

type Field = {
  id: number;
  name: string;
  type: string;
  required: boolean;
  useScanner?: boolean;
  options?: FieldOption[];
  categoryId?: number;
};

interface IDynamicFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const DynamicForm: FC<IDynamicFormProps> = ({
  fields,
  onSubmit,
  isSubmitting,
}) => {
  const [searchParams] = useSearchParams();
  const formType = searchParams.get("type");

  const [step, setStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detectedText, setDetectedText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  // Simple field filtering based on URL parameter
  const filteredFields = fields.filter((field) => {
    const fieldNameLower = field.name.toLowerCase();
    const isExitField =
      fieldNameLower.includes("exit") ||
      fieldNameLower.includes("timeout") ||
      fieldNameLower.includes("time out");

    return formType === "exit" ? isExitField : !isExitField;
  });

  // Auto-fill current time for the appropriate fields
  useEffect(() => {
    filteredFields.forEach((field) => {
      if (field.type === "DATE") {
        const currentDateTime = new Date().toISOString().slice(0, 16);
        setValue(field.name, currentDateTime);
      }
    });
  }, [setValue, filteredFields]);

  const hasScanner = filteredFields.some((field) => field.useScanner);

  const handleImageCapture = async (imageBase64: string) => {
    setSelectedImage(imageBase64);
    setIsLoading(true);
    try {
      await analyzeImage(
        imageBase64,
        setDetectedText,
        (extractedInfo: ExtractedInfo | null) => {
          if (extractedInfo) {
            filteredFields.forEach((field) => {
              const fieldNameLower = field.name.toLowerCase().trim();

              // ID Number matching
              if (
                fieldNameLower.includes("id") ||
                fieldNameLower.includes("idnumber") ||
                fieldNameLower.includes("id number")
              ) {
                setValue(field.name, extractedInfo.idNumber);
              }
              // Full Name matching
              else if (
                fieldNameLower === "name" ||
                fieldNameLower === "full name" ||
                fieldNameLower.includes("fullname") ||
                fieldNameLower.includes("full name")
              ) {
                setValue(field.name, extractedInfo.fullName);
              }
              // First Name matching
              else if (
                fieldNameLower === "first name" ||
                fieldNameLower.includes("firstname") ||
                fieldNameLower.includes("First Name")
              ) {
                setValue(field.name, extractedInfo.firstNames);
              }
              // Last Name matching
              else if (
                fieldNameLower === "last name" ||
                fieldNameLower.includes("lastname") ||
                fieldNameLower.includes("last name") ||
                fieldNameLower === "surname" ||
                fieldNameLower.includes("surname")
              ) {
                setValue(field.name, extractedInfo.lastName);
              }
            });
          }
        }
      );
      setStep(2);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit: SubmitHandler<any> = (data) => {
    onSubmit(data);
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "TEXT":
      case "IDNUMBER":
        return (
          <div key={field.id} className="form-container">
            <label htmlFor={field.name}>{field.name}</label>
            <input
              className="form-input"
              type="text"
              placeholder={field.name}
              {...register(field.name, { required: field.required })}
            />
            {errors[field.name] && (
              <span className="error">{`${field.name} is required`}</span>
            )}
          </div>
        );

      case "TEXTAREA":
        return (
          <div key={field.id} className="form-container">
            <label htmlFor={field.name}>{field.name}</label>
            <textarea
              placeholder={field.name}
              {...register(field.name, { required: field.required })}
            ></textarea>
            {errors[field.name] && (
              <span className="error">{`${field.name} is required`}</span>
            )}
          </div>
        );

      case "NUMBER":
        return (
          <div key={field.id} className="form-container">
            <label htmlFor={field.name}>{field.name}</label>
            <input
              className="form-input"
              type="number"
              placeholder={field.name}
              {...register(field.name, { required: field.required })}
            />
            {errors[field.name] && (
              <span className="error">{`${field.name} is required`}</span>
            )}
          </div>
        );

      case "DATE":
        return (
          <div key={field.id} className="form-container">
            <label htmlFor={field.name}>{field.name}</label>
            <input
              className="form-input"
              type="datetime-local"
              {...register(field.name, { required: field.required })}
            />
            {errors[field.name] && (
              <span className="error">{`${field.name} is required`}</span>
            )}
          </div>
        );

      case "SELECT":
        return (
          <div key={field.id} className="form-container">
            <label htmlFor={field.name}>{field.name}</label>
            <select {...register(field.name, { required: field.required })}>
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <span className="error">{`${field.name} is required`}</span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (hasScanner && step === 1) {
    return (
      <div className="scanner-step">
        <h2 className="scan-header">Scan ID Document</h2>
        {isLoading ? (
          <div>Processing image...</div>
        ) : (
          <div className="button-container">
            <CameraCapture title="Scan ID" onCapture={handleImageCapture} />
            <button className="skip-button" onClick={() => setStep(2)}>
              Skip Scanner
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="form-container">
      {selectedImage && (
        <div className="scanned-data-banner">ID successfully scanned</div>
      )}

      {filteredFields.map((field) => renderField(field))}

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default DynamicForm;
