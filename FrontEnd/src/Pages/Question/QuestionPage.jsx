import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../Utility/axios";
import { FaArrowRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import styles from "./Question.module.css";

const predefinedTags = [
  "JavaScript",
  "React",
  "Node.js",
  "CSS",
  "HTML",
  "Python",
  "Databases",
  "API",
  "Other",
];

function QuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation: if "Other" is selected, newTag must be provided
    if (selectedTag === "") {
      setError("Please select a tag or choose 'Other' to add a new one.");
      return;
    }
    if (selectedTag === "Other" && newTag.trim() === "") {
      setError("Please enter your new tag.");
      return;
    }

    setLoading(true);
    try {
      // If "Other", send the newTag instead of selectedTag
      const tagToSend = selectedTag === "Other" ? newTag.trim() : selectedTag;

      await axiosInstance.post("/api/question", {
        title,
        description,
        tag: tagToSend,
      });

      setSuccess("Question posted successfully!");

      setTitle("");
      setDescription("");
      setSelectedTag("");
      setNewTag("");

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.error("Error posting question:", err);
      setError(
        err.response?.data?.message ||
          "Failed to post question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.questionBg}>
      <div className={styles.questionContainer}>
        <h1 className={styles.sectionTitle}>Ask a Question</h1>
        <div className={styles.stepsCard}>
          <h2 className={styles.stepsTitle}>💬 Steps to write a good question</h2>
          <ul className={styles.stepsList}>
            <li>
              <FaArrowRight className={styles.listIcon} />
              Summarize your problem in a one-line title
            </li>
            <li>
              <FaArrowRight className={styles.listIcon} />
              Describe your problem in more detail
            </li>
            <li>
              <FaArrowRight className={styles.listIcon} />
              Explain what you tried and what you expected to happen
            </li>
            <li>
              <FaArrowRight className={styles.listIcon} />
              Review your question and post it to the site
            </li>
          </ul>
        </div>
        {error && <div className="global-error">{error}</div>}
        {success && (
          <div className="global-success">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.postQuestionForm}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.questionTitleInput}
            required
          />
          <textarea
            placeholder="Question Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.questionDetailsTextarea}
            required
          />
          <div className={styles.tagSelectContainer}>
            <select
              className={`${styles.tagInput} ${styles.selectTag}`}
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a tag
              </option>
              {predefinedTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          {selectedTag === "Other" && (
            <input
              type="text"
              placeholder="Write your new tag"
              className={`${styles.tagInput} ${styles.fadeIn}`}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              required
              autoFocus
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Submitting..." : "Post Your Question"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuestionPage;
