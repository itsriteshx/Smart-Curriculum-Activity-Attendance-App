import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center', border: '1px solid var(--danger)' }}>
          <h3>Something went wrong</h3>
          <p style={{ color: 'var(--text-muted)', margin: '12px 0' }}>An unexpected error occurred in this view.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
