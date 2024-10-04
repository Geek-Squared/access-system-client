import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import "./styles.scss";

interface ICardListProps {
  handleLogout: (id: string) => void;
}

const CardList: React.FC<ICardListProps> = ({ handleLogout }) => {
  const fetchGuests = useQuery(api.visitor.get);

  return (
    <div className="card-list">
      {fetchGuests?.map((user) => (
        <CardItem
          handleLogOut={handleLogout}
          key={user._id}
          id={user._id}
          name={user.name}
          on_site={user.on_site}
        />
      ))}
    </div>
  );
};

type CardItemProps = {
  id: string;
  name: string;
  on_site: boolean;
  handleLogOut: (id: string) => void;
};

const CardItem: React.FC<CardItemProps> = ({
  name,
  on_site,
  handleLogOut,
  id,
}) => {
  return (
    <div className="card-item" key={id}>
      <div className="user-info">
        <p className="name">{name}</p>
        {on_site ? (
          <p
            className="description"
            style={{
              color: "rgb(255, 53, 53)",
            }}
          >
            On-site
          </p>
        ) : (
          <p className="description">Logged Out</p>
        )}
      </div>
      {on_site ? (
        <button className="status-button" onClick={() => handleLogOut(id)}>
          Logout
        </button>
      ) : null}
    </div>
  );
};

export default CardList;