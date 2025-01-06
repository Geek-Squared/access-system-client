import React, { useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import useFetchCustomForms from "../../../hooks/useRenderForms";
import useFetchCurrentUser from "../../../hooks/useFetchCurrentUser";
import DynamicForm from "./DynamicForm";
import useCreateVisitor from "../../../hooks/useSubmitForm";

const FormDetail: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType = searchParams.get('type'); // 'entry' or 'exit'
  
  const { user } = useFetchCurrentUser();
  const { createVisitor } = useCreateVisitor();
  
  const formId = params.formId || location.pathname.split("/").pop() || undefined;
  const { forms, isLoading } = useFetchCustomForms();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const parsedFormId = formId ? Number(formId) : undefined;
  const selectedForm = forms.find((form: any) => form.id === parsedFormId);

  // Filter fields based on form type
  const filteredFields = selectedForm?.fields.filter((field: any) => {
    const fieldNameLower = field.name.toLowerCase();
    if (formType === 'exit') {
      // For exit, only show exit time fields
      return fieldNameLower.includes('exit') || 
             fieldNameLower.includes('timeout') || 
             fieldNameLower.includes('time out');
    } else {
      // For entry, filter out exit time fields
      return !fieldNameLower.includes('exit') && 
             !fieldNameLower.includes('timeout') && 
             !fieldNameLower.includes('time out');
    }
  });

  const handleFormSubmit = async (data: any) => {
    if (!user || !selectedForm) {
      console.error("User or form not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const visitorData = {
        categoryId: selectedForm.id,
        siteId: user.sitesId,
        onSite: formType !== 'exit', // Set to false for exit forms
        userId: user.id,
        renderedFields: data,
      };

      console.log("Submitting visitor data:", visitorData);
      const response = await createVisitor(visitorData);
      console.log("Visitor created:", response);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <h2>{formType === 'exit' ? `${selectedForm.name} - Exit` : selectedForm.name}</h2>
      <DynamicForm
        fields={filteredFields || []}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default FormDetail;