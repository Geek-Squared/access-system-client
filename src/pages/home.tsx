import { useNavigate } from "react-router-dom";
import NavCard from "../components/cards/NavCard";
import {
  // faCameraRotate,
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavCard
        heading="Scan Visitors In"
        icon={faSignIn}
        buttonText="Scan identification"
        description=""
        handleClick={() => navigate("/capture-details")}
      />
      <NavCard
        heading="Log Visitors Out"
        icon={faSignOut}
        buttonText="Continue"
        description=""
        handleClick={() => navigate("/scan-out")}
      />
    </>
  );
};

export default Home;
