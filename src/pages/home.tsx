import { useNavigate } from "react-router-dom";
import NavCard from "../components/cards/NavCard";
import useOrgStyles from "../hooks/useOrgStyles";
import FormList from "../components/cards/FormList";

const Home = () => {
  const navigate = useNavigate();
  useOrgStyles();

  return (
    <>
      {/* <NavCard
        heading="Scan Visitors In"
        icon="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
        buttonText="Scan identification"
        description=""
        handleClick={() => navigate("/capture-details")}
      />
      <NavCard
        heading="Log Visitors Out"
        icon="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
        buttonText="Continue"
        description=""
        handleClick={() => navigate("/scan-out")}
      /> */}
      <FormList />
    </>
  );
};

export default Home;
