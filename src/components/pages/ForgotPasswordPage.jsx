import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await authService.resetPassword(email);
      setSent(true);
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
          <Link to="/signin" className="inline-flex items-center gap-2 mb-6 group">
            <Icon
              name="arrow_back"
              className="text-2xl text-zinc-400 group-hover:text-white transition-colors"
            />
            <span className="text-zinc-400 group-hover:text-white transition-colors">
              Back to Sign In
            </span>
          </Link>

          <h1 className="text-4xl font-black text-white mb-2">
            Reset Password
          </h1>
          <p className="text-zinc-400">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="mark_email_read" className="text-3xl text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email Sent!</h2>
              <p className="text-zinc-400 mb-6">
                Check your inbox for a password reset link. If you don't see it,
                check your spam folder.
              </p>
              <Link
                to="/signin"
                className="text-green-500 hover:text-green-400 font-semibold transition-colors"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} fullWidth>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-zinc-400 mt-6">
          Remember your password?{" "}
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

export default ForgotPasswordPage;
