import { useState, useEffect } from 'react'
import { 
  FaCalendarAlt, 
  FaCheck, 
  FaTimes, 
  FaClock,
  FaCalendarPlus
} from 'react-icons/fa'
import Table from '../components/Table/Table'
import Button from '../components/Button/Button'
import Modal from '../components/Modal/Modal'
import Card from '../components/Card/Card'
import './Leaves.css'

const Leaves = () => {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [leaves, setLeaves] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'Sick Leave'
  })
  
  useEffect(() => {
    // Load employees
    const storedEmployees = localStorage.getItem('employees')
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    }
    
    // Load attendance
    const storedAttendance = localStorage.getItem('attendance')
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance))
    }
    
    // Load or initialize leaves
    const storedLeaves = localStorage.getItem('leaves')
    if (storedLeaves) {
      setLeaves(JSON.parse(storedLeaves))
    } else {
      // Initialize with sample data
      const currentDate = new Date()
      const initialLeaves = [
        {
          id: '1',
          employeeId: '1',
          startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 5).toISOString().slice(0, 10),
          endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7).toISOString().slice(0, 10),
          reason: 'Family vacation',
          type: 'Annual Leave',
          status: 'Approved',
          appliedOn: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 10).toISOString().slice(0, 10)
        },
        {
          id: '2',
          employeeId: '3',
          startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2).toISOString().slice(0, 10),
          endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3).toISOString().slice(0, 10),
          reason: 'Doctor appointment',
          type: 'Sick Leave',
          status: 'Pending',
          appliedOn: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2).toISOString().slice(0, 10)
        },
        {
          id: '3',
          employeeId: '5',
          startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 10).toISOString().slice(0, 10),
          endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 14).toISOString().slice(0, 10),
          reason: 'Family event',
          type: 'Personal Leave',
          status: 'Rejected',
          appliedOn: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 5).toISOString().slice(0, 10)
        }
      ]
      setLeaves(initialLeaves)
      localStorage.setItem('leaves', JSON.stringify(initialLeaves))
    }
  }, [])
  
  // Get present employees
  const getPresentEmployees = () => {
    // Get today's date
    const today = new Date().toISOString().slice(0, 10)
    
    // Get all employees marked as present today
    const presentEmployeeIds = attendance
      .filter(a => a.date === today && a.status === 'Present')
      .map(a => a.employeeId)
    
    // Return all employees who are present
    return employees.filter(emp => presentEmployeeIds.includes(emp.id))
  }
  
  // Get combined leave data with employee info
  const getLeavesWithEmployeeInfo = () => {
    return leaves.map(leave => {
      const employee = employees.find(emp => emp.id === leave.employeeId)
      return {
        ...leave,
        employeeName: employee ? employee.fullName : 'Unknown Employee',
        department: employee ? employee.department : 'Unknown',
        profile: employee ? employee.profile : { initials: 'UK', bgColor: '#888' }
      }
    })
  }
  
  // Calculate number of leave days
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
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
    { key: 'employeeName', label: 'Employee' },
    { key: 'department', label: 'Department' },
    { 
      key: 'date', 
      label: 'Leave Period',
      render: (row) => {
        const days = calculateDays(row.startDate, row.endDate)
        return (
          <div className="leave-dates">
            <div className="date-range">
              {row.startDate} to {row.endDate}
            </div>
            <div className="leave-days">
              {days} {days === 1 ? 'day' : 'days'}
            </div>
          </div>
        )
      }
    },
    { key: 'type', label: 'Type' },
    { key: 'reason', label: 'Reason' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => {
        let statusClass = 'status-pending'
        let icon = <FaClock />
        
        if (row.status === 'Approved') {
          statusClass = 'status-approved'
          icon = <FaCheck />
        } else if (row.status === 'Rejected') {
          statusClass = 'status-rejected'
          icon = <FaTimes />
        }
        
        return (
          <div className={`leave-status ${statusClass}`}>
            {icon}
            <span>{row.status}</span>
          </div>
        )
      }
    },
  ]
  
  const openAddLeaveModal = (employee) => {
    setCurrentEmployee(employee)
    
    const today = new Date().toISOString().split('T')[0]
    
    setFormData({
      startDate: today,
      endDate: today,
      reason: '',
      type: 'Sick Leave'
    })
    
    setIsModalOpen(true)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date cannot be before start date')
      return
    }
    
    // Create new leave request
    const newLeave = {
      id: Date.now().toString(),
      employeeId: currentEmployee.id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      type: formData.type,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    }
    
    const updatedLeaves = [...leaves, newLeave]
    setLeaves(updatedLeaves)
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves))
    
    setIsModalOpen(false)
  }
  
  const updateLeaveStatus = (leaveId, newStatus) => {
    const updatedLeaves = leaves.map(leave => {
      if (leave.id === leaveId) {
        return {
          ...leave,
          status: newStatus
        }
      }
      return leave
    })
    
    setLeaves(updatedLeaves)
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves))
  }
  
  const tableActions = (row) => (
    <div className="action-buttons leave-actions">
      {row.status === 'Pending' && (
        <>
          <Button
            variant="success"
            size="small"
            leftIcon={<FaCheck />}
            onClick={(e) => {
              e.stopPropagation()
              updateLeaveStatus(row.id, 'Approved')
            }}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="small"
            leftIcon={<FaTimes />}
            onClick={(e) => {
              e.stopPropagation()
              updateLeaveStatus(row.id, 'Rejected')
            }}
          >
            Reject
          </Button>
        </>
      )}
    </div>
  )
  
  return (
    <div className="leaves-page">
      <div className="page-header">
        <h1 className="page-title">Employee Leaves</h1>
      </div>
      
      <div className="leaves-grid">
        <div className="leaves-main">
          <Card title="Leave Requests">
            <Table
              columns={columns}
              data={getLeavesWithEmployeeInfo()}
              actions={tableActions}
            />
          </Card>
        </div>
        
        <div className="leaves-sidebar">
          <Card 
            title="Employees Present Today" 
            subtitle="Click to apply for leave" 
            icon={<FaCalendarPlus />}
          >
            <div className="present-employees">
              {getPresentEmployees().length > 0 ? (
                getPresentEmployees().map(employee => (
                  <div key={employee.id} className="present-employee">
                    <div 
                      className="employee-avatar" 
                      style={{ backgroundColor: employee.profile.bgColor }}
                    >
                      {employee.profile.initials}
                    </div>
                    <div className="employee-info">
                      <div className="employee-name">{employee.fullName}</div>
                      <div className="employee-dept">{employee.department}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => openAddLeaveModal(employee)}
                    >
                      Apply Leave
                    </Button>
                  </div>
                ))
              ) : (
                <div className="no-present-employees">
                  No employees marked as present today
                </div>
              )}
            </div>
          </Card>
          
          <Card 
            title="Leave Calendar" 
            subtitle="Upcoming approved leaves"
            icon={<FaCalendarAlt />}
          >
            <div className="leave-calendar">
              {leaves.filter(leave => leave.status === 'Approved').length > 0 ? (
                leaves
                  .filter(leave => leave.status === 'Approved')
                  .map(leave => {
                    const employee = employees.find(emp => emp.id === leave.employeeId)
                    return (
                      <div key={leave.id} className="calendar-item">
                        <div className="calendar-dates">
                          <div className="date-range-short">
                            {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="leave-days-small">
                            {calculateDays(leave.startDate, leave.endDate)} days
                          </div>
                        </div>
                        <div className="calendar-employee">
                          <div 
                            className="employee-avatar-small" 
                            style={{ backgroundColor: employee?.profile.bgColor || '#888' }}
                          >
                            {employee?.profile.initials || 'UK'}
                          </div>
                          <div className="employee-info-small">
                            <div className="employee-name-small">{employee?.fullName || 'Unknown Employee'}</div>
                            <div className="leave-type">{leave.type}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })
              ) : (
                <div className="no-leaves">
                  No approved leaves scheduled
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Apply for Leave - ${currentEmployee?.fullName || ''}`}
      >
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date*</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date*</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Leave Type*</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
              <option value="Bereavement Leave">Bereavement Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="reason">Reason*</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="form-info">
            <FaCalendarAlt className="info-icon" />
            <span>
              Total: <strong>{calculateDays(formData.startDate, formData.endDate)}</strong> {calculateDays(formData.startDate, formData.endDate) === 1 ? 'day' : 'days'}
            </span>
          </div>
          
          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Leaves