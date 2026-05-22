import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/RepDashboard.css';

function RepDashboard({ user }) {
  const [bookedApts, setBookedApts] = useState('');
  const [showRate, setShowRate] = useState('');
  const [demos, setDemos] = useState('');
  const [offersMade, setOffersMade] = useState('');
  const [secondApts, setSecondApts] = useState('');
  const [salesClosed, setSalesClosed] = useState('');
  const [referralAsked, setReferralAsked] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [iAmStandards, setIAmStandards] = useState({
    precision: false,
    hardWorker: false,
    professional: false,
    doAsISay: false,
    trainHard: false,
  });
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const iAmLabels = {
    precision: 'I work with precision',
    hardWorker: 'I work harder than everyone else',
    professional: 'I am a true sales professional',
    doAsISay: 'I do as I say',
    trainHard: 'I train hard, so I can fight easy',
  };

  const handleIAmChange = (key) => {
    setIAmStandards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'eod_reports'), {
        userId: user.uid,
        userEmail: user.email,
        bookedApts: bookedApts || '0',
        showRate: showRate || '0',
        demos: demos || '0',
        offersMade: offersMade || '0',
        secondApts: secondApts || '0',
        salesClosed: salesClosed || '0',
        referralAsked: referralAsked || 'No',
        followUp: followUp || 'No',
        iAmStandards,
        notes,
        timestamp: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setBookedApts('');
        setShowRate('');
        setDemos('');
        setOffersMade('');
        setSecondApts('');
        setSalesClosed('');
        setReferralAsked('');
        setFollowUp('');
        setIAmStandards({
          precision: false,
          hardWorker: false,
          professional: false,
          doAsISay: false,
          trainHard: false,
        });
        setNotes('');
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="rep-dashboard">
      <header className="rep-header">
        <div className="header-left">
          <img src="/logo.png" alt="TRI Logo" className="header-logo" />
          <h1>Rep Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="eod-form-container">
        <h2>End of Day Report - The Retirement Institute</h2>
        {submitted && <p className="success-message">Report submitted! ✓</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Booked Appointments Today</label>
            <input type="number" value={bookedApts} onChange={(e) => setBookedApts(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label>Show Rate (%) - # showed / # booked</label>
            <input type="number" value={showRate} onChange={(e) => setShowRate(e.target.value)} placeholder="0-100" min="0" max="100" />
          </div>

          <div className="form-group">
            <label>Demos/Pitches Made Today</label>
            <input type="number" value={demos} onChange={(e) => setDemos(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label>Offers Made Today</label>
            <input type="number" value={offersMade} onChange={(e) => setOffersMade(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label>2nd Appointments Booked Today</label>
            <input type="number" value={secondApts} onChange={(e) => setSecondApts(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label>Sales Closed</label>
            <input type="number" value={salesClosed} onChange={(e) => setSalesClosed(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label>Did you ask for at least 1 referral today?</label>
            <select value={referralAsked} onChange={(e) => setReferralAsked(e.target.value)}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Did you follow up with anyone to move the deal forward?</label>
            <select value={followUp} onChange={(e) => setFollowUp(e.target.value)}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>I AM Statements - Did you uphold these standards today?</label>
            <div className="checkbox-group">
              {Object.keys(iAmStandards).map((key) => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={iAmStandards[key]}
                    onChange={() => handleIAmChange(key)}
                  />
                  {iAmLabels[key]}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>What is one thing you're going to improve on tomorrow?</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Be specific. What will you do differently?"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RepDashboard;
