// FileUploadComponent.jsx

import React, { useState } from "react";
import axios from "axios";
import { urlLocation } from "../variables/modifiers";

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${urlLocation}/auth/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully");
    } catch (error) {
      alert("Failed to upload file");
    }
  };

  return (
    <div>
      <h1>upload files here</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUploadComponent;
