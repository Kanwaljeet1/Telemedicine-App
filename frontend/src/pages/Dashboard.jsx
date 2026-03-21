import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Initial Static Data
const initialDoctorsDB = {
  "General Medicine": ["Dr. Emily White", "Dr. Alan Grant"],
  "Neurology": ["Dr. Michael Green", "Dr. Strange"],
  "Pediatrics": ["Dr. Linda Blue", "Dr. Mary Poppins"],
  "Cardiology": ["Dr. Sarah Smith", "Dr. Gregory House"],
  "Dermatology": ["Dr. James Wilson"],
  "Orthopedics": ["Dr. Bones McCoy", "Dr. Harry Joint"],
  "Psychiatry": ["Dr. Frasier Crane", "Dr. Hannibal Lecter"],
  "Ophthalmology": ["Dr. Ken Jeong", "Dr. Stephen Strange"]
};

const Dashboard = () => {
  // Get user role from localStorage with safety
  const getUser = () => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : { role: 'patient', username: 'Guest' };
    } catch (e) {
      return { role: 'patient', username: 'Guest' };
    }
  };
  const user = getUser();
  const isDoctor = user.role === 'doctor';
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/dashboard?tab=${tabName}`);
  };

  // Helper to get combined doctors list
  const getDoctorsList = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const doctorsDB = JSON.parse(JSON.stringify(initialDoctorsDB)); // Deep copy

    users.forEach(u => {
      if (u.role === 'doctor' && u.department && u.username) {
        // Ensure array exists for department (handle custom or new depts if we allowed them)
        if (!doctorsDB[u.department]) {
          doctorsDB[u.department] = [];
        }
        // Avoid duplicates if user is already in static list (mock check)
        if (!doctorsDB[u.department].includes(u.username)) {
          doctorsDB[u.department].push(u.username);
        }
      }
    });
    return doctorsDB;
  };

  const doctorsDB = getDoctorsList(); // Dynamic List
  // const isDoctor = user.role === 'doctor'; // Removed duplicate

  const [activeTab, setActiveTab] = useState('appointments');

  // Handle direct tab navigation via URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['appointments', 'prescriptions', 'messages', 'records'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('appointments');
    }
  }, [location.search]);

  // Mock appointments state (Initial Data + LocalStorage)
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [
      { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'Cardiology', date: 'Today, 2:30 PM', status: 'Upcoming', patientName: 'John Doe' },
      { id: 2, doctor: 'Dr. James Wilson', specialty: 'Dermatology', date: 'Tomorrow, 10:00 AM', status: 'Pending', patientName: 'Jane Smith' },
    ];
  });

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Helper to generate a consistent chat ID between two users
  const getChatId = (u1, u2) => {
    return [u1, u2].sort().join('_');
  };

  // Mock prescriptions state
  const [prescriptions, setPrescriptions] = useState([
    { id: 101, medication: 'Amoxicillin 500mg', doctor: 'Dr. Sarah Smith', patientName: user.username, date: 'Oct 24, 2025', dosage: '1 capsule 3 times daily', refills: 2 },
    { id: 102, medication: 'Lisinopril 10mg', doctor: 'Dr. Michael Green', patientName: user.username, date: 'Sep 12, 2025', dosage: '1 tablet daily', refills: 0 },
  ]);

  // Mock Messages State
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chats');
    return saved ? JSON.parse(saved) : {};
  });

  // Poll for new messages (simulate real-time sync across sessions/tabs)
  useEffect(() => {
    if (activeTab === 'messages') {
      const interval = setInterval(() => {
        const saved = localStorage.getItem('chats');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (JSON.stringify(parsed) !== JSON.stringify(chats)) {
            setChats(parsed);
          }
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activeTab, chats]);

  const [showModal, setShowModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Appointments Booking State
  const [selectedDept, setSelectedDept] = useState('');
  const [newAppt, setNewAppt] = useState({ doctor: '', specialty: '', date: '', hour: '', minute: '', period: 'AM' });
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);

  // Prescription Writing State
  const [newPrescription, setNewPrescription] = useState({ patientName: '', medication: '', dosage: '' });

  // Chat State
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Patient Records State
  const [patientRecords, setPatientRecords] = useState(() => {
    const saved = localStorage.getItem('patientRecords');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedRecordPatient, setSelectedRecordPatient] = useState(null);
  const [recordInput, setRecordInput] = useState({ history: '', notes: '', allergicTo: '' });
  const [recordSearch, setRecordSearch] = useState('');

  const handleBook = (e) => {
    e.preventDefault();
    // Format time as "HH:MM AM/PM"
    const formattedTime = `${newAppt.hour}:${newAppt.minute} ${newAppt.period}`;
    const formattedDate = `${newAppt.date}, ${formattedTime}`;

    if (isRescheduling) {
      // Update existing appointment
      setAppointments(appointments.map(appt =>
        appt.id === rescheduleId
          ? { ...appt, date: formattedDate, status: 'Rescheduled' }
          : appt
      ));
      alert('Appointment Rescheduled Successfully!');
    } else {
      // Create new appointment
      const newId = appointments.length + 1;
      const appointment = {
        id: newId,
        doctor: newAppt.doctor,
        patientName: user.username, // Save real patient name
        specialty: selectedDept,
        date: formattedDate,
        status: 'Upcoming'
      };
      setAppointments([...appointments, appointment]);
      alert('Appointment Booked Successfully!');
    }

    setShowModal(false);
    resetBookingForm();
  };

  const resetBookingForm = () => {
    setNewAppt({ doctor: '', specialty: '', date: '', hour: '', minute: '', period: 'AM' });
    setSelectedDept('');
    setIsRescheduling(false);
    setRescheduleId(null);
  }

  const openRescheduleModal = (appt) => {
    setIsRescheduling(true);
    setRescheduleId(appt.id);
    // Parse date/time for pre-filling is tricky with "Today, 2:30 PM" format mock data.
    // For simplicity in this demo, we will require them to pick a new date/time entirely,
    // but we will pre-select the Doctor and Department.
    setSelectedDept(appt.specialty);
    setNewAppt({
      doctor: appt.doctor,
      specialty: appt.specialty,
      date: '', // Force user to pick new date
      hour: '',
      minute: '',
      period: 'AM'
    });
    setShowModal(true);
  };

  const handleWritePrescription = (e) => {
    e.preventDefault();
    const newId = prescriptions.length + 101;
    const prescription = {
      id: newId,
      medication: newPrescription.medication,
      doctor: user.username, // Current doctor
      patientName: newPrescription.patientName,
      date: 'Today',
      dosage: newPrescription.dosage,
      refills: 0
    };
    setPrescriptions([prescription, ...prescriptions]);
    setShowPrescriptionModal(false);
    setNewPrescription({ patientName: '', medication: '', dosage: '' });
    alert('Prescription Sent Successfully!');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: chatInput,
      sender: user.username,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const chatId = getChatId(user.username, selectedChat);
    const updatedChats = {
      ...chats,
      [chatId]: [...(chats[chatId] || []), newMessage]
    };

    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    setChatInput('');
  };

  const handleUpdateRecord = (e) => {
    e.preventDefault();
    if (!selectedRecordPatient) return;

    const updatedRecords = {
      ...patientRecords,
      [selectedRecordPatient]: {
        ...recordInput,
        lastUpdated: new Date().toLocaleDateString(),
        updatedBy: user.username
      }
    };

    setPatientRecords(updatedRecords);
    localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
    alert('Patient Record Updated Successfully!');
  };

  const handleDownload = (medName) => {
    alert(`Downloading prescription for ${medName}...`);
  };

  // Filter appointments based on role (Security Fix: Patients only see their own)
  const filteredAppointments = isDoctor
    ? appointments.filter(apt => apt.doctor === user.username)
    : appointments.filter(apt => apt.patientName === user.username);

  const handleRefill = (medName) => {
    alert(`Refill request sent for ${medName}.`);
  };

  // Helper to check if meeting is accessible (10 mins before)
  const isMeetingAccessible = (dateStr) => {
    if (!dateStr) return false;
    try {
      const now = new Date();
      let apptDate;

      if (dateStr.includes('Today')) {
        // Format: "Today, 2:30 PM"
        const parts = dateStr.split(',');
        if (parts.length < 2) return false;

        const timePart = parts[1].trim();
        const [time, modifier] = timePart.split(' ');
        let [hours, minutes] = time.split(':');

        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        apptDate = new Date();
        apptDate.setHours(hours, minutes, 0, 0);

      } else if (dateStr.includes('Tomorrow')) {
        return false;
      } else {
        // Format: "YYYY-MM-DD, HH:MM AM/PM" or "YYYY-MM-DD, HH:MM"
        const parts = dateStr.split(',');
        if (parts.length < 2) return false;

        const datePart = parts[0].trim(); // YYYY-MM-DD
        const timePart = parts[1].trim(); // HH:MM AM/PM or HH:MM

        const [year, month, day] = datePart.split('-').map(Number);

        // Check if time has AM/PM
        const timeComponents = timePart.split(' ');
        const time = timeComponents[0]; // HH:MM
        const modifier = timeComponents[1]; // AM/PM or undefined

        let [hours, minutes] = time.split(':').map(Number);

        // Convert to 24-hour format if AM/PM is present
        if (modifier) {
          if (modifier === 'PM' && hours !== 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
        }

        // Note: Month is 0-indexed
        apptDate = new Date(year, month - 1, day, hours, minutes, 0);
      }

      if (isNaN(apptDate.getTime())) {
        console.warn("Invalid date parsed:", dateStr);
        return false;
      }

      const diffMs = apptDate - now;
      const diffMins = diffMs / 60000;

      // Accessible if starting in <= 10 mins 
      return diffMins <= 10;
    } catch (e) {
      console.error("Date parse error", e);
      return false; // Fail safe
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', position: 'relative' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>My Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user.username} ({isDoctor ? 'Doctor' : 'Patient'}).
          </p>
        </div>

        {/* Patient Action: Book Appointment */}
        {!isDoctor && activeTab === 'appointments' && (
          <button className="btn btn-primary" onClick={() => {
            resetBookingForm();
            setShowModal(true);
          }}>+ Book New</button>
        )}

        {/* Doctor Action: Write Prescription */}
        {isDoctor && activeTab === 'prescriptions' && (
          <button className="btn btn-primary" onClick={() => setShowPrescriptionModal(true)}>+ Write Prescription</button>
        )}

        {/* Doctor Action: Back to Main Dashboard from Patient Records */}
        {isDoctor && activeTab === 'records' && (
          <button
            className="btn btn-secondary"
            onClick={() => handleTabChange('appointments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            ← Back to Main Dashboard
          </button>
        )}
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => handleTabChange('appointments')}
          style={{
            padding: '1rem',
            borderBottom: activeTab === 'appointments' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'appointments' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'appointments' ? '600' : '500',
            background: 'none',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Appointments
        </button>
        <button
          onClick={() => handleTabChange('prescriptions')}
          style={{
            padding: '1rem',
            borderBottom: activeTab === 'prescriptions' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'prescriptions' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'prescriptions' ? '600' : '500',
            background: 'none',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Prescriptions
        </button>
        <button
          onClick={() => handleTabChange('messages')}
          style={{
            padding: '1rem',
            borderBottom: activeTab === 'messages' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'messages' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'messages' ? '600' : '500',
            background: 'none',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Messages
        </button>
        {isDoctor && (
          <button
            onClick={() => handleTabChange('records')}
            style={{
              padding: '1rem',
              borderBottom: activeTab === 'records' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'records' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'records' ? '600' : '500',
              background: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Patient Records
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', animation: 'fadeIn 0.4s' }}>
        {/* Appointments List */}
        {activeTab === 'appointments' && (
          <>
            {filteredAppointments.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No upcoming appointments found for you.</p>}
            {filteredAppointments.map((apt) => {
              const canJoin = isMeetingAccessible(apt.date);
              return (
                <div key={apt.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: isDoctor ? 'var(--success)' : 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '1.2rem'
                    }}>
                      {isDoctor ? (apt.patientName ? apt.patientName.charAt(0) : 'P') : (apt.doctor ? apt.doctor.charAt(0) : 'D')}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{isDoctor ? `Patient: ${apt.patientName || 'Unknown'}` : `Dr. ${apt.doctor || 'Unknown'}`}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{isDoctor ? 'Upcoming Consultation' : apt.specialty}</p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '150px' }}>
                    <div style={{ fontWeight: '600' }}>{apt.date}</div>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      background: (apt.status === 'Upcoming' || apt.status === 'Rescheduled') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: (apt.status === 'Upcoming' || apt.status === 'Rescheduled') ? 'var(--success)' : 'var(--warning)',
                      marginTop: '0.25rem'
                    }}>
                      {apt.status}
                    </div>
                  </div>

                  <div>
                    {(apt.status === 'Upcoming' || apt.status === 'Rescheduled') ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {canJoin ? (
                          <Link to={`/video/${apt.id}`} className="btn btn-primary">Join Call</Link>
                        ) : (
                          <button className="btn btn-secondary" disabled title="Opens at scheduled time">Wait for Time</button>
                        )}
                        {isDoctor && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedRecordPatient(apt.patientName);
                              setRecordInput(patientRecords[apt.patientName] || { history: '', notes: '', allergicTo: '' });
                              handleTabChange('records');
                            }}
                          >
                            View Records
                          </button>
                        )}
                        {!isDoctor && (
                          <button className="btn btn-secondary" onClick={() => openRescheduleModal(apt)}>Reschedule</button>
                        )}
                      </div>
                    ) : (
                      <button className="btn btn-secondary" disabled>Ended</button>
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* Prescriptions List */}
        {activeTab === 'prescriptions' && (
          <>
            {prescriptions.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No prescriptions found.</p>}
            {prescriptions.map((script) => (
              <div key={script.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '1.5rem'
                  }}>
                    💊
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{script.medication}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {isDoctor ? `Prescribed to ${script.patientName}` : `Prescribed by ${script.doctor}`} • {script.date}
                    </p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                      {script.dosage}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => handleDownload(script.medication)}>
                    ⬇ Download
                  </button>
                  {!isDoctor && (
                    script.refills > 0 ? (
                      <button className="btn btn-primary" onClick={() => handleRefill(script.medication)}>
                        ↻ Refill ({script.refills})
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled style={{ opacity: 0.6 }}>
                        No Refills
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Messaging Interface */}
        {activeTab === 'messages' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            height: '600px',
            background: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Contacts Sidebar */}
            <div style={{ borderRight: '1px solid #e2e8f0', background: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Messaging</h3>
                  <button
                    onClick={() => handleTabChange('appointments')}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      fontWeight: '700',
                      padding: '0.4rem 0.8rem',
                      border: '1.5px solid var(--primary)',
                      borderRadius: '8px',
                      background: 'rgba(14, 165, 233, 0.05)',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {(() => {
                  const allUsersList = JSON.parse(localStorage.getItem('users') || '[]');
                  const allDoctors = [...new Set([...Object.values(initialDoctorsDB).flat(), ...allUsersList.filter(u => u.role === 'doctor').map(u => u.username)])];
                  const allPatients = [...new Set([...appointments.map(a => a.patientName), ...allUsersList.filter(u => u.role === 'patient').map(u => u.username)])];

                  const filteredDoctors = allDoctors.filter(c => c && c !== user.username && c.toLowerCase().includes(contactSearch.toLowerCase()));
                  const filteredPatients = allPatients.filter(c => c && c !== user.username && c.toLowerCase().includes(contactSearch.toLowerCase()));

                  if (filteredDoctors.length === 0 && filteredPatients.length === 0) {
                    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>No contacts found</div>;
                  }

                  const renderContact = (contact, isDoc) => (
                    <div
                      key={contact}
                      onClick={() => setSelectedChat(contact)}
                      style={{
                        padding: '1.25rem 1.5rem',
                        cursor: 'pointer',
                        background: selectedChat === contact ? 'white' : 'transparent',
                        borderLeft: selectedChat === contact ? '4px solid var(--primary)' : '4px solid transparent',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isDoc ? '#4f46e5' : 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {contact.charAt(0)}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isDoc ? 'rgba(79, 70, 229, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: isDoc ? '#4f46e5' : '#10b981',
                            fontSize: '0.65rem',
                            fontWeight: '600'
                          }}>
                            {isDoc ? 'DOCTOR' : 'PATIENT'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <>
                      {filteredDoctors.length > 0 && (
                        <div>
                          <div style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.05em' }}>HEALTHCARE PROVIDERS</div>
                          {filteredDoctors.map(c => renderContact(c, true))}
                        </div>
                      )}
                      {(isDoctor && filteredPatients.length > 0) && (
                        <div>
                          <div style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.05em', marginTop: '1rem' }}>PATIENTS</div>
                          {filteredPatients.map(c => renderContact(c, false))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Chat Window */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white' }}>
              {selectedChat ? (
                <>
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{selectedChat}</h3>
                  </div>

                  <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f1f5f9' }}>
                    {(() => {
                      const chatId = getChatId(user.username, selectedChat);
                      const currentChat = chats[chatId] || [];

                      if (currentChat.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', margin: 'auto', opacity: 0.5, fontSize: '0.9rem' }}>
                            No messages yet. Say hello!
                          </div>
                        );
                      }

                      return currentChat.map(msg => (
                        <div key={msg.id} style={{
                          alignSelf: msg.sender === user.username ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          padding: '0.8rem 1.2rem',
                          borderRadius: msg.sender === user.username ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                          background: msg.sender === user.username ? 'var(--primary)' : 'white',
                          color: msg.sender === user.username ? 'white' : 'var(--text-main)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                          position: 'relative'
                        }}>
                          <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                          <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.3rem', textAlign: 'right' }}>{msg.timestamp}</div>
                        </div>
                      ));
                    })()}
                  </div>

                  <form onSubmit={handleSendMessage} style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="input-field"
                      style={{ marginBottom: 0 }}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>Send</button>
                  </form>
                </>
              ) : (
                <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.5 }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                  <h3>Select a contact to start messaging</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patient Records Interface (Doctor Only) */}
        {activeTab === 'records' && isDoctor && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            height: '700px',
            background: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Patients Sidebar */}
            <div style={{ borderRight: '1px solid #e2e8f0', background: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>My Patients</h3>
                  <button
                    onClick={() => handleTabChange('appointments')}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      fontWeight: '700',
                      padding: '0.4rem 0.8rem',
                      border: '1.5px solid var(--primary)',
                      borderRadius: '8px',
                      background: 'rgba(14, 165, 233, 0.05)',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Find patient..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {(() => {
                  const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
                  const doctorAppointments = appointments.filter(apt => apt.doctor === user.name || apt.doctor === user.username);
                  const patientNames = [...new Set(doctorAppointments.map(apt => apt.patientName))];

                  const filteredPatients = allUsers
                    .filter(u => u && u.role === 'patient' && patientNames.includes(u.username) && (u.username || '').toLowerCase().includes(recordSearch.toLowerCase()));

                  if (filteredPatients.length === 0) {
                    return (
                      <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👥</div>
                        <p style={{ fontSize: '0.85rem' }}>No patients found for your account.</p>
                      </div>
                    );
                  }

                  return filteredPatients.map(patient => (
                    <div
                      key={patient.username}
                      onClick={() => {
                        setSelectedRecordPatient(patient.username);
                        setRecordInput(patientRecords[patient.username] || { history: '', notes: '', allergicTo: '' });
                      }}
                      style={{
                        padding: '1.25rem 1.5rem',
                        cursor: 'pointer',
                        background: selectedRecordPatient === patient.username ? 'white' : 'transparent',
                        borderLeft: selectedRecordPatient === patient.username ? '4px solid var(--primary)' : '4px solid transparent',
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{patient.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {patientRecords[patient.username] ? `Updated: ${patientRecords[patient.username].lastUpdated}` : 'No records yet'}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Record Details Area */}
            <div style={{ padding: '2rem', overflowY: 'auto', background: 'white' }}>
              {selectedRecordPatient ? (
                <div style={{ animation: 'fadeIn 0.4s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Medical Records: {selectedRecordPatient}</h2>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleTabChange('appointments')}
                      style={{ fontSize: '0.9rem', fontWeight: '600' }}
                    >
                      ← Back to Dashboard
                    </button>
                  </div>

                  <form onSubmit={handleUpdateRecord}>
                    <div className="input-group">
                      <label className="input-label">Allergies / Critical Flags</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Penicillin, Peanuts"
                        value={recordInput.allergicTo || ''}
                        onChange={(e) => setRecordInput({ ...recordInput, allergicTo: e.target.value })}
                        style={{ borderLeft: '4px solid #ef4444' }}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Medical History</label>
                      <textarea
                        className="input-field"
                        rows="4"
                        placeholder="Previous surgeries, chronic conditions, etc."
                        value={recordInput.history || ''}
                        onChange={(e) => setRecordInput({ ...recordInput, history: e.target.value })}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Clinical Notes</label>
                      <textarea
                        className="input-field"
                        rows="6"
                        placeholder="Current symptoms, plan of care, and observations..."
                        value={recordInput.notes || ''}
                        onChange={(e) => setRecordInput({ ...recordInput, notes: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
                        Update Records
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedRecordPatient(null)}
                      >
                        Minimize
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                  <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📋</div>
                  <h3>Select a patient to manage medical records</h3>
                  <p>Access and update clinical documentation securely</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal (Patient Only) */}
      {showModal && !isDoctor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', animation: 'fadeIn 0.3s' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}</h2>
            <form onSubmit={handleBook}>

              <div className="input-group">
                <label className="input-label">Select Department</label>
                <select
                  className="input-field"
                  required
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setNewAppt({ ...newAppt, doctor: '' }); // Reset doctor when dept changes
                  }}
                >
                  <option value="">-- Choose Department --</option>
                  {Object.keys(doctorsDB).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Select Doctor</label>
                <select
                  className="input-field"
                  required
                  disabled={!selectedDept}
                  value={newAppt.doctor}
                  onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                >
                  <option value="">-- Choose Doctor --</option>
                  {selectedDept && doctorsDB[selectedDept].map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Date</label>
                <input
                  type="date"
                  className="input-field"
                  required
                  value={newAppt.date}
                  onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Time</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <select
                    className="input-field"
                    required
                    value={newAppt.hour}
                    onChange={(e) => setNewAppt({ ...newAppt, hour: e.target.value })}
                    style={{ marginBottom: 0 }}
                  >
                    <option value="">Hour</option>
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 1;
                      return <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>;
                    })}
                  </select>
                  <select
                    className="input-field"
                    required
                    value={newAppt.minute}
                    onChange={(e) => setNewAppt({ ...newAppt, minute: e.target.value })}
                    style={{ marginBottom: 0 }}
                  >
                    <option value="">Min</option>
                    {['00', '15', '30', '45'].map(min => (
                      <option key={min} value={min}>{min}</option>
                    ))}
                  </select>
                  <select
                    className="input-field"
                    required
                    value={newAppt.period}
                    onChange={(e) => setNewAppt({ ...newAppt, period: e.target.value })}
                    style={{ marginBottom: 0 }}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {isRescheduling ? 'Confirm Reschedule' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal (Doctor Only) */}
      {showPrescriptionModal && isDoctor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', animation: 'fadeIn 0.3s' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Write Prescription</h2>
            <form onSubmit={handleWritePrescription}>
              <div className="input-group">
                <label className="input-label">Patient Name</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder='e.g. John Doe'
                  value={newPrescription.patientName}
                  onChange={(e) => setNewPrescription({ ...newPrescription, patientName: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Medication</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder='e.g. Amoxicillin 500mg'
                  value={newPrescription.medication}
                  onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Dosage Instructions</label>
                <textarea
                  className="input-field"
                  required
                  rows="3"
                  placeholder='e.g. Take 1 tablet every 8 hours'
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowPrescriptionModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Send Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
