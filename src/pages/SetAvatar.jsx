import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './SetAvatar.css';
import toast, { Toaster } from 'react-hot-toast';

const avatarOptions = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Tom',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucy',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Ziggy',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=PixelPunk',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bubbles',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Cosmo',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=NovaStar',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=RocketRex',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jellybean',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=FunkyFritz',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=CaptainZest',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=LunaLoop',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Giggles'
];

function SetAvatar() {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return navigate("/login");
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error("User data error:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedAvatar) return toast.error("Please select an avatar");

    try {
      await API.post(
        '/auth/set-avatar',
        { avatar: selectedAvatar },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = { ...user, avatar: selectedAvatar };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Avatar set successfully!");

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      toast.error("Error setting avatar");
    }
  };

  if (loading) {
    return (
      <div className="avatar-container">
        <Toaster />
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="avatar-container">
      <Toaster />
      <h2>Choose Your Avatar</h2>
      <div className="avatar-grid">
        {avatarOptions.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index}`}
            className={`avatar ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => setSelectedAvatar(avatar)}
          />
        ))}
      </div>
      <button onClick={handleSubmit} className="submit-avatar-btn">
        Set Avatar
      </button>
    </div>
  );
}

export default SetAvatar;
