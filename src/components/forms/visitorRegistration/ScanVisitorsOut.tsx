// import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import CardList from "../../cards/GuestCard";

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ScanVisitorsOut = () => {
  const updateGuest = useMutation(
    api.functions.mutations.visitor.updateVisitor
  );
  // const [__, setBarcodes] = useState<string[]>([]);
  // const [barcodeId, setBarcodeId] = useState<string | number>("No barcode");
  // const [message, setMessage] = useState<string | null>(null);

  const handleLogOut = async (id: string) => {
    try {
      const result = await updateGuest({
        id: id,
        exit_time: getCurrentDateTime(),
        on_site: false,
      });
      console.log("result", result);
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
