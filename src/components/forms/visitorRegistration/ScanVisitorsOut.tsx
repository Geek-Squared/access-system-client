import CardList from "../../cards/GuestCard";
import { useState } from "react";
import useUpdateVisitor from "../../../hooks/useUpdateVisitor";

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

  // Combine into ISO-8601 format
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};

const ScanVisitorsOut = () => {
  const [idNumber, setId] = useState<any>();
  const { data, updateUser } = useUpdateVisitor(idNumber);
  console.log("data", data);
  const handleLogOut = async (id: string) => {
    setId(id);
    try {
      const result = {
        id: idNumber,
        exitTime: getCurrentDateTime(),
        onSite: false,
      };
      updateUser(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="form-container">
      <CardList handleLogout={handleLogOut} />
    </div>
  );
};

export default ScanVisitorsOut;
