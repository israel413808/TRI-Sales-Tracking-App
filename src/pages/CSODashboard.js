import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/CSODashboard.css';

function CSODashboard() {
  const [reports, setReports] = useState([]);
  const [selectedRep, setSelectedRep] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'eod_reports'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const uniqueReps = ['All', ...new Set(reports.map((r) => r.userEmail))];

  const filteredReports =
    selectedRep === 'All'
      ? reports
      : reports.filter((r) => r.userEmail === selectedRep);

  const todayReports = filteredReports.filter((r) => {
    if (!r.timestamp) return false;
    const reportDate = new Date(r.timestamp.seconds * 1000);
    const today = new Date();
    return reportDate.toDateString() === today.toDateString();
  });

  // Calculate metrics
  const totalBookedApts = todayReports.reduce(
    (sum, r) => sum + (parseInt(r.bookedApts) || 0),
    0
  );

  const avgShowRate = todayReports.length > 0
    ? todayReports.reduce((sum, r) => sum + (parseInt(r.showRate) || 0), 0) / todayReports.length
    : 0;

  const totalDemos = todayReports.reduce(
    (sum, r) => sum + (parseInt(r.demos) || 0),
    0
  );

  const totalOffers = todayReports.reduce(
    (sum, r) => sum + (parseInt(r.offersMade) || 0),
    0
  );

  const totalSecondApts = todayReports.reduce(
    (sum, r) => sum + (parseInt(r.secondApts) || 0),
    0
  );

  const totalSalesClosed = todayReports.reduce(
    (sum, r) => sum + (parseInt(r.salesClosed) || 0),
    0
  );

  const referralAsked = todayReports.filter((r) => r.referralAsked === 'Yes').length;
  const followUps = todayReports.filter((r) => r.followUp === 'Yes').length;

  const iAmCompliance = todayReports.length > 0
    ? (
        (todayReports.filter(
          (r) => Object.values(r.iAmStandards).filter((v) => v).length >= 4
        ).length / todayReports.length) * 100
      ).toFixed(1)
    : 0;

  // Color coding function for different metrics
  const getColorForMetric = (value, metricType) => {
    value = parseInt(value) || 0;

    switch(metricType) {
      case 'bookedApts':
        return value >= 3 ? 'green' : value >= 1 ? 'yellow' : 'red';
      case 'showRate':
        return value >= 70 ? 'green' : value >= 50 ? 'yellow' : 'red';
      case 'demos':
        return value >= 2 ? 'green' : value >= 1 ? 'yellow' : 'red';
      case 'offers':
        return value >= 2 ? 'green' : value >= 1 ? 'yellow' : 'red';
      case 'secondApts':
        return value >= 3 ? 'green' : value >= 1 ? 'yellow' : 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="cso-dashboard">
      <header className="cso-header">
        <div className="header-left">
          <img src="/logo.png" alt="TRI Logo" className="header-logo" />
          <h1>CSO Dashboard - The Retirement Institute</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="filter-section">
        <label>Filter by Rep:</label>
        <select
          value={selectedRep}
          onChange={(e) => setSelectedRep(e.target.value)}
        >
          {uniqueReps.map((rep) => (
            <option key={rep} value={rep}>
              {rep}
            </option>
          ))}
        </select>
      </div>

      <div className="stats-container">
        <div className={`stat-card ${getColorForMetric(totalBookedApts, 'bookedApts')}`}>
          <h3>Booked Appointments</h3>
          <p className="stat-value">{totalBookedApts}</p>
          <p className="stat-label">Green: 3+, Yellow: 1-2, Red: 0</p>
        </div>
        <div className={`stat-card ${getColorForMetric(avgShowRate, 'showRate')}`}>
          <h3>Avg Show Rate</h3>
          <p className="stat-value">{avgShowRate.toFixed(1)}%</p>
          <p className="stat-label">Green: 70%+, Yellow: 50-69%, Red: &lt;50%</p>
        </div>
        <div className={`stat-card ${getColorForMetric(totalDemos, 'demos')}`}>
          <h3>Demos/Pitches</h3>
          <p className="stat-value">{totalDemos}</p>
          <p className="stat-label">Green: 2+, Yellow: 1, Red: 0</p>
        </div>
        <div className={`stat-card ${getColorForMetric(totalOffers, 'offers')}`}>
          <h3>Offers Made</h3>
          <p className="stat-value">{totalOffers}</p>
          <p className="stat-label">Green: 2-3+, Yellow: 1, Red: 0</p>
        </div>
        <div className={`stat-card ${getColorForMetric(totalSecondApts, 'secondApts')}`}>
          <h3>2nd Appointments</h3>
          <p className="stat-value">{totalSecondApts}</p>
          <p className="stat-label">Green: 3-5+, Yellow: 1-2, Red: 0</p>
        </div>
        <div className="stat-card">
          <h3>Sales Closed (Week)</h3>
          <p className="stat-value">{totalSalesClosed}</p>
          <p className="stat-label">Green: 3-5, Yellow: 1-2, Red: 0</p>
        </div>
        <div className="stat-card">
          <h3>Referrals Asked</h3>
          <p className="stat-value">{referralAsked}</p>
        </div>
        <div className="stat-card">
          <h3>Follow-ups Made</h3>
          <p className="stat-value">{followUps}</p>
        </div>
        <div className={`stat-card ${iAmCompliance >= 80 ? 'green' : iAmCompliance >= 60 ? 'yellow' : 'red'}`}>
          <h3>I AM Compliance</h3>
          <p className="stat-value">{iAmCompliance}%</p>
        </div>
      </div>

      <div className="reports-table">
        <h2>Daily Reports - Today</h2>
        <table>
          <thead>
            <tr>
              <th>Rep Email</th>
              <th>Booked Apts</th>
              <th>Show Rate %</th>
              <th>Demos</th>
              <th>Offers</th>
              <th>2nd Apts</th>
              <th>Sales</th>
              <th>Referral</th>
              <th>Follow-up</th>
              <th>I AM</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {todayReports.map((report) => (
              <tr key={report.id}>
                <td>{report.userEmail}</td>
                <td className={getColorForMetric(report.bookedApts, 'bookedApts')}>
                  {report.bookedApts || 0}
                </td>
                <td className={getColorForMetric(report.showRate, 'showRate')}>
                  {report.showRate || 0}%
                </td>
                <td className={getColorForMetric(report.demos, 'demos')}>
                  {report.demos || 0}
                </td>
                <td className={getColorForMetric(report.offersMade, 'offers')}>
                  {report.offersMade || 0}
                </td>
                <td className={getColorForMetric(report.secondApts, 'secondApts')}>
                  {report.secondApts || 0}
                </td>
                <td>{report.salesClosed || 0}</td>
                <td>{report.referralAsked || '-'}</td>
                <td>{report.followUp || '-'}</td>
                <td>
                  {Object.values(report.iAmStandards).filter((v) => v).length || 0}/5
                </td>
                <td>
                  {report.timestamp
                    ? new Date(report.timestamp.seconds * 1000).toLocaleTimeString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CSODashboard;
