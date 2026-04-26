import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AIONIS Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/50 text-sm mb-4 max-w-xs">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Reset & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
