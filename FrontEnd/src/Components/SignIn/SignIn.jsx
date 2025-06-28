import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./SignIn.module.css";
import About from "../About/About";
import Header from "../Header/Header";
import { AuthContext } from "../Auth/Auth";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = formData;
    const result = await login(email, password);
    if (result.success) {
      navigate("/home");
    } else {
      console.log("Login error:", result.message);
      setError(result.message);
    }
  };

  return (
    <div className={styles.signinRoot}>
      <Header />
      {/* Main Split */}
      <main className={styles.signinMain}>
        {/* Left: Form */}
        <section className={styles.signinFormSection}>
          <h1 className={styles.signinTitle}>Login</h1>
          <form className={styles.signinForm} onSubmit={handleSubmit}>
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
            <div className={styles.passwordWrapper}>
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
            <div className={styles.formFooter}>
            </div>
            <button type="submit" className={styles.signinBtn}>Login</button>
          </form>
          {error && (
            <div className="global-error" style={{marginTop: '1rem', marginBottom: '1rem'}}>
              {error}
            </div>
          )}
          <div className={styles.signupRow}>
            Don't have an account? <Link to="/register" className={styles.signupLink}>Sign Up</Link>
          </div>
        </section>
        {/* Right: Image/Marketing with About overlay */}
        <section className={styles.signinImageSection}>
          <div className={styles.signinImageOverlay}>
            <About />
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignIn;
