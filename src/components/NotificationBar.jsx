import React from "react";
import "../styles/NotificationBar.css";

const NotificationBar = ({ notification }) => {
  if (!notification.message) {
    return null;
  }
  return (
    <div className={`notification ${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
};

export default NotificationBar;
