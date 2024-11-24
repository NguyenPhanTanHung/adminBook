import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Outlet, Link } from 'react-router-dom';
import { auth } from "../firebase/config";
import { signOut } from '@firebase/auth';

const Dashboard = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9', height: '100vh' }}>
      {/* Navbar */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#000',
          color: '#fff',
          height: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/products" style={{ color: '#fff', textDecoration: 'none' }}>Sản Phẩm</Link>
          <Link to="/users" style={{ color: '#fff', textDecoration: 'none' }}>Người dùng</Link>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser && (
            <>
              <span>{currentUser.email}</span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#ff4d4f',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: '1.5rem', backgroundColor: '#fff', overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
