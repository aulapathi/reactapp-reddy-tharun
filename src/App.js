import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SeatBooking from './components/pages/SeatBooking';
import ViewRequests from './components/pages/ViewRequests';
import ViewFloor from './components/pages/ViewFloor';
import Reports from './components/pages/Reports';
import TAH from './components/pages/TAH';
import Settings from './components/pages/Settings';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
         <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
        <Route path="/view-requests" element={<ViewRequests />} />
        <Route path="/view-floor" element={<ViewFloor />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tah" element={<TAH />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
