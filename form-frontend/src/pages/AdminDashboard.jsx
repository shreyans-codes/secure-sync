import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { useDispatch } from "react-redux";
import { logoutFromAccount } from "../redux/authSlice";
import PopupComponent from "../components/PopupComponent";
import PreviewPopup from "../components/PreviewPopup";
import toast from "react-hot-toast";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { urlLocation } from "../variables/modifiers";
import { FaLightbulb } from "react-icons/fa";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [approveLoading, setApproveLoading] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [remarks, setRemarks] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statisticsData, setStatisticsData] = useState({});
  const [approvalRequests, setApprovalRequests] = useState([]);
  const expiredTokenMessage =
    "Your access token is expired. Please login again!";

  const loadData = async () => {
    setRefreshLoading(true);
    try {
      const statisticsResponse = await axios
        .post(
          `${urlLocation}/statistics/updateCounts`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error(expiredTokenMessage);
            dispatch(logoutFromAccount()).then((res) => {
              setTimeout(() => navigate("/signin"), 5000);
            });
          }
        });
      setStatisticsData(statisticsResponse.data);

      const approvalRequestsResponse = await axios
        .get(`${urlLocation}/files/pendingFiles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error(expiredTokenMessage);
            dispatch(logoutFromAccount()).then((res) => {
              setTimeout(() => navigate("/signin"), 5000);
            });
          }
        });

      setApprovalRequests(approvalRequestsResponse.data);

      setRefreshLoading(false);
    } catch (error) {
      setRefreshLoading(false);
    }
  };

  const updateStatistics = async () => {
    try {
      await axios
        .post(
          `${urlLocation}/statistics/updateCounts`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error(expiredTokenMessage);
            dispatch(logoutFromAccount()).then((res) => {
              setTimeout(() => navigate("/signin"), 5000);
            });
          }
        });

      const statisticsResponse = await axios
        .post(
          `${urlLocation}/statistics/updateCounts`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        .then((res) => {
          if (res.status === 200) toast.success("Updated");
          else
            toast.error("Some error encountered while approving.\nPlease try");
        });

      setStatisticsData(statisticsResponse.data);
    } catch (error) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (fileId) => {
    setApproveLoading(fileId);

    try {
      await axios
        .post(
          `${urlLocation}/files/approve/${fileId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) toast.success("File approved successfully");
          else
            toast.error("Some error encountered while approving.\nPlease try");
        })
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error(expiredTokenMessage);
            dispatch(logoutFromAccount()).then((res) => {
              setTimeout(() => navigate("/signin"), 5000);
            });
          }
        });
      loadData();
      setApproveLoading(null);
    } catch (error) {
      setApproveLoading(null);
    }
  };

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

  const handleReject = async (fileId, remarks) => {
    setRejectLoading(true);
    try {
      if (remarks) {
        await axios
          .post(`${urlLocation}/files/reject/${fileId}`, remarks, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "text/plain",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              toast.success("File rejected");
            } else {
              toast.error(
                "Some error encountered while rejecting.\nPlease try"
              );
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
      } else {
        await axios
          .post(`${urlLocation}/files/reject/${fileId}`, null, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              toast.success("File rejected");
            } else {
              toast.error(
                "Some error encountered while rejecting.\nPlease try"
              );
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
      }
      loadData();
      setRejectLoading(false);
      setSelectedFile(null);
      setShowRejectPopup(false);
    } catch (error) {
      setRejectLoading(false);
      setSelectedFile(null);
      setShowRejectPopup(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="p-5 form-control bg-blend-darken rounded-xl bg-stone-800 bg-opacity-60 w-full max-w-2xl m-auto">
      <article className="prose">
        <h2>Admin Dashboard</h2>
      </article>

      {/* Statistics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
          Statistics
          <button
            onClick={updateStatistics}
            className="btn btn-outline btn-info min-h-8 h-10 px-3 py-1"
          >
            Update Statistics
          </button>
        </h2>
        <div className="flex items-start">
          {/* Separate container for each statistic*/}
          <div
            className="mr-4 p-4 border rounded-lg bg-pink-600 flex flex-col items-center relative w-1/2"
            style={{ height: "12.8rem" }}
          >
            <p className="mb-2">Number of User:</p>
            <p className="font-bold text-2xl">{statisticsData.noUsers || 0}</p>
          </div>
          <div
            className="mr-4 p-4 border rounded-lg bg-blue-700 flex flex-col items-center relative w-1/2"
            style={{ height: "12.8rem" }}
          >
            <p className="mb-2">Number of Files:</p>
            <p className="font-bold text-2xl">{statisticsData.noFiles || 0}</p>
          </div>
          <div
            className="mr-4 p-4 border rounded-lg bg-green-800 flex flex-col items-center relative w-1/2"
            style={{ height: "12.8rem" }}
          >
            <p className="mb-2">Number of Approved:</p>
            <p className="font-bold text-2xl">
              {statisticsData.noApproved || 0}
            </p>
            <CircularProgressbar
              value={statisticsData.noApproved || 0}
              maxValue={statisticsData.noFiles}
              text={`${
                (
                  (statisticsData.noApproved / statisticsData.noFiles) *
                  100
                ).toFixed(2) || 0
              }%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#fff",
                textColor: "#fff",
                trailColor: "rgba(255,255,255,0.2)",
              })}
            />
          </div>
          <div
            className="mr-4 p-4 border rounded-lg bg-yellow-700 flex flex-col items-center relative w-1/2"
            style={{ height: "12.8rem" }}
          >
            <p className="mb-2">Number of Pending:</p>
            <p className="font-bold text-2xl">
              {statisticsData.noPending || 0}
            </p>
            <CircularProgressbar
              value={statisticsData.noPending || 0}
              maxValue={statisticsData.noFiles}
              text={`${
                (
                  (statisticsData.noPending / statisticsData.noFiles) *
                  100
                ).toFixed(2) || 0
              }%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#fff",
                textColor: "#fff",
                trailColor: "rgba(255,255,255,0.2)",
              })}
            />
          </div>
          <div
            className="p-4 border rounded-lg bg-red-800 flex flex-col items-center relative w-1/2"
            style={{ height: "12.8rem" }}
          >
            <p className="mb-2">Number of Rejected:</p>
            <p className="font-bold text-2xl">
              {statisticsData.noRejected || 0}
            </p>
            <CircularProgressbar
              value={statisticsData.noRejected || 0}
              maxValue={statisticsData.noFiles}
              text={`${
                (
                  (statisticsData.noRejected / statisticsData.noFiles) *
                  100
                ).toFixed(2) || 0
              }%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#fff",
                textColor: "#fff",
                trailColor: "rgba(255,255,255,0.2)",
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
          <article className="prose">
            <h2 className="font-bold m-0">Approval Requests</h2>
            <h5 className="mt-0 mb-4 flex gap-2 items-center">
              <FaLightbulb
                color="yellow"
                alignmentBaseline="central"
                className=""
              />{" "}
              Click on file names to preview
            </h5>
          </article>
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-accent min-h-8 h-10 px-3 py-1"
          >
            {refreshLoading ? (
              <span className="loading loading-spinner"></span>
            ) : null}
            Refresh
          </button>
        </h2>
        {approvalRequests.length > 0 ? (
          <ul>
            {approvalRequests.map((request) => (
              <li
                key={request.id}
                className="mb-2 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold">{request.userName}</span>
                  <div className="break-words">
                    <button
                      onClick={() => {
                        if (request.hasArtefact) {
                          setSelectedFile(request);
                          setShowPopup(true);
                        } else handlePreview(request.fileId);
                      }}
                    >
                      File: <strong>{request.fileName}</strong>
                    </button>
                  </div>
                </div>
                <div className="ml-2 flex">
                  <button
                    onClick={() => {
                      if (request.hasArtefact) {
                        setSelectedFile(request);
                        setShowPopup(true);
                      } else handlePreview(request.fileId);
                    }}
                    className="btn btn-outline btn-info px-2 py-1"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleApprove(request.fileId)}
                    className="btn btn-outline btn-success ml-2 px-2 py-1"
                    disabled={approveLoading === request.fileId}
                  >
                    {approveLoading === request.fileId ? (
                      <span className="loading loading-spinner"></span>
                    ) : null}
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectPopup(true);
                      setSelectedFile(request);
                    }}
                    className="btn btn-outline btn-error ml-2 px-2 py-1"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No approval requests at the moment.</p>
        )}
      </div>
      <PreviewPopup
        trigger={showPopup}
        setTrigger={setShowPopup}
        fileData={selectedFile}
      />
      <PopupComponent trigger={showRejectPopup} setTrigger={setShowRejectPopup}>
        <textarea
          className="textarea textarea-info w-full"
          placeholder="Enter reject remarks"
          onChange={(e) => setRemarks(e.target.value)}
        />
        <button
          onClick={() => handleReject(selectedFile.fileId, remarks)}
          className="btn btn-outline btn-secondary w-full mt-4 px-2 py-1"
        >
          {rejectLoading ? (
            <span className="loading loading-spinner"></span>
          ) : null}
          Continue with Reject
        </button>
      </PopupComponent>
      <LogoutButton />
    </div>
  );
};

export default AdminDashboard;
