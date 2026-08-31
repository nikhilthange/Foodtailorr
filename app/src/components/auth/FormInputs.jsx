import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function TextInput({ id, label, error, ...props }) {
  return (
    <div className="auth-input-group">
      <input
        id={id}
        className={`auth-input ${error ? 'has-error' : ''}`}
        placeholder=" " /* Required for floating label */
        {...props}
      />
      <label htmlFor={id} className="auth-label">{label}</label>
      {error && <span className="auth-error-msg">{error}</span>}
    </div>
  );
}

export function PasswordInput({ id, label, error, ...props }) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="auth-input-group">
      <input
        id={id}
        type={show ? "text" : "password"}
        className={`auth-input ${error ? 'has-error' : ''}`}
        placeholder=" "
        {...props}
      />
      <label htmlFor={id} className="auth-label">{label}</label>
      <button 
        type="button" 
        className="auth-input-icon"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex="-1"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {error && <span className="auth-error-msg">{error}</span>}
    </div>
  );
}

export function AuthButton({ children, loading, ...props }) {
  return (
    <button 
      className="auth-button"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
          Processing...
        </>
      ) : children}
    </button>
  );
}
