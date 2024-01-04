import React from "react";
import { useNavigate } from "react-router-dom";

export const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/signin");
  };
  return (
    <div className="flex flex-col items-center mt-14">
      <p>Waiting for email to be verified</p>
      <button
        title="Redirect to login page"
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        onClick={navigateToLogin}
      >
        I've verified
      </button>
    </div>
  );
};
