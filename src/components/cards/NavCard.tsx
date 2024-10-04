import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import "./styles.scss";

interface INavCardProps {
  icon: any;
  heading: string;
  description: string;
  handleClick: () => void;
  buttonText: string;
}

const NavCard: FC<INavCardProps> = ({
  icon,
  heading,
  description,
  handleClick,
  buttonText,
}) => {
  return (
    <div className="nav-card-container">
      <div className="icon-container">
        <FontAwesomeIcon icon={icon} size="3x" className="nav-card-icon" />
      </div>
      <h3 className="nav-card-heading">{heading}</h3>
      <p className="nav-card-description">{description}</p>
      <button className="nav-card-button" onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default NavCard;
