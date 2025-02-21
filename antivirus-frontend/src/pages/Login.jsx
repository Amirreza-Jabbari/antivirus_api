import PropTypes from "prop-types";
import Auth from "../components/Auth";

const Login = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Auth onLogin={onLogin} />
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
