import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      <p>PageNotFound</p>
      <Link to={"/"}>Go Back to Home</Link>
    </div>
  );
};

export default PageNotFound;
