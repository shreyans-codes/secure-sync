import React from "react";
import { useDispatch } from "react-redux";
import { logoutFromAccount } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutUser = async () => {
    await dispatch(logoutFromAccount()).then((res) => {
      navigate("/signin");
    });
  };
  return (
    <button className="btn btn-outline btn-error" onClick={logoutUser}>
      Logout
    </button>
  );
};

export default LogoutButton;
