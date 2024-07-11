import React, { useState } from "react";

import "./styles/ProfileDisplay.scss";

const ProfileDisplay = ({
  userProfileId,

  onClose,
}) => {
  return (
    <div className="profile_display">
      <div className="profile_card">
        <p>{userProfileId.username}</p>
        <img src={userProfileId.image} alt=" userProfileId" />
        <p>Email:</p>
        <p>{userProfileId.email}</p>
        <button
          onClick={() => {
            onClose();
            // Reset loggedinUserProfile state
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
