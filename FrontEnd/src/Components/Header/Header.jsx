import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";
import { FaUserCircle } from "react-icons/fa";
import headImage from "../../assets/evangadi-logo-black.png";
import styles from "./Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/signIn", { replace: true }); 
  };
  return (
    <header className={styles.outer_container}>
      <div className={styles.inner_container}>
        <div className={styles["logo-container"]}>
          <Link to="/home">
            <img src={headImage} alt="Evangadi Logo" />
          </Link>
        </div>
        <div>
          
          <button
            className={styles["menu-toggle"]}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>

          <nav
            className={`${styles["nav-container"]} ${
              isMenuOpen ? styles.open : ""
            }`}
          >
            <ul className={styles["nav-list"]}>
              <li>
                <Link to="/home" className={styles.profileLink}>
                  <span>Home</span>
                </Link>
              </li>
              <li className={styles.divider} />
              <li>
                <Link to="/how-it-works" className={styles.profileLink}>
                  <span>How it Works</span>
                </Link>
              </li>
              <li className={styles.divider} />
              <li>
                <Link to="/profile" className={styles.profileLink}>
                  <span>Profile</span>
                </Link>
              </li>
              <li className={styles.divider} />
            </ul>

            <div>
              {isAuthenticated ? (
                <button
                  className={styles["button-container"]}
                  onClick={handleLogout}
                >
                  LOG OUT
                </button>
              ) : (
                <Link to="/signIn">
                  <button className={styles["button-container"]}>
                    SIGN IN
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

