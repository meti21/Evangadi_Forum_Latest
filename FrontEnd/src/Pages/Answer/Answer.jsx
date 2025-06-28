import React, { useEffect, useState } from "react";
import styles from "./Answer.module.css";
import { useParams, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaUserCircle } from "react-icons/fa";
import { questionsAPI, answersAPI } from "../../Utility/axios";
import { useNavigate } from "react-router-dom";

const AnswerPage = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTag, setEditedTag] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await questionsAPI.getQuestionById(questionId);
        setQuestion(qRes.data.question);


        setEditedTitle(qRes.data.question.title);
        setEditedDescription(qRes.data.question.description);
        setEditedTag(qRes.data.question.tag);

        const aRes = await answersAPI.getAnswersByQuestionId(questionId);
        setAnswers(aRes.data.answers);
        setErrorMessage("");
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "An unexpected error occurred while fetching data.";
        setErrorMessage(msg);
        console.error("Error fetching data:", msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption]);

  const handleUpdateAnswer = async (answerid) => {
    if (!editedText.trim()) {
      setErrorMessage("Answer cannot be empty!");
      return;
    }

    try {
      await answersAPI.updateAnswer(answerid, { answer: editedText });
      const updated = await answersAPI.getAnswersByQuestionId(questionId);
      setAnswers(updated.data.answers);
      setEditingAnswerId(null);
      setEditedText("");
      setSuccessMessage("✅ Answer updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to update answer.";
      setErrorMessage(msg);
    }
  };

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) {
      setErrorMessage("Answer cannot be empty!");
      return;
    }

    try {
      await answersAPI.postAnswer({
        answer: newAnswer,
        questionid: questionId,
      });
      const updated = await answersAPI.getAnswersByQuestionId(questionId);
      setAnswers(updated.data.answers);
      setNewAnswer("");
      setSuccessMessage("✅ Answer posted!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to post answer.";
      setErrorMessage(msg);
    }
  };

  const handleVote = async (answerid, vote) => {
    const currentUserId = parseInt(localStorage.getItem("userid"));
    const votedAnswer = answers.find((ans) => ans.answerid === answerid);

    if (votedAnswer?.userid === currentUserId) {
      alert("You can't vote on your own answer.");
      return;
    }

    try {
      const res = await answersAPI.voteAnswer({ answerid, vote });
      const updatedVotes = res.data.totalVotes;

      setAnswers((prev) =>
        prev.map((ans) =>
          ans.answerid === answerid ? { ...ans, totalVotes: updatedVotes } : ans
        )
      );
    } catch (err) {
      console.error("Voting failed:", err.response?.data?.msg || err.message);
      alert("You must be logged in to vote.");
    }
  };

  const handleDeleteAnswer = async (answerid) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    try {
      await answersAPI.deleteAnswer(answerid);
      const updated = await answersAPI.getAnswersByQuestionId(questionId);
      setAnswers(updated.data.answers);
      setSuccessMessage("🗑️ Answer deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to delete answer.";
      setErrorMessage(msg);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      setErrorMessage(""); // Clear any previous error
      await questionsAPI.deleteQuestion(questionId);
      setSuccessMessage("🗑️ Question deleted successfully!");
      setTimeout(() => {
        navigate("/home");
      }, 1000); // Optional small delay for success message
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete question."
      );
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTitle.trim() || !editedDescription.trim()) {
      alert("Title and description cannot be empty.");
      return;
    }

    try {
      await questionsAPI.updateQuestion(questionId, {
        title: editedTitle,
        description: editedDescription,
        tag: editedTag,
      });
      alert("Question updated successfully.");
      setQuestion((prev) => ({
        ...prev,
        title: editedTitle,
        description: editedDescription,
        tag: editedTag,
      }));
      setIsEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update question.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <ClipLoader color="#007bff" size={50} />
        <p>Loading...</p>
      </div>
    );
  }

  const sortedAnswers = [...answers].sort((a, b) => {
    if (sortOption === "votes")
      return (b.totalVotes ?? 0) - (a.totalVotes ?? 0);
    if (sortOption === "oldest")
      return new Date(a.createdate) - new Date(b.createdate);
    return new Date(b.createdate) - new Date(a.createdate);
  });

  const indexOfLastAnswer = currentPage * itemsPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - itemsPerPage;
  const paginatedAnswers = sortedAnswers.slice(
    indexOfFirstAnswer,
    indexOfLastAnswer
  );
  const totalPages = Math.ceil(sortedAnswers.length / itemsPerPage);
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className={styles.answerBg}>
      <div className="appContainer">
        <div className={styles.topSection}>
          <div className={styles.questionInfo}>
            {question && (
              <>
                <h2 className={styles.sectionTitle}>QUESTION</h2>
                <h3 className={styles.title}>💬 {question.title}</h3>
                <p className={styles.body}>{question.description}</p>
                <p>
                  <strong>Tag:</strong> {question.tag || "No tag"}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="card">
          {question ? (
            <>
              {!isEditing ? (
                <div className={styles.questionSection}>
                  <h2 className={styles.sectionTitle}>QUESTION</h2>
                  <h3 className={styles.title}>💬 {question.title}</h3>
                  <p className={styles.body}>{question.description}</p>
                  <p>
                    <strong>Tag:</strong> {question.tag || "No tag"}
                  </p>

                  {question.userid === parseInt(localStorage.getItem("userid")) && (
                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() => setIsEditing(true)}
                        className={styles.editButton}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={handleDeleteQuestion}
                        className={styles.deleteButton}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.editQuestionSection}>
                  <h2 className={styles.sectionTitle}>Edit Question</h2>

                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className={styles.questionTitleInput}
                    placeholder="Title"
                    required
                  />

                  <input
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className={styles.description}
                    placeholder="Description"
                    required
                  />

                  <input
                    type="text"
                    value={editedTag}
                    onChange={(e) => setEditedTag(e.target.value)}
                    className={styles.tagInput}
                    placeholder="Tag"
                  />

                  <div className={styles.buttonGroup}>
                    <button
                      onClick={handleSaveEdit}
                      className={styles.submitButton}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className={styles.cancelButton}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Loading question...</p>
          )}

          <div className={styles.answerSection}>
            <hr />
            <h3 className={styles.sectionTitle}>Answers From The Community</h3>
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
                <option value="votes">Most Votes</option>
              </select>
            </div>
            <hr />

            {paginatedAnswers.length === 0 ? (
              <p>No answers yet.</p>
            ) : (
              paginatedAnswers.map((answer) => {
                const isEditing = editingAnswerId === answer.answerid;
                const isUserAnswer =
                  answer.userid === parseInt(localStorage.getItem("userid"));

                return (
                  <div key={answer.answerid} className={styles.answer}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                    >
                      {answer.profile_pic ? (
                        <img 
                          src={answer.profile_pic} 
                          alt={`${answer.username}'s profile`} 
                          className={styles.profilePic}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {!answer.profile_pic && (
                        <span className={styles.profilePic} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <FaUserCircle size={65} className={styles.icon} />
                        </span>
                      )}
                      <div>
                        {isEditing ? (
                          <div className={styles.editAnswerSection}>
                            <h3 className={styles.sectionTitle}>Edit Your Answer</h3>
                            <textarea
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              className={styles.textarea}
                              placeholder="Your edited answer..."
                            />
                            <div className={styles.buttonGroup}>
                              <button
                                onClick={() => handleUpdateAnswer(answer.answerid)}
                                className={styles.postButton}
                              >
                                💾 Save Changes
                              </button>
                              <button
                                onClick={() => setEditingAnswerId(null)}
                                className={styles.cancelButton}
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p>{answer.answer}</p>
                            <div className={styles.metaInfo}>
                              <span className={styles.timestamp}>
                                {new Date(answer.createdate).toLocaleString()} —{" "}
                                {answer.username ? answer.username : "Deleted User"}
                              </span>
                              <br />
                              <span>👁️ Views: {answer.views ?? 0}</span>
                              &nbsp;&nbsp;
                              {answer.edited && (
                                <span style={{ color: "orange" }}>✏️ Edited</span>
                              )}
                              <br />
                              <span>👍 Votes: {answer.totalVotes ?? 0}</span>
                              &nbsp;&nbsp;
                              <button
                                onClick={() => handleVote(answer.answerid, 1)}
                              >
                                ⬆️
                              </button>
                              <button
                                onClick={() => handleVote(answer.answerid, -1)}
                              >
                                ⬇️
                              </button>
                              &nbsp;&nbsp;
                              {isUserAnswer && (
                                <>
                                  <button
                                    className={styles.editButton}
                                    onClick={() => {
                                      setEditingAnswerId(answer.answerid);
                                      setEditedText(answer.answer);
                                    }}
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    className={styles.deleteButton}
                                    onClick={() =>
                                      handleDeleteAnswer(answer.answerid)
                                    }
                                  >
                                    🗑️ Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div className={styles.paginationControls}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {safeTotalPages}
              </span>
              <button
                disabled={currentPage === safeTotalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, safeTotalPages))
                }
              >
                Next
              </button>
            </div>
          </div>

          <div className={styles.postAnswerSection}>
            <h3 className={styles.sectionTitle}>Answer The Top Question</h3>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            {successMessage && (
              <div className={styles.successBox}>
                <p>{successMessage}</p>
                <div className={styles.navigationOptions}>
                  <Link to="/home" className={styles.navButton}>
                    Go to Question page
                  </Link>
                </div>
              </div>
            )}
            
            <textarea
              className={styles.textarea}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Your answer ..."
            />
            <button onClick={handlePostAnswer} className={styles.postButton}>
              Post Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
