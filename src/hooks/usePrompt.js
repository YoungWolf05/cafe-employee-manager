/**
 * usePrompt Hook
 * 
 * This custom hook is used to prompt the user with a confirmation message when they attempt to navigate away
 * from a page with unsaved changes. It leverages the `useBeforeUnload` hook from `react-router-dom` to handle
 * browser unload events and the `useEffect` hook to handle navigation within the application.
 * 
 * Key functionalities:
 * - Displays a confirmation dialog when the user attempts to close the browser tab or navigate away.
 * - Prevents navigation if the user cancels the confirmation dialog.
 * - Uses the `useBeforeUnload` hook to handle browser unload events.
 * - Uses the `useEffect` hook to handle in-app navigation events.
 * 
 * Dependencies:
 * - react-router-dom for navigation and handling browser unload events.
 * - React's `useEffect` hook for managing side effects.
 */
import { useEffect } from 'react';
import { useBeforeUnload, useNavigate, useLocation } from 'react-router-dom';

export const usePrompt = (message, when) => {
  const navigate = useNavigate();
  const location = useLocation();

  useBeforeUnload(
    (event) => {
      if (when) {
        event.preventDefault();
        event.returnValue = message;
      }
    },
    { capture: true }
  );

  useEffect(() => {
    if (!when) return;

    const handleBlockNavigation = (event) => {
      if (!window.confirm(message)) {
        event.preventDefault();
        navigate(location.pathname, { replace: true });
      }
    };

    window.addEventListener('beforeunload', handleBlockNavigation);

    return () => {
      window.removeEventListener('beforeunload', handleBlockNavigation);
    };
  }, [when, message, navigate, location]);
};