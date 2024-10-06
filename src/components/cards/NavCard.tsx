import { FC } from "react";
import "./styles.scss";

interface INavCardProps {
  icon?: any;
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          width="60"
          height="60"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
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
