import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      <p>PageNotFound</p>
      <Link to={"/dashboard"}>Go Back to Home</Link>
    </div>
  );
};

export default PageNotFound;
