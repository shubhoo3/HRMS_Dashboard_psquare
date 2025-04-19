import { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaPlus, FaUserPlus } from 'react-icons/fa'
import Table from '../components/Table/Table'
import Button from '../components/Button/Button'
import Modal from '../components/Modal/Modal'
import Card from '../components/Card/Card'
import './Employees.css'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    dateOfJoining: '',
  })
  
  useEffect(() => {
    // Simulated data - in a real app, this would come from an API
    const storedEmployees = localStorage.getItem('employees')
    
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    } else {
      const initialEmployees = [
        {
          id: '1',
          profile: { 
            bgColor: '#4338ca',
            initials: 'DG'
          },
          fullName: 'Drew Cooper',
          email: 'drew.cooper@example.com',
          phone: '(555) 555-4127',
          position: 'Designer',
          department: 'UI/UX',
          dateOfJoining: '2023/03/15'
        },
        {
          id: '2',
          profile: { 
            bgColor: '#0891b2',
            initials: 'AM'
          },
          fullName: 'Ariana McAfee',
          email: 'ariana.mcafee@example.com',
          phone: '(555) 448-9347',
          position: 'Full Stack Developer',
          department: 'Engineering',
          dateOfJoining: '2023/01/08'
        },
        {
          id: '3',
          profile: { 
            bgColor: '#7e22ce',
            initials: 'CF'
          },
          fullName: 'Craig Fisher',
          email: 'craig.fisher@example.com',
          phone: '(555) 555-9355',
          position: 'Senior Developer',
          department: 'Backend Development',
          dateOfJoining: '2021/04/21'
        },
        {
          id: '4',
          profile: { 
            bgColor: '#be123c',
            initials: 'JW'
          },
          fullName: 'James Wilson',
          email: 'james.wilson@example.com',
          phone: '(555) 555-9189',
          position: 'Junior Developer',
          department: 'Frontend Development',
          dateOfJoining: '2022/09/05'
        },
        {
          id: '5',
          profile: { 
            bgColor: '#92400e',
            initials: 'LA'
          },
          fullName: 'Leslie Alexander',
          email: 'leslie.alexander@example.com',
          phone: '(555) 555-3639',
          position: 'Team Lead',
          department: 'Human Resources',
          dateOfJoining: '2020/05/14'
        }
      ]
      
      setEmployees(initialEmployees)
      localStorage.setItem('employees', JSON.stringify(initialEmployees))
    }
  }, [])
  
  const getProfileInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const getRandomColor = () => {
    const colors = [
      '#4338ca', // indigo
      '#0891b2', // cyan
      '#7e22ce', // purple
      '#be123c', // rose
      '#92400e', // amber
      '#166534', // green
      '#9f1239', // pink
      '#1e40af', // blue
    ]
    return colors[Math.floor(Math.random() * colors.length)]
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
      width: '80px'
    },
    { key: 'fullName', label: 'Employee Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'position', label: 'Position' },
    { key: 'department', label: 'Department' },
    { key: 'dateOfJoining', label: 'Date of Joining' },
  ]
  
  const openAddModal = () => {
    setCurrentEmployee(null)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      dateOfJoining: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
    })
    setIsModalOpen(true)
  }
  
  const openEditModal = (employee) => {
    setCurrentEmployee(employee)
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      dateOfJoining: employee.dateOfJoining,
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
    
    if (currentEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(employee => {
        if (employee.id === currentEmployee.id) {
          // Preserve the profile data
          return {
            ...employee,
            ...formData
          }
        }
        return employee
      })
      
      setEmployees(updatedEmployees)
      localStorage.setItem('employees', JSON.stringify(updatedEmployees))
    } else {
      // Add new employee with profile data
      const initials = getProfileInitials(formData.fullName)
      const bgColor = getRandomColor()
      
      const newEmployee = {
        id: Date.now().toString(),
        profile: { bgColor, initials },
        ...formData
      }
      
      const updatedEmployees = [...employees, newEmployee]
      setEmployees(updatedEmployees)
      localStorage.setItem('employees', JSON.stringify(updatedEmployees))
    }
    
    setIsModalOpen(false)
  }
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(employee => employee.id !== id)
      setEmployees(updatedEmployees)
      localStorage.setItem('employees', JSON.stringify(updatedEmployees))
    }
  }
  
  const tableActions = (row) => (
    <div className="action-buttons">
      <Button
        variant="secondary"
        size="small"
        leftIcon={<FaEdit />}
        onClick={(e) => {
          e.stopPropagation()
          openEditModal(row)
        }}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        size="small"
        leftIcon={<FaTrash />}
        onClick={(e) => {
          e.stopPropagation()
          handleDelete(row.id)
        }}
      >
        Delete
      </Button>
    </div>
  )
  
  return (
    <div className="employees-page">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <Button
          variant="primary"
          leftIcon={<FaUserPlus />}
          onClick={openAddModal}
        >
          Add Employee
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={employees}
          actions={tableActions}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEmployee ? 'Edit Employee Details' : 'Add New Employee'}
      >
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name*</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="position">Position*</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department*</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfJoining">Date of Joining*</label>
              <input
                type="date"
                id="dateOfJoining"
                name="dateOfJoining"
                value={formData.dateOfJoining.replace(/\//g, '-')}
                onChange={(e) => 
                  handleInputChange({
                    target: {
                      name: 'dateOfJoining',
                      value: e.target.value.replace(/-/g, '/')
                    }
                  })
                }
                required
              />
            </div>
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
              {currentEmployee ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Employees