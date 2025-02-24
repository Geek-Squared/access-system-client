import { FC } from "react";
import "./styles.scss";

interface INavCardProps {
  icon?: any;
  heading: string;
  description: string;
  handleClick: () => void;
  buttonText: string;
  secondButtonText?: string;
}

const NavCard: FC<INavCardProps> = ({
  icon,
  heading,
  description,
  handleClick,
  buttonText,
  secondButtonText,
}) => {
  return (
    <div className="nav-card-container">
      <div className="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="size-6"
          width="60"
          height="60"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="nav-card-heading">{heading}</h3>
      <p className="nav-card-description">{description}</p>
      <div className="button-container">
        <button className="nav-card-button" onClick={handleClick}>
          {buttonText}
        </button>
        <button className="nav-card-button" onClick={handleClick}>
          {secondButtonText}
        </button>
      </div>
    </div>
  );
};

export default NavCard;
