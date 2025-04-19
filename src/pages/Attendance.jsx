import { useState, useEffect } from 'react'
import { FaFilter, FaCalendarAlt } from 'react-icons/fa'
import Table from '../components/Table/Table'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import './Attendance.css'

const Attendance = () => {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [statusFilter, setStatusFilter] = useState('all')
  
  useEffect(() => {
    // Load employees from localStorage
    const storedEmployees = localStorage.getItem('employees')
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    }
    
    // Load or initialize attendance data
    const storedAttendance = localStorage.getItem('attendance')
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance))
    } else {
      // Initialize with some sample data
      const initialAttendance = [
        { 
          id: '1',
          employeeId: '1',
          date: new Date().toISOString().slice(0, 10),
          status: 'Present',
          task: 'Dashboard UI/UX design, Logo design, Dashboard footer review'
        },
        { 
          id: '2',
          employeeId: '2',
          date: new Date().toISOString().slice(0, 10),
          status: 'Present',
          task: 'Frontend code review, Bug fixes, Dashboard page integration'
        },
        { 
          id: '3',
          employeeId: '3',
          date: new Date().toISOString().slice(0, 10),
          status: 'Present',
          task: 'Backend API endpoint implementation, Database schema updates'
        },
        { 
          id: '4',
          employeeId: '4',
          date: new Date().toISOString().slice(0, 10),
          status: 'Absent',
          task: ''
        },
        { 
          id: '5',
          employeeId: '5',
          date: new Date().toISOString().slice(0, 10),
          status: 'Present',
          task: 'Onboarding new team member, Setting up interviews'
        }
      ]
      setAttendance(initialAttendance)
      localStorage.setItem('attendance', JSON.stringify(initialAttendance))
    }
  }, [])
  
  // Filter employees with attendance data for the selected date
  const getFilteredData = () => {
    // Get all attendance records for the selected date
    const dateAttendance = attendance.filter(a => a.date === date)
    
    // Create a mapping of employeeId to their attendance status
    const attendanceMap = {}
    dateAttendance.forEach(record => {
      attendanceMap[record.employeeId] = {
        status: record.status,
        task: record.task
      }
    })
    
    // Map employees to include their attendance status
    return employees.map(employee => {
      const attendanceInfo = attendanceMap[employee.id] || { status: 'No Record', task: '' }
      
      return {
        ...employee,
        attendanceStatus: attendanceInfo.status,
        task: attendanceInfo.task
      }
    }).filter(employee => {
      if (statusFilter === 'all') return true
      return employee.attendanceStatus === statusFilter
    })
  }
  
  const updateAttendanceStatus = (employeeId, newStatus) => {
    // Find existing attendance record for this employee and date
    const existingRecordIndex = attendance.findIndex(
      a => a.employeeId === employeeId && a.date === date
    )
    
    let updatedAttendance
    
    if (existingRecordIndex >= 0) {
      // Update existing record
      updatedAttendance = [...attendance]
      updatedAttendance[existingRecordIndex] = {
        ...updatedAttendance[existingRecordIndex],
        status: newStatus
      }
    } else {
      // Create new record
      const newRecord = {
        id: Date.now().toString(),
        employeeId,
        date,
        status: newStatus,
        task: ''
      }
      updatedAttendance = [...attendance, newRecord]
    }
    
    setAttendance(updatedAttendance)
    localStorage.setItem('attendance', JSON.stringify(updatedAttendance))
  }
  
  const columns = [
    { 
      key: 'profile', 
      label: 'Profile',
      render: (row) => (
        <div 
          className="employee-avatar" 
          style={{ backgroundColor: row.profile.bgColor }}
        >
          {row.profile.initials}
        </div>
      ),
      width: '60px'
    },
    { key: 'fullName', label: 'Employee Name' },
    { key: 'position', label: 'Position' },
    { key: 'department', label: 'Department' },
    { 
      key: 'task', 
      label: 'Task',
      render: (row) => (
        <div className="task-cell">
          {row.task || (row.attendanceStatus === 'Present' ? 'No tasks assigned' : 'Absent')}
        </div>
      )
    },
    { 
      key: 'attendanceStatus', 
      label: 'Status',
      render: (row) => {
        let statusClass = 'status-no-record'
        
        if (row.attendanceStatus === 'Present') statusClass = 'status-present'
        if (row.attendanceStatus === 'Absent') statusClass = 'status-absent'
        if (row.attendanceStatus === 'Late') statusClass = 'status-late'
        if (row.attendanceStatus === 'Half Day') statusClass = 'status-half-day'
        
        return (
          <div className="status-dropdown">
            <select 
              className={`status-select ${statusClass}`}
              value={row.attendanceStatus}
              onChange={(e) => updateAttendanceStatus(row.id, e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
        )
      }
    },
  ]
  
  return (
    <div className="attendance-page">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        
        <div className="filter-controls">
          <div className="date-picker">
            <FaCalendarAlt className="date-icon" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="date-input"
            />
          </div>
          
          <div className="status-filter">
            <FaFilter className="filter-icon" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
              <option value="No Record">No Record</option>
            </select>
          </div>
        </div>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={getFilteredData()}
        />
      </Card>
    </div>
  )
}

export default Attendance