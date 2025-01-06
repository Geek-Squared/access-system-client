import CardList from "../../cards/GuestCard";
import { useState } from "react";
import useUpdateVisitor from "../../../hooks/useUpdateVisitor";

const ScanVisitorsOut = () => {
  const [idNumber, setId] = useState<any>();
  const { data, updateUser } = useUpdateVisitor(idNumber);

  const handleLogOut = async (id: string) => {
    setId(id);
    try {
      const currentFields = data?.renderedFields || {};
      const currentDateTime = new Date().toISOString().slice(0, 16);

      const exitFieldName =
        Object.keys(currentFields).find(
          (key) =>
            key.toLowerCase().includes("exit") ||
            key.toLowerCase().includes("timeout") ||
            key.toLowerCase().includes("time out")
        ) || "Exit Time";

      const result = {
        categoryId: Number(data?.category.id),
        siteId: Number(data?.sitesId),
        sitesId: data?.sitesId,
        onSite: false,
        renderedFields: {
          ...currentFields,
          [exitFieldName]: currentDateTime,
        },
      };

      await updateUser(result);
    } catch (error) {
      console.log("error", error);
      throw error; // Important to throw the error so the CardItem can handle it
    }
  };

  return (
    <div className="form-container">
      <CardList handleLogout={handleLogOut} />
    </div>
  );
};

export default ScanVisitorsOut;