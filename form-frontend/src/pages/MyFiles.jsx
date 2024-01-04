import React, { useEffect, useState } from "react";
import PopupComponent from "../components/PopupComponent";
import axios from "axios";
import { urlLocation } from "../variables/modifiers";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { logoutFromAccount } from "../redux/authSlice";
import PreviewPopup from "../components/PreviewPopup";
import { FaLightbulb } from "react-icons/fa";

export default function MyFiles() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [displayPopup, setDisplayPopup] = useState(false);
  const [sendingMail, setSendingMail] = useState(false);
  const [uploadFileLoading, setUploadFileLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  const sendMailToSelectedUsers = async () => {
    setSendingMail(true);
    const selectedEmails = users
      .filter((user) => selectedUsers.includes(user.userId))
      .map((selectedUser) => selectedUser.email);
    await axios
      .post(
        `${urlLocation}/files/sendMailToSelectedUsers/${user.userId}`,
        {
          recipientEmails: selectedEmails,
          fileId: selectedFileId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("File shared successfully!");
        }
        setSendingMail(false);
        setDisplayPopup(false);
      });
  };
  const fetchUserFiles = async () => {
    await axios
      .get(`${urlLocation}/files/fetch/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setFiles(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast.error("Your access token is expired");
          dispatch(logoutFromAccount()).then((res) => {
            setTimeout(() => navigate("/signin"), 5000);
          });
        }
      });
  };
  const fetchAllUsers = async () => {
    await axios
      .get(`${urlLocation}/auth/getUsers/${user.userId}`)
      .then((res) => {
        setUsers(res.data);
      });
  };

  useEffect(() => {
    fetchUserFiles();
    fetchAllUsers();
  }, [50]);
  const handleDownload = async (file) => {
    await axios
      .get(`${urlLocation}/files/downloadFile/${file.fileId}`, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file.pdf"); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleDelete = async (file) => {
    await axios
      .delete(`${urlLocation}/files/delete/${file.fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("File has been deleted");
          fetchUserFiles();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handlePreview = async (file) => {
    await axios
      .get(`${urlLocation}/files/downloadFile/${file.fileId}`, {
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
        toast.error(error);
      });
  };

  function handleSend(file) {
    setSelectedFileId(file.fileId);
    fetchAllUsers();
    setDisplayPopup(true);
  }

  function handleUpload(file) {
    setUploadFileLoading(true);
    axios
      .post(
        `${urlLocation}/files/uploadToDropBox/${file.fileId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) toast.success("File Uploaded successfully");
        setUploadFileLoading(false);
      });
  }

  const DownloadButton = ({ file }) => {
    return (
      <button
        onClick={() => handleDownload(file)}
        className="btn btn-outline min-h-8 h-10 btn-accent"
      >
        Download
      </button>
    );
  };
  const DeleteButton = ({ file }) => {
    return (
      <button
        onClick={() => handleDelete(file)}
        className="btn btn-outline min-h-8 h-10 btn-error"
      >
        Delete
      </button>
    );
  };

  const SendButton = ({ file }) => {
    return (
      <button
        onClick={() => handleSend(file)}
        className="btn btn-outline min-h-8 h-10 btn-success"
      >
        Send
      </button>
    );
  };
  const PreviewButton = ({ file }) => {
    return (
      <button
        onClick={() => {
          if (file.artefact !== null && typeof file.artefact !== "undefined") {
            setSelectedFile(file);
            setShowPopup(true);
          } else handlePreview(file);
        }}
      >
        <span className="mr-2">{file.fileName}</span>
      </button>
    );
  };

  const UploadButton = ({ file }) => {
    return (
      <button
        onClick={() => handleUpload(file)}
        className="btn btn-outline min-h-8 h-10 btn-warning"
      >
        {uploadFileLoading ? (
          <span className="loading loading-spinner"></span>
        ) : null}
        Upload
      </button>
    );
  };

  const RefreshButton = ({ file }) => {
    return (
      <button
        onClick={fetchUserFiles}
        className="btn btn-outline btn-success px-3 py-1 mr-2"
      >
        Refresh
      </button>
    );
  };

  const pendingFiles = files.filter((file) => file.status === "Pending");
  const approvedFiles = files.filter((file) => file.status === "Approved");
  const rejectedFiles = files.filter((file) => file.status === "Rejected");

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <article className="prose">
        <h1 className="font-bold m-0">My Files</h1>
        <h4 className="mt-0 mb-4 flex gap-2 items-center">
          <FaLightbulb
            color="yellow"
            alignmentBaseline="central"
            className=""
          />{" "}
          Click on file names to preview
        </h4>
      </article>
      <ul>
        {files.length === 0 ? (
          <h1>No files created yet!</h1>
        ) : (
          <div>
            <article className="prose">
              <h3 className="font-bold ">Pending Files</h3>
            </article>
            {pendingFiles.map((file) => (
              <div>
                <li
                  key={file.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  {/* <span className="mr-2">{file.fileName}</span> */}
                  <PreviewButton file={file} />
                  <div className="space-x-2">
                    <DownloadButton file={file} />
                    <DeleteButton file={file} />
                  </div>
                </li>
              </div>
            ))}
            <br />

            <article className="prose">
              <h3 className="font-bold">Approved Files</h3>
            </article>
            {approvedFiles.length === 0 ? (
              <h1>Nothing to show here</h1>
            ) : (
              approvedFiles.map((file) => (
                <div>
                  <li
                    key={file.id}
                    className="flex items-center justify-between border-b py-2"
                  >
                    {/* <span className="mr-2">{file.fileName}</span> */}
                    <PreviewButton file={file} />
                    <div className="space-x-2">
                      <DownloadButton file={file} />
                      <SendButton file={file} />
                      <UploadButton file={file} />
                      <DeleteButton file={file} />
                    </div>
                  </li>
                </div>
              ))
            )}
            <br />
            <article className="prose">
              <h3 className="font-bold">Rejected Files</h3>
            </article>
            {rejectedFiles.length === 0 ? (
              <h1>Nothing to show here</h1>
            ) : (
              rejectedFiles.map((file) => (
                <div>
                  <li
                    key={file.id}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <div className="flex flex-col">
                      <PreviewButton file={file} />
                      {file.remarks && (
                        <span className=" text-secondary">
                          {"Remarks: "}
                          {file.remarks}
                        </span>
                      )}
                    </div>
                    <div className="space-x-2">
                      <DownloadButton file={file} />
                      <DeleteButton file={file} />
                    </div>
                  </li>
                </div>
              ))
            )}
          </div>
        )}
      </ul>
      <PopupComponent trigger={displayPopup} setTrigger={setDisplayPopup}>
        {users.length === 0 ? (
          <h1>No users found</h1>
        ) : (
          <div className="max-h-60 overflow-scroll">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between border-b py-2"
              >
                <span className="mr-2">{user.email}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleUserSelect(user.userId)}
                    className={`btn min-h-8 h-10 btn-success ${
                      selectedUsers.includes(user.userId) ? "" : "btn-outline"
                    }`}
                  >
                    {selectedUsers.includes(user.userId)
                      ? "Selected"
                      : "Select"}
                  </button>
                </div>
              </li>
            ))}
          </div>
        )}
        <br />

        <button
          className="btn btn-block btn-outline btn-accent"
          onClick={sendMailToSelectedUsers}
          disabled={users.length === 0 ? (sendingMail ? false : true) : false}
        >
          {sendingMail ? (
            <span className="loading loading-spinner"></span>
          ) : null}
          Send Mail
        </button>
      </PopupComponent>
      <div className="flex mt-2 justify-center">
        <button
          className="btn btn-outline btn-info px-3 py-1 mr-2"
          onClick={() => navigate("/docs")}
        >
          Generate new Report
        </button>
        <RefreshButton />
        <LogoutButton />
        <PreviewPopup
          trigger={showPopup}
          setTrigger={setShowPopup}
          fileData={selectedFile}
        />
      </div>
    </div>
  );
}
