import useOrgStyles from "../hooks/useOrgStyles";
import FormList from "../components/cards/FormList";

const Home = () => {
  useOrgStyles();
  return (
    <>
      <FormList />
      {/* <a href="/verify-code">Verify</a> */}
    </>
  );
};

export default Home;
