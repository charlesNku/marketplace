import React from 'react';
import { RefreshCw, ShoppingBag } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
          <div className="text-center max-w-md">
            <div className="bg-indigo-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="text-indigo-600" size={36} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-3">Something went wrong</h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              We're having trouble loading the marketplace. This is usually temporary — please try refreshing the page.
            </p>
            <button 
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
