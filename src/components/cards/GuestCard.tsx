import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useFetchVisitors from "../../hooks/useFetchVisitor";
import "./styles.scss";

interface ICardListProps {
  handleLogout: (id: string) => Promise<void>; // Changed to Promise
}

const getFormattedName = (renderedFields: any): string => {
  if (renderedFields["Full Name"]) {
    return renderedFields["Full Name"];
  }

  if (renderedFields["Name"]) {
    return renderedFields["Name"];
  }

  const firstName =
    renderedFields["First Name"] ||
    renderedFields["FirstName"] ||
    renderedFields["Firstname"] ||
    renderedFields["firstname"];

  const lastName =
    renderedFields["Last Name"] ||
    renderedFields["LastName"] ||
    renderedFields["Lastname"] ||
    renderedFields["lastname"] ||
    renderedFields["Surname"] ||
    renderedFields["surname"];

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) return firstName;
  if (lastName) return lastName;

  return "Unknown Visitor";
};

const CardList: React.FC<ICardListProps> = ({ handleLogout }) => {
  const { visitors, mutate: mutateVisitors } = useFetchVisitors();
  const [searchParams] = useSearchParams();
  const categoryId = Number(searchParams.get("category"));
  const { user } = useFetchCurrentUser();

  const filteredVisitor = visitors?.filter(
    (visitor: any) =>
      visitor.userId === user.id && visitor.categoryId === categoryId
  );

  if (!filteredVisitor || filteredVisitor.length === 0) {
    return (
      <div className="no-data-container">
        <img src="/novisitors.svg" alt="No visitors" className="no-data-svg" />
        <p className="no-data-text">No visitors</p>
      </div>
    );
  }

  return (
    <div className="card-list">
      {filteredVisitor?.map((visitor: any) => (
        <CardItem
          handleLogOut={handleLogout}
          key={visitor?.id}
          id={visitor?.id}
          name={getFormattedName(visitor.renderedFields)}
          on_site={visitor?.onSite}
          mutateVisitors={mutateVisitors}
        />
      ))}
    </div>
  );
};

type CardItemProps = {
  id: string;
  name: string;
  on_site: boolean;
  handleLogOut: (id: string) => Promise<void>;
  mutateVisitors: () => Promise<any>;
};

const CardItem: React.FC<CardItemProps> = ({
  name,
  on_site,
  handleLogOut,
  id,
  mutateVisitors,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localOnSite, setLocalOnSite] = useState(on_site);

  const handleLogOutClick = async () => {
    setIsLoading(true);
    try {
      // Optimistically update the local state
      setLocalOnSite(false);
      await handleLogOut(id);
      await mutateVisitors(); // Refresh the visitors list
    } catch (error) {
      // Revert on error
      setLocalOnSite(true);
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-item" key={id}>
      <div className="user-info">
        <p className="name">{name}</p>
        {localOnSite ? (
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
      {localOnSite && (
        <button 
          className="status-button" 
          onClick={handleLogOutClick}
          disabled={isLoading}
          style={{ 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            position: 'relative'
          }}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      )}
    </div>
  );
};

export default CardList;