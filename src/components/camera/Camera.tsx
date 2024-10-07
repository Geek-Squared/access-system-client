import { FC, useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./styles.scss";

interface ICameraCaptureProps {
  onCapture: any;
  title?: string;
}

const CameraCapture: FC<ICameraCaptureProps> = ({ onCapture, title }) => {
  const [photo, setPhoto] = useState(null);

  // Function to capture photo
  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      //@ts-ignore
      setPhoto(image.dataUrl);
      onCapture(image.dataUrl);
    } catch (error) {
      console.error("Error taking photo", error);
    }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h4>Scan {title}</h4>

      <button className="snap-button" onClick={takePhoto}>
        Take Photo
      </button>

      {photo && (
        <div>
          <h3>Captured Photo:</h3>
          <img
            src={photo}
            alt="Captured"
            style={{ maxWidth: "100%", marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
