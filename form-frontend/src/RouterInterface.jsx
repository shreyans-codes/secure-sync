import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LogInPage from "./pages/LogInPage";
import SignUp from "./pages/SignUp";
import VerifyPage from "./pages/VerifyPage";
import { useSelector } from "react-redux";
import FetcherPage from "./pages/FetcherPage";
import DocumentPage from "./pages/DocumentPage";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import Report from "./pages/Report";
import MyFiles from "./pages/MyFiles";
import { EmailVerificationPage } from "./pages/EmailVerificationPage";
import FileUploadComponent from "./pages/FileUploadComponent";
import ResetPassword from "./pages/ResetPassword";

const RouterInterface = () => {
  const user = useSelector((state) => state.auth.user);
  const RequireAuth = ({ children }) => {
    if (user === null) {
      return <Navigate to={"/signin"} />;
    } else {
      return children;
    }
  };
  const RequireAuthAdmin = ({ children }) => {
    if (user !== null && user.authorities[0].authority === "ADMIN") {
      return children;
    } else {
      return <Navigate to={"/signin"} />;
    }
  };
  const CheckAuth = ({ children }) => {
    if (user === null) return children;
    else {
      if (user.authorities[0].authority === "ADMIN")
        return <Navigate to={"/admin"} />;
      else return <Navigate to={"/myFiles"} />;
    }
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              path="login"
              element={
                <CheckAuth>
                  <LogInPage />
                </CheckAuth>
              }
            />
            <Route
              path="signin"
              element={
                <CheckAuth>
                  <LogInPage />
                </CheckAuth>
              }
            />
            <Route
              path="signup"
              element={
                <CheckAuth>
                  <SignUp />
                </CheckAuth>
              }
            />
            <Route
              path="docs"
              element={
                <RequireAuth>
                  <DocumentPage />
                </RequireAuth>
              }
            />
            <Route
              path="admin"
              element={
                <RequireAuthAdmin>
                  <AdminDashboard />
                </RequireAuthAdmin>
              }
            />
            <Route path="land" element={<LandingPage />} />
            <Route path="report" element={<Report />} />
            <Route path="reset-password" element={<ResetPassword />} />

            <Route
              path="myFiles"
              element={
                <RequireAuth>
                  <MyFiles />
                </RequireAuth>
              }
            />
            <Route path="email-verify" element={<EmailVerificationPage />} />
            <Route path="fileUpload" element={<FileUploadComponent />} />
            <Route index element={<LandingPage />} />
            <Route path="fetch" element={<FetcherPage />} />
            <Route path="verify" element={<VerifyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouterInterface;
