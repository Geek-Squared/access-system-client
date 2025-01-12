import React from "react";
import { Capacitor } from "@capacitor/core";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useFetchSites from "../../hooks/useFetchSites";
import "./styles.scss";

const AppBar: React.FC = () => {
  const ios = Capacitor.getPlatform() === "ios";
  const { user } = useFetchCurrentUser();
  const { sites } = useFetchSites();

  // Find the matching site
  const userSite = sites?.find((site: any) => site.id === user?.sitesId);

  return (
    <div className="app-bar">
      <div className="app-bar-top">
        <h1
          style={{
            marginTop: ios ? "40px" : "0px",
          }}
        >
          {userSite?.name || 'Loading...'}
        </h1>
      </div>
    </div>
  );
};

export default AppBar;