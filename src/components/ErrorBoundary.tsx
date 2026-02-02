'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
                    <p className="text-sm text-zinc-500 mb-4 max-w-xs">
                        An error occurred while loading this section.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] text-white text-sm font-medium hover:bg-white/[0.1] transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional wrapper for async components
export function withErrorBoundary<T extends object>(
    Component: React.ComponentType<T>,
    fallback?: ReactNode
) {
    return function WrappedComponent(props: T) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
