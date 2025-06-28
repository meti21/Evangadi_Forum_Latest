import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Components/Auth/Auth";
import { questionsAPI } from "../../Utility/axios";
import QuestionList from "../../Components/QuestionList/QuestionList";
import { Button, Spinner } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 4;

  useEffect(() => {
    fetchQuestions();
    
    // Check if questions need to be refreshed (after posting an answer)
    const questionsUpdated = localStorage.getItem('questionsUpdated');
    if (questionsUpdated === 'true') {
      fetchQuestions();
      localStorage.removeItem('questionsUpdated');
    }
    
    // Refresh questions when user returns to the page (e.g., from answer page)
    const handleFocus = () => {
      fetchQuestions();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Prevent browser back button from going beyond home page
    const handleBeforeUnload = (e) => {
      if (window.history.length > 1) {
        // Replace current history entry to prevent going back
        window.history.replaceState(null, null, window.location.href);
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = (e) => {
      // If user tries to go back, redirect to home
      if (window.location.pathname !== '/home') {
        navigate('/home', { replace: true });
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Replace current history entry to prevent going back
    window.history.replaceState(null, null, window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('focus', handleFocus);
    };
  }, [navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await questionsAPI.getAllQuestions();
      if (response.status === 200 && response.data.questions) {
        console.log("Questions data:", response.data.questions);
        // Debug: Log each question's answerCount
        response.data.questions.forEach((q, index) => {
          console.log(`Question ${index + 1}: answerCount = ${q.answerCount}, type = ${typeof q.answerCount}`);
        });
        setAllQuestions(response.data.questions);
        setError("");
      } else {
        setError("No questions available");
      }
    } catch (err) {
      console.error(err);
      setError("No questions available");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = () => navigate("/askQuestion");

  // const seeMore = () => setDisplayCount((count) => count + 10);
  // const seeLess = () => setDisplayCount(4);
  const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedQuestions = [...allQuestions]
    .sort((a, b) => {
      if (sortOption === "views") return (b.views ?? 0) - (a.views ?? 0);
      if (sortOption === "oldest") return new Date(a.createdate) - new Date(b.createdate);
      return new Date(b.createdate) - new Date(a.createdate); // default: newest
    })
    // .slice(0, displayCount);
    const paginatedQuestions = sortedQuestions.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(allQuestions.length / itemsPerPage);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className={styles.homeBg}>
      <div className={styles.homeContainer}>
        <div className={styles.homeContent}>
          <div className={styles.topSection}>
            <button className={styles.askQuestionBtn} onClick={handleAskQuestion}>
              Ask Question
            </button>
            <div className={styles.welcomeMessage}>
              <div className={styles.profileSection}>
                {user?.profile_pic ? (
                  <img 
                    src={user.profile_pic} 
                    alt="Profile" 
                    className={styles.profilePic}
                  />
                ) : (
                  <FaUserCircle className={styles.defaultProfilePic} />
                )}
                <h3>Welcome, {user?.username || "Deleted User"}!</h3>
              </div>
            </div>
          </div>
          <section className={styles.questionsSection}>
            <div className={styles.questionsHeader}>
              <h2 className={styles.questionsTitle}>Questions</h2>
              <div className={styles.sortContainer}>
                <label htmlFor="sort">Sort by: </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>
            <hr />
            <div className={styles.questionsList}>
              {paginatedQuestions.length === 0 ? (
                <div className={styles.noQuestions}>
                  <p>{error}</p>
                </div>
              ) : (
                paginatedQuestions.map((q) => (
                  <QuestionList
                    key={q.questionid || q.id}
                    username={q.username}
                    title={q.title}
                    userId={q.userid}
                    questionId={q.questionid}
                    views={q.views}
                    answerCount={q.answerCount || 0}
                    totalVotes={parseInt(q.totalVotes) || 0}
                    profilePic={q.profile_pic}
                  />
                ))
              )}
            </div>
            <div className={styles.paginationControls}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
              >
                Previous
              </button>
              <span className={styles.pageNumber}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
