import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { urlLocation } from "../variables/modifiers";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();


  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return;
    }
    await axios
      .post(
        `${urlLocation}/auth/reset-password?token=${token}&newPassword=${password}`
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("Password Reset Successfully");
          navigate("/signin");
        } else {
          toast.error("Error encountered");
        }
      });
  };

  return (
    <div className="m-auto max-w-xs">
      <div className="grid gap-4 mt-2">
        <div>
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full"
              autoComplete="new-password"
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Confirm New Password</span>
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
