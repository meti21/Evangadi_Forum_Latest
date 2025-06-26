import React from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <div className={styles.landingBg}>
      <div className={styles.stickyHeader}>
        <Header />
      </div>
      <div className={styles.landingContent}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Welcome to Evangadi Forum</h1>
          <p className={styles.heroSubtitle}>
            Connect, ask questions, and get answers from the Evangadi community.
          </p>
          <div className={styles.buttonGroup}>
            <Link to="/register" className={`${styles.ctaButton} ${styles.primaryButton}`}>Sign Up</Link>
            <Link to="/signin" className={`${styles.ctaButton} ${styles.secondaryButton}`}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;


