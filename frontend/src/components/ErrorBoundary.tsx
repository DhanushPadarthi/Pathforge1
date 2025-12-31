'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Alert, Button, Card } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (Sentry, LogRocket, etc.)
      console.error('Production error:', { error, errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Card className="shadow-sm">
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto text-danger"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <h2 className="mb-3">Oops! Something went wrong</h2>
              <p className="text-muted mb-4">
                We're sorry for the inconvenience. An unexpected error occurred while
                processing your request.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert variant="danger" className="text-start mb-4">
                  <Alert.Heading>Error Details (Development Only)</Alert.Heading>
                  <p className="mb-2">
                    <strong>Message:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">Stack Trace</summary>
                      <pre className="mt-2 p-3 bg-light rounded" style={{ fontSize: '12px', overflow: 'auto' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </Alert>
              )}

              <div className="d-flex gap-3 justify-content-center">
                <Button variant="primary" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button variant="outline-secondary" onClick={() => window.location.href = '/'}>
                  Go to Home
                </Button>
              </div>

              <p className="text-muted mt-4 small">
                If this problem persists, please contact support or try refreshing the page.
              </p>
            </Card.Body>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
