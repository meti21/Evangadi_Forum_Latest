import React from "react";
import styles from "./HowItWorks.module.css";
import { FaUserPlus, FaSignInAlt, FaQuestionCircle, FaEye, FaPenFancy, FaSignOutAlt, FaHandsHelping } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus className={styles.stepIcon} />, 
    title: "User Registration",
    description: "To join Evangadi Networks Q&A, you need to create an account. Follow these steps:",
    list: [
      'Click on the "Sign In" button in the top-right corner.',
      'Switch to the "Create a new account" form.',
      'Fill in the required fields: Username, First Name, Last Name, Email, and Password.',
      'Click on the "Agree and Join" button to register.',
      'You will receive a confirmation message upon successful registration.'
    ]
  },
  {
    icon: <FaSignInAlt className={styles.stepIcon} />, 
    title: "User Login",
    description: "Once you have registered, you can log in to your account:",
    list: [
      'Click on the "Sign In" button in the top-right corner.',
      'Enter your registered Email and Password.',
      'Click on the "Login" button to access your account.'
    ]
  },
  {
    icon: <FaQuestionCircle className={styles.stepIcon} />, 
    title: "Asking a Question",
    description: "To ask a new question:",
    list: [
      'After logging in, click on the "Ask Question" button on the Home page.',
      'Fill in the "Title" and "Description" fields with your question details.',
      'Click on the "Post Your Question" button to submit.',
      'Your question will appear on the Home page for the community to view and answer.'
    ]
  },
  {
    icon: <FaEye className={styles.stepIcon} />, 
    title: "Viewing Questions and Answers",
    description: "To browse and view questions and their answers:",
    list: [
      'Navigate to the Home page to see a list of recent questions.',
      'Click on a question title to view its details and existing answers.',
      "If there are no answers, you'll see a prompt encouraging you to answer."
    ]
  },
  {
    icon: <FaPenFancy className={styles.stepIcon} />, 
    title: "Submitting an Answer",
    description: "To answer a question:",
    list: [
      'Navigate to the question you want to answer.',
      'Scroll down to the "Answer The Top Question" section.',
      'Type your answer in the provided textarea.',
      'Click on the "Post Your Answer" button to submit.',
      'Your answer will appear under the community answers section.'
    ]
  },
  {
    icon: <FaSignOutAlt className={styles.stepIcon} />, 
    title: "Logging Out",
    description: "To securely log out of your account:",
    list: [
      'Click on the "Logout" button located in the header/navigation bar.',
      'This will clear your session and redirect you to the login page.'
    ]
  },
  {
    icon: <FaHandsHelping className={styles.stepIcon} />, 
    title: "Support and Feedback",
    description: "If you encounter any issues or have suggestions:",
    list: [
      'Contact our support team through the "About" page.',
      'Provide feedback using the feedback form available in your profile.'
    ],
    isList: false
  }
];

const HowItWorks = () => {
  return (
    <div className={styles.howItWorksBgModern}>
      <div className={styles.howtoContainerModern}>
        <h1 className={styles.howtoTitleModern}>How It Works</h1>
        <div className={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <div className={styles.stepCard} key={step.title}>
              <div className={styles.iconCircle}>{step.icon}</div>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepDescription}>{step.description}</p>
              {step.list && (
                <ul className={styles.stepList}>
                  {step.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;