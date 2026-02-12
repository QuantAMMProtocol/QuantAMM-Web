import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: 16 }}>
        <h2>
          {error.status} {error.statusText}
        </h2>
        <p>
          {typeof error.data === 'string'
            ? error.data
            : 'Something went wrong.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Something went wrong.</h2>
    </div>
  );
}
