import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../molecules/AuthForm";
import authService from "../../services/authService";
import Icon from "../atoms/Icon";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (formData) => {
    setLoading(true);
    try {
      await authService.signUp(
        formData.email,
        formData.password,
        formData.displayName
      );
      navigate("/");
    } catch (error) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
      navigate("/");
    } catch (error) {
      // Error handled
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
            Join FillFilm
          </h1>
          <p className="text-zinc-400">
            Create an account to save your favorite movies and get personalized
            recommendations
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <AuthForm
            mode="signup"
            onSubmit={handleSignUp}
            onGoogleSignIn={handleGoogleSignIn}
            loading={loading}
          />
        </div>

        {/* Sign In Link */}
        <p className="text-center text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-green-500 hover:text-green-400 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
