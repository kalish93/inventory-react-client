import { useEffect } from "react";

const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
  ];
  
interface AppLogoutProps {
  children: any; // Specify children prop type as ReactNode
}

const AppLogout: React.FC<AppLogoutProps> = ({ children }) => {
  let timer: NodeJS.Timeout;
  
  // this function sets the timer that logs out the user after 10 secs
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logoutAction();
    }, 600000); // 600000ms = 10 minutes
  };
  
  // this resets the timer if it exists.
  const resetTimer = () => {

    if (timer) clearTimeout(timer);
  };
  
  // when component mounts, it adds an event listeners to the window
  // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 10 secs of inactivity resets.
  // However, if none of the event is triggered within 10 mins, that is app is inactive, the app automatically logs out.

useEffect(() => {
    const eventListener = () => {
      resetTimer(); // Reset timer on any user activity
      handleLogoutTimer(); // Reset timer after activity
    };
  
    Object.values(events).forEach((eventName) => {
      window.addEventListener(eventName, eventListener);
    });
  
    handleLogoutTimer(); // Start the initial timer
  
    // Cleanup: Remove event listeners when component unmounts
    return () => {
      Object.values(events).forEach((eventName) => {
        window.removeEventListener(eventName, eventListener);
      });
    };
  }, []);
  
  
  // logs out user by clearing out auth token in localStorage and redirecting url to /signin page.
  const logoutAction = () => {
    localStorage.clear();
    window.location.pathname = "/login";
  };
  
    return children;
  };
  
  export default AppLogout;