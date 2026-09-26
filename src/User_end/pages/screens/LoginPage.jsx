import { useState } from 'react';
import styles from '../styles/login_page.module.css';
import loginCouple from '../../../assets/User_end_assets/login_couple.png';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const [isOtpView, setIsOtpView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    otp: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotHint, setForgotHint] = useState(false);

  const handleForgotPassword = () => {
    setForgotHint(true);
    setTimeout(() => setForgotHint(false), 3000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'Mobile Number / Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
      if (!emailRegex.test(formData.identifier) && !phoneRegex.test(formData.identifier)) {
        newErrors.identifier = 'Please enter a valid email or 10-digit mobile number';
      }
    }
    if (!isOtpView) {
      if (!formData.password) newErrors.password = 'Password is required';
    } else {
      if (!formData.otp) newErrors.otp = 'OTP is required';
      else if (!/^\d{6}$/.test(formData.otp)) newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await login(formData.identifier.trim().toLowerCase(), formData.password);
    setSubmitting(false);

    if (error) {
      setApiError(error);
      return;
    }

    window.location.hash = '#dashboard';
  };

  const toggleFormView = () => {
    setIsOtpView(!isOtpView);
    setErrors({});
    setApiError('');
  };

  return (
    <div className={styles.loginContainer}>
      {/* LEFT PANEL */}
      <div className={styles.leftPanel}>
        <div className={styles.imageCardWrapper}>
          <div className={styles.coupleCard}>
            <img src={loginCouple} alt="Wedding Couple" className={styles.coupleImg} />
          </div>
          <div className={styles.heartIcon}>
            <i className="ti ti-heart-filled"></i>
          </div>
          <div className={styles.badgeIcon}>
            <i className="ti ti-wifi"></i>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statPill}>
            <span className={styles.statValue}>50k+</span>
            <span className={styles.statLabel}>Happy Marriages</span>
          </div>
          <div className={styles.statPill}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Verified Profiles</span>
          </div>
        </div>

        <div className={styles.trustBadgesRow}>
          <div className={styles.trustBadge}>
            <i className="ti ti-shield-check"></i>
            <span>ISO Certified</span>
          </div>
          <div className={styles.trustBadge}>
            <i className="ti ti-lock"></i>
            <span>100% Secure</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.rightPanel}>
        <h1 className={styles.heading}>Welcome Back</h1>
        <p className={styles.subtext}>Sign in to continue your matchmaking journey</p>

        <div className={styles.formCard}>
          {/* Global API error */}
          {apiError && (
            <div className={styles.apiError} role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            {/* Identifier Field */}
            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Mobile Number / Email</label>
              </div>
              <div className={styles.inputWrapper}>
                <i className="ti ti-user"></i>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter your registered contact"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
              {errors.identifier && <span className={styles.errorHint}>{errors.identifier}</span>}
            </div>

            {/* Password or OTP */}
            {!isOtpView ? (
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Password</label>
                  <button type="button" className={styles.forgotLink} onClick={handleForgotPassword}>
                    Forgot Password?
                  </button>
                </div>
                <div className={styles.inputWrapper}>
                  <i className="ti ti-lock"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className={styles.eyeToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? 'ti ti-eye-off' : 'ti ti-eye'}></i>
                  </button>
                </div>
                {errors.password && <span className={styles.errorHint}>{errors.password}</span>}
                {forgotHint && (
                  <span className={styles.forgotHint}>
                    A reset link will be sent to your registered email.
                  </span>
                )}
              </div>
            ) : (
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Mobile OTP</label>
                  <span className={styles.resendOtp}>Resend OTP</span>
                </div>
                <div className={styles.inputWrapper}>
                  <i className="ti ti-shield-lock"></i>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                </div>
                {errors.otp && <span className={styles.errorHint}>{errors.otp}</span>}
              </div>
            )}

            {/* Options Row */}
            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                Remember Me
              </label>
              <button type="button" className={styles.otpLink} onClick={toggleFormView}>
                {isOtpView ? 'Login with Password' : 'Login with Mobile OTP'}
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className={styles.signInBtn} disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In →'}
            </button>

            <button
              type="button"
              className={styles.otpBtn}
              onClick={() => { if (!isOtpView) toggleFormView(); }}
            >
              Continue with OTP
            </button>
          </form>

          <div className={styles.createAccountRow}>
            Don't have an account?{' '}
            <a href="#register" className={styles.createAccountLink}>
              Create Account
            </a>
          </div>
        </div>

        <div className={styles.trustLine}>TRUSTED BY MILLIONS ACROSS INDIA</div>
      </div>
    </div>
  );
}
