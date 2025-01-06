import { useNavigate } from "react-router-dom";
import useFetchCustomForms from "../../hooks/useRenderForms";
import "./styles.scss";
import useFetchVisitors from "../../hooks/useFetchVisitor";

const FormList = () => {
  const navigate = useNavigate();
  const { visitors } = useFetchVisitors();
  const { forms } = useFetchCustomForms();

  const handleCaptureClick = (formId: number) => {
    navigate(`/form/${formId}?type=entry`);
  };

  const handleLogoutClick = (categoryId: any) => {
    console.log("data-form", categoryId);
    navigate(`/scan-out/?category=${categoryId}`);
  };

  return (
    <>
      {forms?.map((form: any) => (
        <div className="nav-card-container" key={form.id}>
          <h3 className="nav-card-heading">{form.name}</h3>
          <p>{form.description}</p>
          <div className="button-container">
            <button
              className="nav-card-button"
              onClick={() => handleCaptureClick(form.id)}
            >
              Capture Details
            </button>
            <button
              className="second-nav-card-button"
              onClick={() => handleLogoutClick(form.id)}
            >
              Log Out
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default FormList;
