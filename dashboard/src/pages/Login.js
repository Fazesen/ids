import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuroraBackground from "./AuroraBackground";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      navigate("/alerts");
      console.log(res.data);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // For now, just show a message
    setErrorMessage(`Social login with ${provider} is not implemented yet. Please use email/password.`);
  };

  const handleForgotPassword = () => {
    setErrorMessage("Forgot password functionality is not implemented yet.");
  };

  const handleSignUp = () => {
    setErrorMessage("Sign up functionality is not implemented yet.");
  };

  const handleTermsOfService = () => {
    setErrorMessage("Terms of Service page is not implemented yet.");
  };

  const handlePrivacyPolicy = () => {
    setErrorMessage("Privacy Policy page is not implemented yet.");
  };

  const handleGetStarted = () => {
    navigate("/alerts");
  };

  const handleLearnMore = () => {
    setErrorMessage("Learn more about the application features.");
  };

  return (
    <div className="login-container">
      {/* Aurora Background with React Bits theme */}
      <AuroraBackground 
        colorStops={['#6366f1', '#8b5cf6', '#6366f1']}
        amplitude={1.2}
        blend={0.4}
        speed={0.6}
      />
      
      <div className="login-content">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">⚡</div>
            <h1 className="logo-text">LPU IDS</h1>
          </div>
          <div className="page-subtitle">
            <h2>Become emboldened by the flame of ambition</h2>
          </div>
        </div>
        
        <div className="login-card-container">
          <div className="login-form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Welcome back</h2>
              <p className="form-subtitle">
                Login with your email or social account
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              {errorMessage && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errorMessage}
                </div>
              )}

              <div className="form-group">
                <div className="social-buttons">
                  <button 
                    type="button" 
                    className="social-button"
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-icon">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Apple
                  </button>
                  <button 
                    type="button" 
                    className="social-button"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-icon">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </button>
                </div>
                
                <div className="separator">
                  <span className="separator-line"></span>
                  <span className="separator-text">Or continue with</span>
                  <span className="separator-line"></span>
                </div>
                
                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="input-group">
                  <div className="input-label-row">
                    <label htmlFor="password" className="input-label">
                      Password
                    </label>
                    <button
                      type="button"
                      className="forgot-password-button"
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input" 
                    required 
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Authenticating...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
                
                <p className="signup-link">
                  Don't have an account? 
                  <button 
                    type="button" 
                    className="signup-button"
                    onClick={handleSignUp}
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
          
          <div className="terms-notice">
            By clicking continue, you agree to our 
            <button 
              type="button" 
              className="terms-button"
              onClick={handleTermsOfService}
            >
              Terms of Service
            </button>
            and 
            <button 
              type="button" 
              className="terms-button"
              onClick={handlePrivacyPolicy}
            >
              Privacy Policy
            </button>.
          </div>
        </div>
        
        <div className="login-footer">
          <div className="footer-actions">
            <button 
              type="button" 
              className="footer-button"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
            <button 
              type="button" 
              className="footer-button"
              onClick={handleLearnMore}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}