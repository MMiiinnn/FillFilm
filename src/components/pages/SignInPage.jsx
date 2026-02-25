import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthForm from "../molecules/AuthForm";
import authService from "../../services/authService";
import Icon from "../atoms/Icon";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || "/";

  const handleSignIn = async (formData) => {
    setLoading(true);
    try {
      await authService.signIn(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      // Error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mt-10 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <Icon
              name="arrow_back"
              className="text-2xl text-zinc-400 group-hover:text-white transition-colors"
            />
            <span className="text-zinc-400 group-hover:text-white transition-colors">
              Back to Home
            </span>
          </Link>

          <h1 className="text-4xl font-black text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-zinc-400">
            Sign in to access your watchlist and personalized recommendations
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <AuthForm
            mode="signin"
            onSubmit={handleSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            loading={loading}
          />

          <div className="mt-4 text-center">
            <Link
              to="/reset-password"
              className="text-sm text-zinc-400 hover:text-green-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <p className="text-center text-zinc-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-500 hover:text-green-400 font-semibold transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
