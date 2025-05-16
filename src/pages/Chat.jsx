import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Chat.css";
import { IoMdLogOut } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import { FiX } from "react-icons/fi";
import loaderGif from "../assets/loader.gif";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const goToSetAvatar = () => {
    sessionStorage.setItem("canAccessAvatar", "true");
    navigate("/setavatar");
  };

  if (loading) {
    return (
      <div className="chat-container loader-container">
        <img src={loaderGif} alt="Loading..." className="loader-gif" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="chat-container">
        <p>
          Error loading user. Please <a href="/">log in</a> again.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <button className="hamburger" onClick={() => setShowSidebar(!showSidebar)}>
        {showSidebar ? <FiX className="cross" /> : <TiThMenu className="menu" />}
      </button>

      <aside className={`sidebar ${showSidebar ? "visible" : ""}`}>
        <div>
          <div className="user-info">
            <div className="avatar-wrapper" onClick={goToSetAvatar} title="Edit Avatar">
              {user.avatar ? (
                <>
                  <img src={user.avatar} alt="avatar" className="avatar-img" />
                  <div className="edit-icon">
                    <MdEdit />
                  </div>
                </>
              ) : (
                <div className="avatar-placeholder">Set Avatar</div>
              )}
            </div>
            <h2 className="sidebar-title">Chats</h2>
            <p className="logged-user">@{user.username}</p>
          </div>

          <ul className="user-list">
            <li className="user">Alice</li>
            <li className="user active">Bob</li>
            <li className="user">Charlie</li>
          </ul>
        </div>

        <div className="btn-parent">
          <button className="logout-btn" onClick={handleLogout}>
            <IoMdLogOut className="outsymbol" /> Logout
          </button>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <h3>Bob</h3>
        </header>
        <div className="chat-messages">
          <div className="message received">
            <p>Hello! 👋</p>
            <span className="time">10:00 AM</span>
          </div>
          <div className="message sent">
            <p>Hey Bob, how are you?</p>
            <span className="time">10:02 AM</span>
          </div>
        </div>
        <form className="chat-input">
          <input type="text" placeholder="Type your message..." />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
};

export default Chat;
