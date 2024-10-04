import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  // faCog,
  faUserShield,
  faHomeAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bottom-nav-bar">
      <div className="nav-item" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHomeAlt} size="lg" />
        <span>Home</span>
      </div>
      <div className="nav-item active" onClick={() => navigate("/profile")}>
        <FontAwesomeIcon icon={faUserShield} size="lg" />
        <span>Profile</span>
      </div>
      {/* <div className="nav-item" onClick={() => navigate("/settings")}>
        <FontAwesomeIcon icon={faCog} size="lg" />
        <span>Settings</span>
      </div> */}
    </div>
  );
};

export default BottomNavBar;
