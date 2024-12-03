"use client";

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Alert className="max-w-md">
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || 'An unexpected error occurred.'}
        </AlertDescription>
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      </Alert>
    </div>
  );
}