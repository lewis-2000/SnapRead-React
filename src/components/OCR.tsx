import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCR: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      processImage(file);
    }
  };

  // Process image with Tesseract.js
  const processImage = (file: File) => {
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        Tesseract.recognize(reader.result as string, "eng", {
          logger: (m) => console.log(m), // Logs progress
        })
          .then(({ data: { text } }) => setText(text))
          .catch((err) => {
            console.error("OCR Error:", err);
            setText("Error processing image.");
          })
          .finally(() => setLoading(false));
      }
    };
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>SnapReadReact - OCR</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {image && <img src={image} alt="Uploaded" style={{ width: "300px", marginTop: "10px" }} />}
      
      {loading && <p>Processing...</p>}
      
      {text && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{text}</pre>
        </div>
      )}
    </div>
  );
};

export default OCR;
