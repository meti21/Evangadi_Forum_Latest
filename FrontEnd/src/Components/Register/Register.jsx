import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Register.module.css";
import About from "../About/About";
import Header from "../Header/Header";
import { AuthContext } from "../Auth/Auth";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { firstname, lastname, username, email, password } = formData;
    if (!firstname || !lastname || !username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const result = await register(username, firstname, lastname, email, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.registerRoot}>
      <Header />
      {/* Main Split */}
      <main className={styles.registerMain}>
        {/* Left: Form */}
        <section className={styles.registerFormSection}>
          <h1 className={styles.registerTitle}>Register</h1>
          <form className={styles.registerForm} onSubmit={handleSubmit} autoComplete="off">
            <label className={styles.label}>First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter your First Name"
              value={formData.firstname}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <label className={styles.label}>Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter your Last Name"
              value={formData.lastname}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <label className={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a Username"
              value={formData.username}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <label className={styles.label}>Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={0}
                role="button"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {error && <div className="global-error">{error}</div>}
            <button type="submit" className={styles.registerBtn}>Register</button>
          </form>
          <div className={styles.signinRow}>
            Already have an account? <Link to="/signin" className={styles.signinLink}>Sign In</Link>
          </div>
        </section>
        {/* Right: Image/Marketing with About overlay */}
        <section className={styles.registerImageSection}>
          <div className={styles.registerImageOverlay}>
            <About />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
