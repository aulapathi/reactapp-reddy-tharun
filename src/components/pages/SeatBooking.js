// // export default SeatBooking;
// import React, { useState, useCallback } from 'react';
// import '../../styles/SeatBooking.css';
// import seatBg from '../../assets/seat-bg.jpg.avif';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import TextField from '@mui/material/TextField';

// // helpers
// const isSameDay = (d1, d2) =>
//   d1.getFullYear() === d2.getFullYear() &&
//   d1.getMonth() === d2.getMonth() &&
//   d1.getDate() === d2.getDate();

// const roundUpToNext30KeepExact = (date) => {
//   const d = new Date(date);
//   d.setSeconds(0, 0);
//   const m = d.getMinutes();
//   const rem = m % 30;
//   if (rem === 0) return d;
//   d.setMinutes(m + (30 - rem));
//   return d;
// };

// const addMinutes = (date, mins) => {
//   const d = new Date(date);
//   d.setMinutes(d.getMinutes() + mins);
//   return d;
// };

// const isWeekend = (date) => {
//   const d = new Date(date);
//   const day = d.getDay(); // 0 = Sunday, 6 = Saturday
//   return day === 0 || day === 6;
// };

// const SeatBooking = () => {
//   const [bookingType, setBookingType] = useState('seat');
//   const [bookingCategory, setBookingCategory] = useState('self');

//   // Start must be chosen first; initialize null so picker shows no value
//   const [startDate, setStartDate] = useState(null);
//   // End only allowed on the same calendar day as start; default = start + 30m
//   const [endDate, setEndDate] = useState(null);

//   const handleStartChange = (newValue) => {
//     if (!newValue) return;
//     const picked = new Date(newValue);

//     // Prevent weekends (picker also disables them, but guard here)
//     if (isWeekend(picked)) {
//       console.warn('Weekends are not allowed');
//       return;
//     }

//     // snap minutes to 0/30, keep exact 30 as-is
//     const snappedStart = roundUpToNext30KeepExact(picked);

//     // if picked is earlier than now and is today, snap to next-or-current 30 from now
//     const now = new Date();
//     const appliedStart =
//       isSameDay(snappedStart, now) && snappedStart.getTime() < now.getTime()
//         ? roundUpToNext30KeepExact(now)
//         : snappedStart;

//     // If appliedStart is on weekend (snapping might move day), prevent it
//     if (isWeekend(appliedStart)) {
//       console.warn('Resulting start falls on weekend; please pick a weekday');
//       return;
//     }

//     setStartDate(appliedStart);

//     // set end to start + 30 minutes (same day)
//     const defaultEnd = addMinutes(appliedStart, 30);
//     setEndDate(defaultEnd);

//     console.log('Start set:', appliedStart, 'End defaulted to:', defaultEnd);
//   };

//   const handleEndChange = (newValue) => {
//     if (!newValue || !startDate) return;
//     const picked = new Date(newValue);

//     // snap minutes to 0/30
//     const snapped = roundUpToNext30KeepExact(picked);

//     // enforce same calendar day as start
//     const minEnd = addMinutes(startDate, 30);
//     let applied = snapped;

//     // if user picked a different day (should be disabled), force same day
//     if (!isSameDay(applied, startDate)) {
//       applied = new Date(minEnd);
//     }

//     // enforce >= minEnd
//     if (applied.getTime() < minEnd.getTime()) applied = new Date(minEnd);

//     // guard weekend (shouldn't happen because start can't be weekend)
//     if (isWeekend(applied)) {
//       console.warn('End would fall on weekend; choose a different start');
//       return;
//     }

//     setEndDate(applied);
//     console.log('End set:', applied);
//   };

//   // Disable hours/minutes for end based on start + 30 min minimum
//   const shouldDisableTimeForEnd = (value, view) => {
//     if (!startDate) return false;
//     const minEnd = addMinutes(startDate, 30);

//     if (view === 'hours') {
//       return value < minEnd.getHours();
//     }

//     if (view === 'minutes') {
//       // minutesStep=30 so value will be 0 or 30
//       const selectedHour = (endDate && endDate.getHours()) ?? minEnd.getHours();
//       if (selectedHour < minEnd.getHours()) return true;
//       if (selectedHour === minEnd.getHours()) return value < minEnd.getMinutes();
//       return false;
//     }

//     return false;
//   };

//   // When opening end picker default to start + 30 if end is missing or earlier
//   const handleEndOpen = useCallback(() => {
//     if (!startDate) return;
//     const minEnd = addMinutes(startDate, 30);
//     if (!endDate || endDate.getTime() < minEnd.getTime()) {
//       setEndDate(new Date(minEnd));
//       console.log('End picker opened: defaulted to', minEnd);
//     }
//   }, [startDate, endDate]);

//   // Disable weekends for start picker
//   const shouldDisableDateForStart = (date) => {
//     if (!date) return false;
//     return isWeekend(date);
//   };

//   return (
//     <div className="seat-booking-container" style={{ backgroundImage: `url(${seatBg})` }}>
//       <div className="booking-box">
//         <h2>Seat Booking</h2>
//         <p>Select your seat from the layout.</p>

//         <div className="radio-group">
//           <label>
//             <input type="radio" value="seat" checked={bookingType === 'seat'} onChange={() => setBookingType('seat')} />
//             Seat
//           </label>
//           <label>
//             <input type="radio" value="meeting" checked={bookingType === 'meeting'} onChange={() => setBookingType('meeting')} />
//             Meeting Room
//           </label>
//         </div>

//         <p>Select who you're booking for:</p>
//         <div className="radio-group">
//           <label>
//             <input type="radio" value="self" checked={bookingCategory === 'self'} onChange={() => setBookingCategory('self')} />
//             Self
//           </label>
//           <label>
//             <input type="radio" value="coworker" checked={bookingCategory === 'coworker'} onChange={() => setBookingCategory('coworker')} />
//             Coworker
//           </label>
//           <label>
//             <input type="radio" value="visitor" checked={bookingCategory === 'visitor'} onChange={() => setBookingCategory('visitor')} />
//             Visitor
//           </label>
//           <label>
//             <input type="radio" value="group" checked={bookingCategory === 'group'} onChange={() => setBookingCategory('group')} />
//             Group
//           </label>
//         </div>

//         <div className="booking-details">
//           <p>Booking: {bookingType}</p>
//           <p>For: {bookingCategory}</p>
//         </div>
//       </div>

//       <div className="settings-box">
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <div className="date-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//             <div className="date-box">
//               <h3 className="date-box-title">Start</h3>
//               <DateTimePicker
//                 label="Start date & time"
//                 value={startDate}
//                 onChange={handleStartChange}
//                 disablePast
//                 minDate={new Date()}
//                 shouldDisableDate={shouldDisableDateForStart} // disable weekends
//                 ampm={false}
//                 minutesStep={30}
//                 renderInput={(params) => <TextField {...params} size="small" sx={{ width: 200 }} />}
//               />
//             </div>

//             <div className="date-box">
//               <h3 className="date-box-title">End</h3>
//               <DateTimePicker
//                 label="End date & time"
//                 value={endDate}
//                 onChange={handleEndChange}
//                 onOpen={handleEndOpen}
//                 disablePast
//                 // lock calendar to the same day as start: disable any day that's not startDate
//                 shouldDisableDate={(date) => {
//                   if (!startDate) return true; // disable all dates until start chosen
//                   // also ensure weekend guard (start can't be weekend so this is mostly redundant)
//                   return !isSameDay(date, startDate) || isWeekend(date);
//                 }}
//                 minDate={startDate || new Date()}
//                 maxDate={startDate || new Date()}
//                 ampm={false}
//                 minutesStep={30}
//                 shouldDisableTime={shouldDisableTimeForEnd}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     size="small"
//                     sx={{ width: 200 }}
//                     disabled={!startDate}
//                   />
//                 )}
//               />
//             </div>
//           </div>
//         </LocalizationProvider>

//         <div style={{ marginTop: 12 }}>
//           <p>
//             <strong>Selected Start:</strong>{' '}
//             {startDate ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}` : '—'}
//           </p>
//           <p>
//             <strong>Selected End:</strong>{' '}
//             {endDate ? `${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}` : '—'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatBooking;
// export default SeatBooking;
import React, { useState, useCallback, useEffect } from "react";
import "../../styles/SeatBooking.css";
import seatBg from "../../assets/seat-bg.jpg.avif";
import { DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import RepeatIcon from "@mui/icons-material/Repeat";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// helpers
const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const roundUpToNext30KeepExact = (date) => {
  const d = new Date(date);
  d.setSeconds(0, 0);
  const m = d.getMinutes();
  const rem = m % 30;
  if (rem === 0) return d;
  d.setMinutes(m + (30 - rem));
  return d;
};

const addMinutes = (date, mins) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + mins);
  return d;
};

const isWeekend = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
};

const now = new Date();
const currentHour = now.getHours();
const currentMinute = now.getMinutes();

// generate hours (0–23)
const allHours = Array.from({ length: 24 }, (_, i) => i);
// generate minutes (0–59)
const allMinutes = Array.from({ length: 60 }, (_, i) => i);

// --- mock location data (like mockEmployees) ---
const mockLocations = [
  {
    building: "Building A",
    floors: ["1st Floor", "2nd Floor", "3rd Floor"],
  },
  {
    building: "Building B",
    floors: ["Ground Floor", "1st Floor", "2nd Floor"],
  },
  {
    building: "Building C",
    floors: ["1st Floor", "2nd Floor"],
  },
];

// --- mock employees for sample lookup (replace with real API) ---
const mockEmployees = [
  {
    id: "E001",
    name: "Asha Reddyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
  },
  { id: "E002", name: "Ravi Kumar" },
  { id: "E003", name: "Priya Sharma" },
  { id: "E004", name: "Suresh B" },
  { id: "E005", name: "Tharun" },
  { id: "E006", name: "Chandra" },
  { id: "E007", name: "Srikanth" },
];
const lookupEmployeeById = (id) =>
  mockEmployees.find((e) => e.id.toLowerCase() === id.toLowerCase()) || null;
// ---------------------------------------------------

const SeatBooking = () => {
  const [bookingType, setBookingType] = useState("seat");
  const [bookingCategory, setBookingCategory] = useState("self");

  // Start must be chosen first; initialize null so picker shows no value
  const [startDate, setStartDate] = useState(null);
  // End only allowed on the same calendar day as start; default = start + 30m
  const [endDate, setEndDate] = useState(null);
  const [recendDate, setrecEndDate] = useState(null);

  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");

  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  // --- New UI state for coworker / visitor / group ---
  const [coworkerId, setCoworkerId] = useState("");
  const [coworkerName, setCoworkerName] = useState("");

  const [visitorPerson, setVisitorPerson] = useState("");
  const [visitorWhom, setVisitorWhom] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const [groupOpen, setGroupOpen] = useState(false);
  const [groupSearchId, setGroupSearchId] = useState("");
  const [groupSearchName, setGroupSearchName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  // clear unrelated fields when bookingCategory changes
  useEffect(() => {
    if (bookingCategory !== "coworker") {
      setCoworkerId("");
      setCoworkerName("");
    }
    if (bookingCategory !== "visitor") {
      setVisitorPerson("");
      setVisitorWhom("");
    }
    if (bookingCategory !== "group") {
      setGroupMembers([]);
      setGroupSearchId("");
      setGroupSearchName("");
      setGroupOpen(false);
    }
  }, [bookingCategory]);

  // coworker handlers
  const handleCoworkerSearch = () => {
    if (!coworkerId.trim()) {
      setCoworkerName("");
      return;
    }
    const res = lookupEmployeeById(coworkerId.trim());
    setCoworkerName(res ? res.name : "Not found");
  };

  // group handlers
  const openGroup = () => setGroupOpen(true);
  const closeGroup = () => setGroupOpen(false);

  const handleGroupSearch = () => {
    if (!groupSearchId.trim()) {
      setGroupSearchName("");
      return;
    }
    const res = lookupEmployeeById(groupSearchId.trim());
    setGroupSearchName(res ? res.name : "Not found");
  };

  const addGroupMember = () => {
    if (!groupSearchId.trim()) return;
    const res = lookupEmployeeById(groupSearchId.trim());
    if (!res) return;
    if (groupMembers.some((m) => m.id.toLowerCase() === res.id.toLowerCase()))
      return;
    setGroupMembers((prev) => [...prev, { id: res.id, name: res.name }]);
    setGroupSearchId("");
    setGroupSearchName("");
  };

  const removeGroupMember = (id) => {
    setGroupMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // existing date/time logic (unchanged names)
  const handleStartChange = (newValue) => {
    if (!newValue) return;
    const picked = new Date(newValue);

    // Prevent weekends (picker also disables them, but guard here)
    if (isWeekend(picked)) {
      console.warn("Weekends are not allowed");
      return;
    }

    // snap minutes to 0/30, keep exact 30 as-is
    const snappedStart = roundUpToNext30KeepExact(picked);

    // if picked is earlier than now and is today, snap to next-or-current 30 from now
    const now = new Date();
    const appliedStart =
      isSameDay(snappedStart, now) && snappedStart.getTime() < now.getTime()
        ? roundUpToNext30KeepExact(now)
        : snappedStart;

    // If appliedStart is on weekend (snapping might move day), prevent it
    if (isWeekend(appliedStart)) {
      console.warn("Resulting start falls on weekend; please pick a weekday");
      return;
    }

    setStartDate(appliedStart);

    // set end to start + 30 minutes (same day)
    const defaultEnd = addMinutes(appliedStart, 30);
    setEndDate(defaultEnd);

    console.log("Start set:", appliedStart, "End defaulted to:", defaultEnd);
  };

  const handleEndChange = (newValue) => {
    if (!newValue || !startDate) return;
    const picked = new Date(newValue);

    // snap minutes to 0/30
    const snapped = roundUpToNext30KeepExact(picked);

    // enforce same calendar day as start
    const minEnd = addMinutes(startDate, 30);
    let applied = snapped;

    // if user picked a different day (should be disabled), force same day
    if (!isSameDay(applied, startDate)) {
      applied = new Date(minEnd);
    }

    // enforce >= minEnd
    if (applied.getTime() < minEnd.getTime()) applied = new Date(minEnd);

    // guard weekend (shouldn't happen because start can't be weekend)
    if (isWeekend(applied)) {
      console.warn("End would fall on weekend; choose a different start");
      return;
    }

    setEndDate(applied);
    console.log("End set:", applied);
  };

  // Disable hours/minutes for end based on start + 30 min minimum
  const shouldDisableTimeForEnd = (value, view) => {
    if (!startDate) return false;
    const minEnd = addMinutes(startDate, 30);

    if (view === "hours") {
      return value < minEnd.getHours();
    }

    if (view === "minutes") {
      // minutesStep=30 so value will be 0 or 30
      const selectedHour = (endDate && endDate.getHours()) ?? minEnd.getHours();
      if (selectedHour < minEnd.getHours()) return true;
      if (selectedHour === minEnd.getHours())
        return value < minEnd.getMinutes();
      return false;
    }

    return false;
  };

  // When opening end picker default to start + 30 if end is missing or earlier
  const handleEndOpen = useCallback(() => {
    if (!startDate) return;
    const minEnd = addMinutes(startDate, 30);
    if (!endDate || endDate.getTime() < minEnd.getTime()) {
      setEndDate(new Date(minEnd));
      console.log("End picker opened: defaulted to", minEnd);
    }
  }, [startDate, endDate]);

  // Disable weekends for start picker
  const shouldDisableDateForStart = (date) => {
    if (!date) return false;
    return isWeekend(date);
  };

  const startHours =
    startDate && isSameDay(startDate, now)
      ? allHours.filter((h) => h >= currentHour)
      : allHours;
  const startMinutes =
    startDate &&
    isSameDay(startDate, now) &&
    parseInt(startHour) === currentHour
      ? allMinutes.filter((m) => m >= currentMinute)
      : allMinutes;

  const endHours =
    startHour !== ""
      ? allHours.filter((h) => h >= parseInt(startHour))
      : allHours;

  const endMinutes =
    endHour !== "" && parseInt(endHour) === parseInt(startHour)
      ? allMinutes.filter((m) => m >= parseInt(startMinute))
      : allMinutes;

  return (
    <div
      className="seat-booking-container"
      style={{ backgroundImage: `url(${seatBg})` }}
    >
      {/* LEFT box now contains booking info + conditional details */}
      <div className="booking-box">
        <h2>Seat Booking</h2>
        <p>Select your seat from the layout.</p>

        <div className="radio-Catageroy">
          <label>
            <input
              type="radio"
              value="seat"
              checked={bookingType === "seat"}
              onChange={() => setBookingType("seat")}
            />
            Seat
          </label>
          <label>
            <input
              type="radio"
              value="meeting"
              checked={bookingType === "meeting"}
              onChange={() => setBookingType("meeting")}
            />
            Meeting Room
          </label>
        </div>

        <p>Select who you're booking for:</p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="self"
              checked={bookingCategory === "self"}
              onChange={() => setBookingCategory("self")}
            />
            Self
          </label>
          <label>
            <input
              type="radio"
              value="coworker"
              checked={bookingCategory === "coworker"}
              onChange={() => setBookingCategory("coworker")}
            />
            Coworker
          </label>
          <label>
            <input
              type="radio"
              value="visitor"
              checked={bookingCategory === "visitor"}
              onChange={() => setBookingCategory("visitor")}
            />
            Visitor
          </label>
          <label>
            <input
              type="radio"
              value="group"
              checked={bookingCategory === "group"}
              onChange={() => setBookingCategory("group")}
            />
            Group
          </label>
        </div>

        {/* --- Conditional UI moved into the LEFT box --- */}
        {bookingCategory === "coworker" && (
          <div className="extra-section" style={{ marginTop: 5 }}>
            <h4>Coworker details</h4>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 2,
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="Employee ID"
                value={coworkerId}
                onChange={(e) => setCoworkerId(e.target.value)}
                size="small"
                sx={{ width: 160 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleCoworkerSearch}
              >
                Search
              </Button>
              <TextField
                label="Name"
                value={coworkerName}
                size="small"
                sx={{ width: 220 }}
                InputProps={{ readOnly: true }}
              />
            </div>
          </div>
        )}

        {bookingCategory === "visitor" && (
          <div className="extra-section" style={{ marginTop: 5 }}>
            <h4>Visitor details</h4>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="Visitor name"
                value={visitorPerson}
                onChange={(e) => setVisitorPerson(e.target.value)}
                size="small"
                sx={{ width: 220 }}
              />
              <TextField
                label="Visiting whom (employee)"
                value={visitorWhom}
                onChange={(e) => setVisitorWhom(e.target.value)}
                size="small"
                sx={{ width: 220 }}
              />
            </div>
          </div>
        )}

        {bookingCategory === "group" && (
          <div className="extra-section" style={{ marginTop: 5 }}>
            <h4>Group details</h4>
            <Button
              style={{ marginTop: -9 }}
              variant="outlined"
              size="small"
              onClick={openGroup}
            >
              Manage Group Members
            </Button>
            <div style={{ marginTop: 9 }}>
              <strong>Members:</strong>
              <div style={{ marginTop: 8 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {/* {groupMembers.length === 0 && <span style={{ color: '#666' }}>No members added</span>} */}
                  {groupMembers.map((m) => (
                    <Chip
                      key={m.id}
                      label={`${m.name} (${m.id})`}
                      onDelete={() => removeGroupMember(m.id)}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Stack>
              </div>
            </div>
          </div>
        )}

        {/* Group modal (uses simple × close to avoid icons dependency) */}
        <Dialog open={groupOpen} onClose={closeGroup} maxWidth="sm" fullWidth>
          <DialogTitle>
            Manage Group Members
            <IconButton
              aria-label="close"
              onClick={closeGroup}
              sx={{ position: "absolute", right: 8, top: 8, fontSize: 14 }}
              size="small"
            >
              ×
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TextField
                label="Employee ID"
                value={groupSearchId}
                onChange={(e) => setGroupSearchId(e.target.value)}
                size="small"
                sx={{ width: 160 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleGroupSearch}
              >
                Search
              </Button>
              <TextField
                label="Name"
                value={groupSearchName}
                size="small"
                sx={{ width: 260 }}
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={addGroupMember}
                disabled={!groupSearchName || groupSearchName === "Not found"}
              >
                + Add
              </Button>
            </div>

            <div>
              <strong>Current members</strong>
              <div style={{ marginTop: 8 }}>
                <Stack direction="column" spacing={1}>
                  {groupMembers.length === 0 && (
                    <div style={{ color: "#666" }}>No members yet</div>
                  )}
                  {groupMembers.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        {m.name} ({m.id})
                      </div>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeGroupMember(m.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </Stack>
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeGroup}>Done</Button>
          </DialogActions>
        </Dialog>

        <div className="extra-sectio">
          <h4>Location</h4>
          <div className="location-panel">
            <div className="location-row">
              <TextField
                label="Country"
                value="India"
                size="small"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="City"
                value="Hyderabad"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </div>
            <div className="location-row">
              <FormControl size="small">
                <InputLabel>Building</InputLabel>
                <Select
                  value={selectedBuilding}
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    setSelectedFloor("");
                  }}
                >
                  {mockLocations.map((loc) => (
                    <MenuItem key={loc.building} value={loc.building}>
                      {loc.building}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" disabled={!selectedBuilding}>
                <InputLabel>Floor</InputLabel>
                <Select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                >
                  {mockLocations
                    .find((loc) => loc.building === selectedBuilding)
                    ?.floors.map((f) => (
                      <MenuItem key={f} value={f}>
                        {f}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        {/* {bookingCategory === 'self' && (
          <div className="extra-section" style={{ marginTop: 12 }}>
            <p style={{ color: '#666' }}>Booking for yourself. No extra details required.</p>
          </div>
        )} */}
      </div>

      {/* RIGHT box contains date/time pickers */}
      <div className="settings-box right-box">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsRecurring(!isRecurring)}
          >
            {isRecurring ? "Recurring" : "Single Day"}
          </Button>
        </div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div
            className="date-row"
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <div className="date-box">
              {isRecurring ? (
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={handleStartChange}
                  disablePast
                  shouldDisableDate={(date) => isWeekend(date)}
                  renderInput={(params) => (
                    <TextField {...params} size="small" sx={{ width: 200 }} />
                  )}
                />
              ) : (
                <DateTimePicker
                  label="Start date & time"
                  value={startDate}
                  onChange={handleStartChange}
                  disablePast
                  minDate={new Date()}
                  shouldDisableDate={shouldDisableDateForStart} // disable weekends
                  ampm={false}
                  minutesStep={30}
                  renderInput={(params) => (
                    <TextField {...params} size="small" sx={{ width: 200 }} />
                  )}
                />
              )}
            </div>

            {isRecurring ? (
              <div>
                <RepeatIcon
                  sx={{
                    ml: 1,
                    color: "primary.main",
                    marginTop: 2,
                    marginRight: 2,
                  }}
                />
                <DatePicker
                  label="End date"
                  minDate={startDate}
                  value={recendDate}
                  onChange={setrecEndDate}
                  disablePast
                  shouldDisableDate={(date) => isWeekend(date)}
                  renderInput={(params) => (
                    <TextField {...params} size="small" sx={{ width: 200 }} />
                  )}
                />
              </div>
            ) : (
              <div style={{ display: "flex", gap: 160, flexWrap: "wrap" }}>
                <DateTimePicker
                  label="End date & time"
                  value={endDate}
                  onChange={handleEndChange}
                  onOpen={handleEndOpen}
                  disablePast
                  // lock calendar to the same day as start: disable any day that's not startDate
                  shouldDisableDate={(date) => {
                    if (!startDate) return true; // disable all dates until start chosen
                    // also ensure weekend guard (start can't be weekend so this is mostly redundant)
                    return !isSameDay(date, startDate) || isWeekend(date);
                  }}
                  minDate={startDate || new Date()}
                  maxDate={startDate || new Date()}
                  ampm={false}
                  minutesStep={30}
                  shouldDisableTime={shouldDisableTimeForEnd}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{ width: 200 }}
                      disabled={!startDate}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </LocalizationProvider>

        {isRecurring ? (
          <div style={{ display: "flex", gap: 10, flexwrap: "wrap" }}>
            <FormControl size="small" sx={{ mt: 2, width: 120 }}>
              <InputLabel>Start Hour</InputLabel>
              <Select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
              >
                {startHours.map((h) => (
                  <MenuItem key={h} value={h}>
                    {h.toString().padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ mt: 2, width: 120 }}>
              <InputLabel>Start Minute</InputLabel>
              <Select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
              >
                {startMinutes.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* End Time */}
            <FormControl size="small" sx={{ mt: 2, width: 120 }}>
              <InputLabel>End Hour</InputLabel>
              <Select
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
              >
                {endHours.map((h) => (
                  <MenuItem key={h} value={h}>
                    {h.toString().padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ mt: 2, width: 120 }}>
              <InputLabel>End Minute</InputLabel>
              <Select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
              >
                {endMinutes.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) : (
          ""
        )}

        <div style={{ marginTop: 12 }}>
          <p>
            <strong>Selected Start:</strong>{" "}
            {startDate
              ? `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit", hour12: false }
                )}`
              : "—"}
          </p>
          <p>
            <strong>Selected End:</strong>{" "}
            {endDate
              ? `${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit", hour12: false }
                )}`
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
