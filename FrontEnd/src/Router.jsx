import { Route, Routes } from "react-router-dom";

import Layout from "./Components/Layout/Layout";

import Home from "./Pages/Home/Home";
import Landing from "./Pages/Landing/Landing";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import QuestionPage from "./Pages/Question/QuestionPage";
import AnswerPage from "./Pages/Answer/Answer";
import HowItWorks from "./Pages/HowItWorks/HowItWorks";
import Profile from "./Pages/Profile/Profile";
import Register from "./Components/Register/Register";
import SignIn from "./Components/SignIn/SignIn";

function Router() {
  return (
    <Routes>
      {/* Landing page - default route */}
      <Route path="/" element={<Landing />} />
      
      {/* Authentication routes */}
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/how-it-works"
        element={
            <Layout>
              <HowItWorks/>
            </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/askQuestion"
        element={
          <ProtectedRoute>
            <Layout>
              <QuestionPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/question/:questionId"
        element={
          <ProtectedRoute>
            <Layout>
              <AnswerPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default Router;

