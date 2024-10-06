import { useAuth } from "../context/authContext";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import "./styles.scss";

const Profile = () => {
  const { logout } = useAuth();
  const { user } = useFetchCurrentUser();
  console.log("user", user);
  return (
    <div className="profile-container">
      {/* <div className="profile-pic">
        <img src="path_to_profile_pic.jpg" alt="Profile" />
      </div> */}
      <div className="profile-name">
        <h2>{user?.username}</h2>
      </div>
      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
