// import React from 'react';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('Error caught by ErrorBoundary:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="flex flex-col items-center justify-center h-screen text-center p-4">
//           <h1 className="text-2xl font-semibold text-red-500">Oops! Something went wrong.</h1>
//           <p className="text-gray-600 mb-4">Try refreshing the page or go back.</p>
//           {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-lg">
//             <h2 className="text-lg font-semibold text-gray-700">Error Details:</h2>
//             <p className="text-sm text-gray-600 mt-2">{String(this.state.error)}</p>
//           </div> */}
//           <button
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
//             onClick={() => this.setState({ hasError: false, error: null })}
//           >
//             Try Again
//           </button>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;


import React from 'react';
import { AlertTriangle, CircleAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className=" flex flex-col items-center justify-center pt-15 text-center">
          <div className="bg-white p-8 rounded-xl max-w-lg w-full">
            <div className="flex items-center justify-center text-orange-500 mb-4">
              <CircleAlert className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-base text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              An unexpected error has occurred. Please try again or contact support if the problem
              persists.
            </p>
            {/* <div className="bg-gray-100 text-sm text-gray-700 p-4 rounded-lg text-left break-words">
              <strong>Error Details:</strong>
              <pre className="whitespace-pre-wrap mt-2">{String(this.state.error)}</pre>
            </div> */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 hover:shadow-sm px-4 py-2 border border-gray-200  font-semibold rounded-xl  transition"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 hover:shadow-sm px-4 py-2 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-500 transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
