import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const { mentorId } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [communicationMode, setCommunicationMode] = useState('chat');

  // Get tomorrow's date as minimum date for booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the booking
    console.log({
      mentorId,
      selectedDate,
      selectedTime,
      topic,
      preferredLanguage,
      communicationMode
    });
    alert('Session requested successfully! The mentor will confirm shortly.');
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Schedule a Mentoring Session</h1>
        <p className="booking-description">
          Choose your preferred date and time for the mentoring session. 
          Sessions are typically 45 minutes long.
        </p>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="date">Preferred Date</label>
            <input
              type="date"
              id="date"
              min={minDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Preferred Time</label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">Select a time slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="topic">What would you like to discuss?</label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Brief description of topics you'd like to discuss..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Preferred Language</label>
            <select
              id="language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              required
            >
              <option value="">Select a language</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="marathi">Marathi</option>
              <option value="gujarati">Gujarati</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mode">Communication Mode</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="mode"
                  value="chat"
                  checked={communicationMode === 'chat'}
                  onChange={(e) => setCommunicationMode(e.target.value)}
                />
                Text Chat
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="mode"
                  value="voice"
                  checked={communicationMode === 'voice'}
                  onChange={(e) => setCommunicationMode(e.target.value)}
                />
                Voice Call
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="mode"
                  value="video"
                  checked={communicationMode === 'video'}
                  onChange={(e) => setCommunicationMode(e.target.value)}
                />
                Video Call
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Request Session
          </button>

          <p className="booking-note">
            * You will receive a confirmation email once the mentor accepts your request.
            The mentor may suggest a different time if they're not available at your preferred slot.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingPage; 