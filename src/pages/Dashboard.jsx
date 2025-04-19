import { useState, useEffect } from 'react'
import { FaUsers, FaUserTie, FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa'
import Card from '../components/Card/Card'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalCandidates: 0,
    presentToday: 0,
    leaveRequests: 0,
  })
  
  const [recentActivity, setRecentActivity] = useState([])
  
  useEffect(() => {
    // Simulated data fetch
    setStats({
      totalEmployees: 47,
      totalCandidates: 12,
      presentToday: 42,
      leaveRequests: 3,
    })
    
    setRecentActivity([
      { id: 1, type: 'attendance', user: 'John Smith', action: 'checked in', time: '09:05 AM', date: '2023-10-15' },
      { id: 2, type: 'leave', user: 'Emma Wilson', action: 'requested leave', time: '10:30 AM', date: '2023-10-15' },
      { id: 3, type: 'employee', user: 'Alex Johnson', action: 'was added', time: '11:15 AM', date: '2023-10-14' },
      { id: 4, type: 'candidate', user: 'Sarah Davis', action: 'was interviewed', time: '02:30 PM', date: '2023-10-14' },
      { id: 5, type: 'attendance', user: 'Michael Brown', action: 'checked out', time: '05:45 PM', date: '2023-10-13' },
    ])
  }, [])
  
  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        <Card 
          title="Total Employees" 
          icon={<FaUsers />}
          variant="primary"
        >
          <div className="stat-value">{stats.totalEmployees}</div>
        </Card>
        
        <Card 
          title="Total Candidates" 
          icon={<FaUserTie />}
          variant="primary"
        >
          <div className="stat-value">{stats.totalCandidates}</div>
        </Card>
        
        <Card 
          title="Present Today" 
          icon={<FaCalendarCheck />}
          variant="success"
        >
          <div className="stat-value">{stats.presentToday}</div>
        </Card>
        
        <Card 
          title="Leave Requests" 
          icon={<FaExclamationTriangle />}
          variant="warning"
        >
          <div className="stat-value">{stats.leaveRequests}</div>
        </Card>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-main">
          <Card 
            title="Attendance Overview" 
            subtitle="Current month"
          >
            <div className="chart-container">
              <div className="placeholder-chart">
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '75%' }}></div>
                <div className="chart-bar" style={{ height: '45%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '65%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
              </div>
            </div>
          </Card>
          
          <Card 
            title="Department Distribution"
          >
            <div className="chart-container">
              <div className="placeholder-pie">
                <div className="pie-segment segment-1"></div>
                <div className="pie-segment segment-2"></div>
                <div className="pie-segment segment-3"></div>
                <div className="pie-segment segment-4"></div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="legend-color color-1"></span>
                  <span>Engineering (40%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color color-2"></span>
                  <span>Design (25%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color color-3"></span>
                  <span>Marketing (20%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color color-4"></span>
                  <span>HR (15%)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="dashboard-sidebar">
          <Card 
            title="Recent Activity"
          >
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon activity-${activity.type}`}>
                    {activity.type === 'attendance' && <FaCalendarCheck />}
                    {activity.type === 'leave' && <FaExclamationTriangle />}
                    {activity.type === 'employee' && <FaUsers />}
                    {activity.type === 'candidate' && <FaUserTie />}
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>{activity.user}</strong> {activity.action}
                    </p>
                    <p className="activity-time">{activity.time} - {activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card 
            title="Upcoming Events"
          >
            <div className="events-list">
              <div className="event-item">
                <div className="event-date">
                  <span className="event-month">Oct</span>
                  <span className="event-day">20</span>
                </div>
                <div className="event-details">
                  <p className="event-title">Team Meeting</p>
                  <p className="event-time">10:00 AM - 11:30 AM</p>
                </div>
              </div>
              
              <div className="event-item">
                <div className="event-date">
                  <span className="event-month">Oct</span>
                  <span className="event-day">22</span>
                </div>
                <div className="event-details">
                  <p className="event-title">Interview: Senior Developer</p>
                  <p className="event-time">2:00 PM - 3:30 PM</p>
                </div>
              </div>
              
              <div className="event-item">
                <div className="event-date">
                  <span className="event-month">Oct</span>
                  <span className="event-day">25</span>
                </div>
                <div className="event-details">
                  <p className="event-title">Monthly Review</p>
                  <p className="event-time">9:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard