import React from "react";
import { Capacitor } from "@capacitor/core";
// import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useFetchOrganization from "../../hooks/useFetchOrg";
import "./styles.scss";

const AppBar: React.FC = () => {
  const ios = Capacitor.getPlatform() === "ios";
  // const { user } = useFetchCurrentUser();
  const { org } = useFetchOrganization();

  return (
    <div className="app-bar">
      <div className="app-bar-top">
        {org?.map((org: any) => (
          <h1
            style={{
              marginTop: ios ? "40px" : "0px",
            }}
          >
            {org?.name}
          </h1>
        ))}
      </div>
    </div>
  );
};

export default AppBar;
