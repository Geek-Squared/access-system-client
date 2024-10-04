import React from "react";
import { Capacitor } from "@capacitor/core";
import "./styles.scss";

const AppBar: React.FC = () => {
  const ios = Capacitor.getPlatform() === "ios";
  return (
    <div className="app-bar">
      <div className="app-bar-top">
        <h1
          style={{
            marginTop: ios ? "40px" : "0px",
          }}
        >
          Kingston House
        </h1>
      </div>
    </div>
  );
};

export default AppBar;
