import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountAsync } from "../redux/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FetcherPage = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAccountAsync()).then(() => {
      if (authState.isError) {
        toast.error(authState.message);
      } else {
        navigate("/");
      }
    });
  }, []);
  return <div>FetcherPage</div>;
};

export default FetcherPage;
