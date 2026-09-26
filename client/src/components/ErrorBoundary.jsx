import React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Skill Setu Caught Exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-6 text-gray-800">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-xl border-t-4 border-[#0B3D91] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-[11px] font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              Government of India • Ministry of Statistics & Programme Implementation
            </div>

            <h2 className="text-xl font-bold font-serif-gov text-gray-900 mb-2">
              Skill Setu Portal Notification
            </h2>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              An unexpected interface rendering issue was intercepted. You can reload the portal or dismiss to recover.
            </p>

            {this.state.error && (
              <div className="bg-gray-100 p-3 rounded text-[11px] font-mono text-gray-700 text-left overflow-x-auto mb-6 border border-gray-300">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={this.handleReset}
                className="bg-[#0B3D91] hover:bg-[#07265D] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Portal</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dismiss & Continue</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
