import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerAsync } from "../redux/authSlice";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const mfaEnableRef = useRef(null);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkValues = () => {
    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (email === "" || password === "") {
      toast.error("Please fill the details");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a correct email");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^#.;'":`~*+?&])[A-Za-z\d@$!%^+#.;'":`~*?&]{10,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 10 characters long and contain a mix of uppercase, lowercase, numeric, and special characters."
      );
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return false;
    }
    return true;
  };
  const signUpToAccount = async (event) => {
    if (!checkValues()) {
      return;
    }
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
      mfaEnabled: mfaEnableRef.current.checked,
    };
    dispatch(registerAsync(userData)).then((res) => {
      if (res.type === "auth/register/rejected") {
        toast.error(authState.message);
        return;
      } else {
        if (mfaEnableRef.current.checked)
          navigate("/verify", {
            state: {
              email: email,
              password: password,
            },
          });
        else navigate("/email-verify");
      }
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        backgroundImage: `url("https://source.unsplash.com/random?wallpapers")`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        display: "flex",
      }}
    >
      {/* <SideImageComponent /> */}
      <div className="p-5 form-control bg-blend-darken rounded-xl bg-stone-800 bg-opacity-60 w-full max-w-lg m-auto">
        <article className="prose">
          <h1>Join SecureSync DocVault</h1>
        </article>
        <div className="grid gap-4 mt-2">
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
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="label">
              <span className="label-text">Password</span>
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
              <span className="label-text">Confirm Password</span>
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
        </div>
        <div className="">
          <label className="label cursor-pointer">
            <span className="label-text">Enable MFA?</span>
            <input
              ref={mfaEnableRef}
              type="checkbox"
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
        <button className="btn btn-info mt-10" onClick={signUpToAccount}>
          {authState.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : null}
          SignUp
        </button>
        <span className="mx-auto mt-2">
          Already have an account?{" "}
          <a className="link-primary" href="/login">
            Log In
          </a>
        </span>
      </div>
    </div>
  );
};

export default SignUp;
