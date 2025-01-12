import { useNavigate } from "react-router-dom";
import useFetchCustomForms from "../../hooks/useRenderForms";
import "./styles.scss";

const FormList = () => {
  const navigate = useNavigate();
  const { forms } = useFetchCustomForms();

  const handleCaptureClick = (formId: number) => {
    sessionStorage.setItem(
      "pendingFormNavigation",
      `/form/${formId}?type=entry`
    );
    navigate("/verify-code");
  };

  const handleLogoutClick = (categoryId: any) => {
    console.log("data-form", categoryId);
    navigate(`/scan-out/?category=${categoryId}`);
  };

  return (
    <div className="verify-visitor">
      <div className="verify-visitor__container">
        <div className="verify-visitor__header">
          <div className="verify-visitor__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1>Visitor Forms</h1>
          <p>Select a form to capture visitor details</p>
        </div>

        <div className="verify-visitor__form">
          {forms?.map((form: any) => (
            <div className="form-card" key={form.id}>
              <h3>{form.name}</h3>
              <p>{form.description}</p>
              <div className="button-group">
                <button
                  className="primary-button"
                  onClick={() => handleCaptureClick(form.id)}
                >
                  Entrance
                </button>
                <button
                  className="secondary-button"
                  onClick={() => handleLogoutClick(form.id)}
                >
                  Exit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormList;
