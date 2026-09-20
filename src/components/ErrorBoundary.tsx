import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { smartKitchenDb } from '../db/smartKitchenDatabase';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Smart Kitchen Uncaught Error:', error, errorInfo);
  }

  private handleResetAndReload = () => {
    try {
      smartKitchenDb.resetToDefault();
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Something went wrong</h2>
              <p className="text-xs text-neutral-400">
                An unexpected error occurred while rendering the dashboard.
              </p>
              {this.state.error?.message && (
                <div className="mt-2 p-2 bg-neutral-950 rounded text-[11px] font-mono text-red-400 text-left overflow-x-auto border border-red-900/30">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={this.handleResetAndReload}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Data & Reload App</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Home className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
