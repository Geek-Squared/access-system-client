import React, { useState } from "react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import "./styles.scss";

interface IBarcodeScannerProps {
  barcodes?: string[]; // Typed as an array of strings for clarity
  setBarcodes: (barcodes: string[]) => void;
  setBarcodeId: (id: string | number) => void;
  handleSubmit: any;
}

const BarcodeScannerCamera: React.FC<IBarcodeScannerProps> = ({
  setBarcodes,
  setBarcodeId,
  handleSubmit,
}) => {
  const [firstBarcode, setFirstBarcode] = useState<string | null>(null);

  const scanBarcode = async () => {
    try {
      // Request camera permission
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== "granted") {
        alert("Camera permission denied");
        return;
      }

      // Start scanning
      const { barcodes } = await BarcodeScanner.scan();
      const barcodeValues = barcodes.map((barcode) => barcode.rawValue);

      // Update state with scanned barcodes
      setBarcodes(barcodeValues);

      // Set the first barcode
      if (barcodeValues.length > 0) {
        const firstBarcode = barcodeValues[0];
        setFirstBarcode(firstBarcode); // Set local state for the first barcode
        setBarcodeId(firstBarcode); // Pass it to the parent if needed
      }
    } catch (err) {
      console.error("Error scanning barcode:", err);
    }
  };

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <button onClick={scanBarcode}>Scan Barcode</button>

      {firstBarcode ? (
        <div>
          <p>First barcode detected: {firstBarcode}</p>
          <button className="snap-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      ) : (
        <ul>
          <li>No barcodes detected</li>
        </ul>
      )}
    </div>
  );
};

export default BarcodeScannerCamera;
