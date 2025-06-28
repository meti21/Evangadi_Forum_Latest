import { Link } from "react-router-dom";
import styles from "./QuestionList.module.css";
import { FaUserCircle, FaAngleRight } from "react-icons/fa";
import PropTypes from "prop-types";

const QuestionList = ({
  username,
  title,
  questionId,
  answerCount = 0,
  totalVotes = 0,
  views = 0,
  profilePic,
}) => {
  // Ensure answerCount is a number
  const numericAnswerCount = Number(answerCount) || 0;
  const isAnswered = numericAnswerCount > 0;
  
  // Debug logging
  console.log(`QuestionList Debug - Question ${questionId}:`);
  console.log(`  - Raw answerCount: ${answerCount} (type: ${typeof answerCount})`);
  console.log(`  - Numeric answerCount: ${numericAnswerCount} (type: ${typeof numericAnswerCount})`);
  console.log(`  - isAnswered: ${isAnswered}`);
  console.log(`  - Title: ${title}`);

  return (
    <div className={styles.questionsContainer}>
      <hr />

      <div className={styles.askQuestion}>
        <div className={styles.askUserInfo}>
          <div className={styles.askUser}>
            <Link
              to={`/question/${questionId}`}
              className={styles.userIconLink}
            >
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt={`${username}'s profile`} 
                  className={styles.profilePic}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <FaUserCircle className={styles.icon} size={65} style={{ display: profilePic ? 'none' : 'block' }} />
            </Link>
            <span className={styles.username}>
              {username || "Deleted User"}
            </span>
          </div>

          <div className={styles.askQuestionText}>
            <p className={styles.title}>{title}</p>

            <div className={styles.metaInfo}>
              <span>💬 {numericAnswerCount} answers</span>
              <span>👍 {totalVotes} votes</span>
              <span>👁️ {views} views</span>
              <span>{isAnswered ? "✅ Answered" : "❌ Unanswered"}</span>
            </div>
          </div>
        </div>

        <div className={styles.askArrow}>
          <Link to={`/question/${questionId}`} className={styles.arrowLink}>
            <FaAngleRight className={styles.icon} size={25} />
          </Link>
        </div>
      </div>

      <hr />
    </div>
  );
};

QuestionList.propTypes = {
  username: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  answerCount: PropTypes.number,
  totalVotes: PropTypes.number,
  views: PropTypes.number,
  profilePic: PropTypes.string,
};

export default QuestionList;
