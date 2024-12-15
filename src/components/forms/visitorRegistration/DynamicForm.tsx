import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
  options?: FieldOption[];
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const onFormSubmit: SubmitHandler<any> = (data) => {
    onSubmit(data);
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "TEXT":
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
              type="date"
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

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="form-container">
      {fields.map((field) => renderField(field))}

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default DynamicForm;
