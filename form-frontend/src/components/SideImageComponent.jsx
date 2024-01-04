import React from "react";

const SideImageComponent = () => {
  return (
    <img
      src="https://source.unsplash.com/random?wallpapers"
      alt="Wallpaper"
      className="w-full h-full"
      style={{
        objectFit: "cover",
        position: "absolute",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "dodgerblue",
        overflow: "hidden",
      }}
    />
  );
};

export default SideImageComponent;
