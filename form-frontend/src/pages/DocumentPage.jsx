import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BlobProvider,
  Document,
  Image,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import PDFDocument from "@react-pdf/pdfkit";

import Aadhar_Doc from "../docs/Aadhar_Doc";
import LLF_Doc from "../docs/LLF_Doc";
import RF_Doc from "../docs/RF_Doc";
import axios from "axios";
import { useSelector } from "react-redux";
import LogoutButton from "../components/LogoutButton";
import { urlLocation } from "../variables/modifiers";

const AadharForm = ({ onSubmit, onCancel, formData, setFormData }) => {
  return (
    <div className="form-container">
      <label className="label">
        <span className="label-text">Name</span>
      </label>
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">S/O/W/O</span>
      </label>
      <input
        type="text"
        value={formData.sowo || ""}
        onChange={(e) => setFormData({ ...formData, sowo: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Village/Town</span>
      </label>
      <input
        type="text"
        value={formData.villageTown || ""}
        onChange={(e) =>
          setFormData({ ...formData, villageTown: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Taluka</span>
      </label>
      <input
        type="text"
        value={formData.taluka || ""}
        onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">District</span>
      </label>
      <input
        type="text"
        value={formData.district || ""}
        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">State</span>
      </label>
      <input
        type="text"
        value={formData.state || ""}
        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Gender</span>
      </label>
      <input
        type="text"
        value={formData.gender || ""}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        className="input input-bordered w-full"
        required

      />
      <label className="label">
        <span className="label-text">Date of Birth</span>
      </label>
      <input
        type="date"
        value={formData.dob || ""}
        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <div className="mt-4">
        <button className="btn btn-info" onClick={onSubmit}>
          Generate Report
        </button>
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const LearnerForm = ({ onSubmit, onCancel, formData, setFormData }) => {
  return (
    <div className="form-container">
      <label className="label">
        <span className="label-text">Full Name</span>
      </label>
      <input
        type="text"
        value={formData.fullname || ""}
        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">S/O/W/O</span>
      </label>
      <input
        type="text"
        value={formData.sowo || ""}
        onChange={(e) => setFormData({ ...formData, sowo: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Permanent Address</span>
      </label>
      <input
        type="text"
        value={formData.permanentAddress || ""}
        onChange={(e) =>
          setFormData({ ...formData, permanentAddress: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Temporary Address/Official Address</span>
      </label>
      <input
        type="text"
        value={formData.temporaryAddress || ""}
        onChange={(e) =>
          setFormData({ ...formData, temporaryAddress: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Date of Birth</span>
      </label>
      <input
        type="date"
        value={formData.dob || ""}
        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Place of Birth</span>
      </label>
      <input
        type="text"
        value={formData.placeofBirth || ""}
        onChange={(e) =>
          setFormData({ ...formData, placeofBirth: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Identification Mark(s) </span>
      </label>
      <input
        type="text"
        value={formData.identificationMarks || ""}
        onChange={(e) =>
          setFormData({ ...formData, identificationMarks: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Blood Group</span>
      </label>
      <input
        type="text"
        value={formData.bloodGroup || ""}
        onChange={(e) =>
          setFormData({ ...formData, bloodGroup: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />

      <div className="mt-4">
        <button className="btn btn-info" onClick={onSubmit}>
          Generate Report
        </button>
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const ResidenceForm = ({
  onSubmit,
  onCancel,
  formData,
  setFormData,
  authState,
}) => {
  const isFormValid =
    formData.name &&
    formData.sowo &&
    formData.villageTown &&
    formData.taluka &&
    formData.district &&
    formData.place &&
    formData.date &&
    formData.artefactType

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const sendFile = async (formDataToSend) => {
    var response = await axios.post(
      `${urlLocation}/files/upload/` + authState.user.userId,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "form-data",
        },
      }
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Access the first selected file
    setSelectedFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Generate PDF content
      await RF_Doc(formData).then(async (pdfContent) => {
        setLoading(true);
        // Convert the PDF content to a blob
        // const blob = new Blob([pdfContent], { type: "application/pdf" });

        await pdf(pdfContent)
          .toBlob()
          .then((blob) => {
            const pdfFile = new File(
              [blob],
              "ResidenceForm-" +
                formData.name +
                "-" +
                Math.random().toString(36).slice(2) +
                ".pdf",
              {
                type: "application/pdf",
              }
            );

            // Create FormData and append the file
            const formDataToSend = new FormData();
            formDataToSend.append("file", pdfFile);
            if (selectedFile !== null) {
              formDataToSend.append("artefactFile", selectedFile);
            }

            sendFile(formDataToSend).then(() => {
              setLoading(false);
              onSubmit();
            });
          });
      });
    } else {
      toast.error("Please fill in all the fields");
    }
  };

  return (
    <div className="form-container">
      {!isFormValid && (
        <label className="label">
          <span style={{ color: "red" }}>*All fields are mandatory</span>
        </label>
      )}
      <label className="label">
        <span className="label-text">Name</span>
      </label>
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">S/O/W/O</span>
      </label>
      <input
        type="text"
        value={formData.sowo || ""}
        onChange={(e) => setFormData({ ...formData, sowo: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Village/Town</span>
      </label>
      <input
        type="text"
        value={formData.villageTown || ""}
        onChange={(e) =>
          setFormData({ ...formData, villageTown: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">Taluka</span>
      </label>
      <input
        type="text"
        value={formData.taluka || ""}
        onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
        className="input input-bordered w-full"
        required
      />

      <label className="label">
        <span className="label-text">District</span>
      </label>
      <input
        type="text"
        value={formData.district || ""}
        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
        className="input input-bordered w-full"
        required
      />
      <label className="label">
        <span className="label-text">Place of Registration</span>
      </label>
      <input
        type="text"
        value={formData.place || ""}
        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
        className="input input-bordered w-full"
        required
      />
      <label className="label">
        <span className="label-text">Date</span>
      </label>
      <input
        type="date"
        value={formData.date || ""}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="input input-bordered w-full"
        required
      />
      <label className="label">
        <span className="label-text">Artefact Type</span>
      </label>
      <input
        type="text"
        value={formData.artefactType || ""}
        onChange={(e) =>
          setFormData({ ...formData, artefactType: e.target.value })
        }
        className="input input-bordered w-full"
        required
      />
      <label className="label">
        <span className="label-text">Upload File</span>
      </label>
      <input
        type="file"
        className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
        required
        onChange={handleFileChange}
      />

      <div className="mt-4">
        <button
          className={`btn btn-outline  btn-accent ${
            !isFormValid ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handleFormSubmit}
        >
          {loading ? <span className="loading loading-spinner"></span> : null}
          Generate Report
        </button>
        <button className="btn btn-outline " onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const DocumentPage = () => {
  const [selectedDocument, setSelectedDocument] = useState("");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleDocumentChange = (documentType) => {
    setSelectedDocument(documentType);
  };

  const authState = useSelector((state) => state.auth);

  const handleFormSubmit = () => {
    if (selectedDocument === "residence") {
      const isFormValid =
        formData.name &&
        formData.sowo &&
        formData.villageTown &&
        formData.taluka &&
        formData.district;
      if (!isFormValid) {
        toast.error("Please fill in all the fields");
        return;
      }
    }

    toast.success("Report generated successfully!");
    navigate("/myFiles");
  };

  const handleFormCancel = () => {
    setSelectedDocument("");
    setFormData({});
  };

  const renderForm = () => {
    switch (selectedDocument) {
      case "aadhar":
        return (
          <div className="mt-2 mb-2">
            <AadharForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        );
      case "learner":
        return (
          <div className="mt-2 mb-2">
            <LearnerForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        );
      case "residence":
        return (
          <div className="mt-2 mb-2">
            <ResidenceForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              formData={formData}
              setFormData={setFormData}
              authState={authState}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-5 form-control bg-blend-darken rounded-xl bg-stone-800 bg-opacity-60 w-full max-w-lg m-auto">
        <article className="prose text-center">
          <h1>Generate Document Report</h1>
        </article>
        <div>
          <label className="label">
            <span className="label-text">Select Document Type</span>
          </label>
          <select
            value={selectedDocument}
            onChange={(e) => handleDocumentChange(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="" disabled>
              Select Document Type
            </option>
            <option value="aadhar">Aadhar Form</option>
            <option value="learner">Learner's Licence Form</option>
            <option value="residence">Residence Form</option>
          </select>
        </div>

        {renderForm()}
      </div>
      <div className="flex justify-center">
        <button
          className="btn btn-outline btn-info px-3 py-1 mr-2"
          onClick={() => navigate("/myFiles")}
        >
          My Files
        </button>
        <LogoutButton />
      </div>
    </>
  );
};

export default DocumentPage;
