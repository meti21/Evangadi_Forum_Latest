
import styles from "./About.module.css";
import { Link } from "react-router-dom";
function AboutInfo() {
  return (
    <div className={styles.aboutContainer}>
      <h1>Evangadi Networks Q&A</h1>
      <p>
        No matter what stage of life you are in, whether you’re just starting
        elementary school or being promoted to CEO of a Fortune 500 company, you
        have much to offer to those who are trying to follow in your footsteps.
      </p>
      <p>
        Whether you are willing to share your knowledge or you are just looking
        to meet mentors of your own, please start by joining the network here.
      </p>
      <Link to="/how-it-works" className={styles.button}>
        How it Works
      </Link>
    </div>
  );
}

export default AboutInfo;

