import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useFetchCustomForms from "../../../hooks/useRenderForms";
import useFetchCurrentUser from "../../../hooks/useFetchCurrentUser";
import DynamicForm from "./DynamicForm";
import useCreateVisitor from "../../../hooks/useSubmitForm";

const FormDetail: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useFetchCurrentUser();
  const { createVisitor } = useCreateVisitor();

  const formId =
    params.formId || location.pathname.split("/").pop() || undefined;

  const { forms, isLoading } = useFetchCustomForms();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedFormId = formId ? Number(formId) : undefined;

  const selectedForm = forms.find((form: any) => form.id === parsedFormId);

  const handleFormSubmit = async (data: any) => {
    if (!user || !selectedForm) {
      console.error("User or form not found");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare visitor data according to the DTO
      const visitorData = {
        categoryId: selectedForm.id, // Use form ID as category ID
        siteId: user.sitesId, // Assuming user has a sitesId
        onSite: true, // You might want to make this dynamic
        userId: user.id,
        renderedFields: data, // Pass all form data as renderedFields
      };

      console.log("Submitting visitor data:", visitorData);

      // Submit the visitor
      const response = await createVisitor(visitorData);

      // Handle successful submission
      console.log("Visitor created:", response);

      // Navigate back to home or show success message
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally show error to user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading forms...</div>;
  }

  if (!selectedForm) {
    return (
      <div>
        <h2>Form Not Found</h2>
        <button onClick={() => navigate("/")}>Back to Form List</button>
      </div>
    );
  }

  return (
    <div className="form-detail-container">
      <h2>{selectedForm.name}</h2>
      <DynamicForm
        fields={selectedForm.fields}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default FormDetail;
