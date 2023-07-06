import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css'; 
import Baner from '../header';
import Under from '../footer';
interface UserProfile {
  userid: string;
  name: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userID = localStorage.getItem('UserID');
  
    if (userID) {
      fetch(`http://localhost:8000/accounts/profile/${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // include authentication headers, if any
        },
        credentials: 'include', // or 'same-origin' if your backend is on the same domain
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setProfile(data);
        })
        .catch((error) => {
          setError("Error fetching profile data");
          console.error(error);
        });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('UserProfile');
    setProfile(null);
  };

  return (
    <div className="profile-container">
        <Baner />
      {error && <p className="error">{error}</p>}
      {profile ? (
        <div className='profile'>
          <h1 className="profile-title">YourProfile</h1>
          <p className="profile-text">UserID: {profile.userid}</p>
          <p className="profile-text">Name: {profile.name}</p>
          <button className="profile-button" onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="auth-buttons">
          <h2>ログインか新規登録をしてください！</h2>
          <button className="profile-button" onClick={() => navigate("/login")}>Login</button>
          <button className="profile-button" onClick={() => navigate("/sighup")}>Sign Up</button>
        </div>
      )}
      <Under />
    </div>
  );
}

export default Profile;
