import React from "react";
import PopupComponent from "./PopupComponent";
import axios from "axios";
import { urlLocation } from "../variables/modifiers";

const PreviewPopup = ({ trigger, setTrigger, fileData }) => {
  
  const handlePreview = async (fileId) => {
    await axios
      .get(`${urlLocation}/files/downloadFile/${fileId}`, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const file = new Blob([res.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast.error(expiredTokenMessage);
          dispatch(logoutFromAccount()).then((res) => {
            setTimeout(() => navigate("/signin"), 5000);
          });
        }
      });
  };
  const handleArtefactPreview = async (fileId) => {
    await axios
      .get(`${urlLocation}/files/downloadArtefact/${fileId}`, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const file = new Blob([res.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast.error(expiredTokenMessage);
          dispatch(logoutFromAccount()).then((res) => {
            setTimeout(() => navigate("/signin"), 5000);
          });
        }
      });
  };
  return (
    <PopupComponent trigger={trigger} setTrigger={setTrigger}>
      <li key={1} className="flex items-center justify-between border-b py-2">
        <span className="mr-2">View Document</span>
        <div className="space-x-2">
          <button
            onClick={() => handlePreview(fileData.fileId)}
            className={`btn min-h-8 h-10 btn-success btn-outline`}
          >
            Preview
          </button>
        </div>
      </li>
      <li key={2} className="flex items-center justify-between border-b py-2">
        <span className="mr-2">View Artefact</span>
        <div className="space-x-2">
          <button
            onClick={() => handleArtefactPreview(fileData.artefact.artefactId)}
            className={`btn min-h-8 h-10 btn-success btn-outline`}
          >
            Preview
          </button>
        </div>
      </li>
    </PopupComponent>
  );
};

export default PreviewPopup;
