import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./styles.scss";

type Inputs = {
  name: string;
  id_number: string;
  visiting_reason: string;
  visiting_resident: string;
  entry_time: string;
  exit_time: string;
  phoneNumber: string;
};

interface IVisitorRegProp {
  name: string;
  id_number: string;
  entry_time: string;
  onSubmitOp: (data: Inputs) => void;
}

const VisitorRegForm: FC<IVisitorRegProp> = ({
  name,
  id_number,
  entry_time,
  onSubmitOp,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onSubmitOp(data);
  };

  console.log(watch("name"));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <label className="label" htmlFor="name">
        Full Name
      </label>
      <input
        className="form-input"
        defaultValue={name}
        placeholder="Name"
        {...register("name", { required: true })}
      />
      {errors.name && <span className="error">Name is required</span>}

      <label className="label" htmlFor="id_number">
        ID Number
      </label>
      <input
        className="form-input"
        defaultValue={id_number}
        placeholder="ID Number"
        {...register("id_number", { required: true })}
      />
      {errors.id_number && <span className="error">ID Number is required</span>}

      <label className="label" htmlFor="phoneNumber">
        Phone Number
      </label>
      <input
        className="form-input"
        type="text"
        placeholder="Phone Number"
        {...register("phoneNumber", { required: true })}
      />

      <label className="label" htmlFor="visiting_reason">
        Visiting Reason
      </label>
      <input
        className="form-input"
        defaultValue=""
        placeholder="Work Meeting"
        {...register("visiting_reason", { required: true })}
      />
      {errors.visiting_reason && (
        <span className="error">Visiting reason is required</span>
      )}

      <label className="label" htmlFor="visiting_resident">
        Company Visiting
      </label>
      <input
        className="form-input"
        defaultValue=""
        placeholder="Moyo Ent."
        {...register("visiting_resident", { required: true })}
      />
      {errors.visiting_resident && (
        <span className="error">Visiting company is required</span>
      )}

      <label className="label" htmlFor="entry_time">
        Entry Time
      </label>
      <input
        className="form-input"
        type="datetime-local"
        defaultValue={entry_time} // Use the entry_time prop as the default value
        placeholder="Entry Time"
        {...register("entry_time", { required: true })}
      />

      {errors.entry_time && (
        <span className="error">Entry time is required</span>
      )}

      {/* Uncomment and modify exit_time if needed */}
      {/* <label className="label" htmlFor="exit_time">Exit Time</label>
      <input
        className="form-input"
        type="datetime-local"
        defaultValue=""
        placeholder="Exit Time"
        {...register("exit_time", { required: true })}
      />
      {errors.exit_time && <span className="error">Exit time is required</span>} */}

      <input className="submit-button" type="submit" value="Submit" />
    </form>
  );
};

export default VisitorRegForm;
