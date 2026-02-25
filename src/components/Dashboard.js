import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const tiles = [
  { title: 'Seat Booking', path: '/seat-booking' },
  { title: 'View Requests', path: '/view-requests' },
  { title: 'View Floor', path: '/view-floor' },
  { title: 'Reports', path: '/reports' },                           
  { title: 'TAH', path: '/tah' },
  { title: 'Settings', path: '/settings' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="dashboard">
        {tiles.map((tile, index) => (
          <div key={index} className="tile" onClick={() => navigate(tile.path)}>
            <h3>{tile.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
