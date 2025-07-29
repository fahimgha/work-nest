import { Link } from "react-router-dom";

const FeatureCard = ({ name, src, href, description }) => {
  return (
    <Link to={href}>
      <div className="feature-card">
        <h1 className="feature-title">{name}</h1>
        <p className="feature-description">{description}</p>
      </div>
    </Link>
  );
};

export default FeatureCard;
