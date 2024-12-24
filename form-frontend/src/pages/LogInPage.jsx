import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAsync } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IS_HOSTED, urlLocation } from "../variables/modifiers";
import PopupComponent from "../components/PopupComponent";
import axios from "axios";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleRecaptcha = (value) => {
    setRecaptchaValue(value);
    setIsVerified(!isVerified);
  };

  const loginToAccount = async (event) => {
    if (email === "") {
      toast.error("Please enter an email");
      return;
    }
    if (password === "") {
      toast.error("Please enter a password");
      return;
    }
    // event.preventDefault();
    dispatch(
      loginAsync({
        email: email,
        password: password,
        recaptchaValue: recaptchaValue,
      })
    ).then((res) => {
      if (res.type === "auth/login/rejected") {
        toast.error(res.payload);
      } else {
        if (authState.mfaEnabled) {
          navigate("/verify", {
            state: {
              email: email,
              password: password,
              recaptchaValue: recaptchaValue,
            },
          });
        } else {
          if (authState.user.authorities[0].authority === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/myFiles");
          }
        }
      }
    });
  };

  const sendResetLinkEmail = async () => {
    setResetLoading(true);
    await axios
      .post(`${urlLocation}/auth/generate-token?email=${email}`)
      .then((res) => {
        setResetLoading(false);
        toast.success("Reset mail sent successfully");
        setShowPopup(false);
      });
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        backgroundImage: `url("https://api.unsplash.com/photos/random")`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        display: "flex",
      }}
    >
      <div className="p-5 form-control bg-blend-darken rounded-xl bg-stone-800 bg-opacity-60 w-full max-w-lg m-auto">
        <article className="prose text-center">
          <h1>Access Your SecureSync DocVault</h1>
        </article>
        <div>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>
        <div className="relative">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type here"
            className="input input-bordered w-full pr-10"
          />
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            style={{ marginTop: "2rem" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="flex w-full justify-center">
          <ReCAPTCHA
            className="mt-4 p-0 w-full "
            theme="dark"
            style={{
              textAlign: "center",
              overflow: "hidden",
              width: "302px",
              height: "76px",
              borderRadius: "3px",
            }}
            sitekey={"6Lct5ScpAAAAAHVISfRd2LvEjihktk2OMT1ZmO4z"}
            onChange={handleRecaptcha}
          />
        </div>
        <button
          disabled={!isVerified}
          className="btn btn-info mt-10"
          onClick={loginToAccount}
        >
          {authState.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : null}
          Log In
        </button>
        <button
          className="m-auto"
          onClick={() => {
            setShowPopup(true);
            console.log("YOOOO");
          }}
        >
          {"Forgot Password? "}
          <span className="text-info">Reset</span>
        </button>
        <span className="mx-auto mt-2">
          {"Don't have an account? "}
          <a className="link-primary" href="/signup">
            Sign Up
          </a>
        </span>
      </div>
      <PopupComponent trigger={showPopup} setTrigger={setShowPopup}>
        <div className="flex flex-col gap-2">
          <label htmlFor="reset-pass-email">Enter your email:</label>
          <input
            type="text"
            value={email}
            placeholder="Type here"
            id="reset-pass-email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="input input-bordered input-accent w-full max-w-xs"
          />
          <button
            className="btn btn-outline btn-error max-w-xs"
            onClick={sendResetLinkEmail}
          >
            {resetLoading ? (
              <span className="loading loading-spinner"></span>
            ) : null}
            Send reset link
          </button>
        </div>
      </PopupComponent>
    </div>
  );
};

export default LogInPage;
