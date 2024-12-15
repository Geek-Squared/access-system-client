import { useNavigate } from "react-router-dom";
import useFetchCustomForms from "../../hooks/useRenderForms";
import "./styles.scss";

const FormList = () => {
  const navigate = useNavigate();
  const { forms } = useFetchCustomForms();

  const handleCardClick = (formId: number) => {
    navigate(`/form/${formId}`);
  };

  return (
    <>
      {forms?.map((form: any) => (
        <div className="nav-card-container" key={form.id}>
          <h3 className="nav-card-heading">{form.name}</h3>
          <p>{form.description}</p>

          <button
            className="nav-card-button"
            onClick={() => handleCardClick(form.id)}
          >
            Start
          </button>
        </div>
      ))}
    </>
  );
};

export default FormList;
