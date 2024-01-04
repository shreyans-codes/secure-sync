import React from "react";

const PopupComponent = (props) => {
  return props.trigger ? (
    <div className="fixed top-0 left-0 w-full h-[100vh] bg-zinc-500 flex justify-center items-center">
      <div className="relative bg-slate-900 rounded-xl p-24 w-full max-w-3xl">
        <button
          className="btn btn-error absolute top-4 right-4"
          onClick={() => props.setTrigger(false)}
        >
          Close
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default PopupComponent;
