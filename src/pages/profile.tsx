import { useAuth } from "../context/authContext";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import "./styles.scss";

const Profile = () => {
  const { logout } = useAuth();
  const { user } = useFetchCurrentUser();

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <div className="profile-page__header">
          <div className="profile-page__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1>Profile Details</h1>
          <p>Your account information</p>
        </div>
        
        <div className="profile-page__content">
          <div className="profile-page__info">
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p>{user?.role}</p>
            <p>{user?.phoneNumber}</p>
          </div>
          
          <button
            className="profile-page__button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;