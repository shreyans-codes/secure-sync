import React from "react";
import { Link } from "react-router-dom";

const backgroundStyle = {
  backgroundColor: "beige",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const LandingPage = () => {
  return (
    <>
      <div
        className="bg-gray-100 min-h-screen items-center justify-center"
        style={backgroundStyle}
      >
        <div className="sticky top-0 z-50">
          <div>
            <div className="w-full bg-black  opacity-90 h-20 flex justify-between ">
              <div className="w-full lg:w-30/6 xl:w-full  h-full flex items-center px-4 ">
                <img className="rounded-lg w-16" src="/logo.jpeg" alt="Logo" />
              </div>

              <div className="w-full  h-full flex justify-end items-center">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center">
                    <Link to="/login">
                      <button className="btn btn-outline hover:bg-green-500 text-white px-4 py-2 rounded">
                        Login
                      </button>
                    </Link>
                  </div>
                </div>
                &nbsp;
              </div>
            </div>
          </div>
        </div>

        <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-16">
          <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-24 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-xl sm:mt-1 mt-80 space-y-8 text-center sm:text-right sm:ml-auto">
              <h2 className="text-4xl font-bold sm:text-5xl">
                Welcome to SecureSync DocVault
                <span className="hidden sm:block text-4xl">
                  Elevate Your Collaborative Experience.
                </span>
              </h2>

              <Link to="/signup">
                <button className="btn btn-outline inline-flex text-black items-center px-6 py-3 font-medium hover:bg-rose-500 rounded-lg hover:opacity-75">
                  Signup
                </button>
              </Link>
            </div>
          </div>

          <div className="absolute inset-0 w-full sm:my-20 sm:pt-1 pt-12 h-full ">
            <img className="w-96" src="https://i.ibb.co/2M7rtLk/Remote1.png" />
          </div>
        </aside>

        <div className="grid  place-items-center sm:mt-20">
          <img
            className="sm:w-96 w-48"
            src="https://i.ibb.co/5BCcDYB/Remote2.png"
          />
        </div>

        <footer className="text-center">
          <hr />
          <p className="text-center py-5 font-black">SecureSync !!!</p>
        </footer>

        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="sahilnetic"
          data-description="Support me on Buy me a coffee!"
          data-message=""
          data-color="#FFDD00"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
        ></script>
      </div>
    </>
    // <div className="bg-gray-100 min-h-screen flex items-center justify-center" style={backgroundStyle}>
    //   <div className="text-center">
    //     <h1 className="text-4xl font-bold mb-4">Welcome to Document App</h1>
    //     <p className="text-gray-600 mb-8">Streamlining your document processes.</p>
    //     <div className="space-x-4">
    //       <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
    //       <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
    //     </div>
    //   </div>
    // </div>
  );
};

export default LandingPage;
