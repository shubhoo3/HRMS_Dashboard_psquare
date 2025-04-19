import { useState, useEffect } from 'react'
import { FaDownload, FaEdit, FaTrash, FaPlus, FaFileAlt } from 'react-icons/fa'
import Table from '../components/Table/Table'
import Button from '../components/Button/Button'
import Modal from '../components/Modal/Modal'
import Card from '../components/Card/Card'
import jsPDF from 'jspdf'
import './Candidates.css'

const Candidates = () => {
  const [candidates, setCandidates] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCandidate, setCurrentCandidate] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    resume: '', // Store the resume as a file
    status: 'New'
  })
  
  useEffect(() => {
    // Simulated data - in a real app, this would come from an API
    const storedCandidates = localStorage.getItem('candidates')
    
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates))
    } else {
      const initialCandidates = [
        {
          id: '1',
          fullName: 'Jacob Williams',
          email: 'jacob.williams@example.com',
          phone: '(555) 123-4567',
          position: 'Senior Developer',
          status: 'New',
          resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
          id: '2',
          fullName: 'Olivia Hendrix',
          email: 'olivia.hendrix@example.com',
          phone: '(555) 987-6543',
          position: 'UI/UX Designer',
          status: 'Reviewed',
          resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
          id: '3',
          fullName: 'Liam Anderson',
          email: 'liam.anderson@example.com',
          phone: '(555) 555-5555',
          position: 'Full Stack Developer',
          status: 'Interview',
          resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
      ]
      
      setCandidates(initialCandidates)
      localStorage.setItem('candidates', JSON.stringify(initialCandidates))
    }
  }, [])
  
  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'position', label: 'Position' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => {
        let statusClass = 'status-new'
        
        if (row.status === 'Reviewed') statusClass = 'status-reviewed'
        if (row.status === 'Interview') statusClass = 'status-interview'
        if (row.status === 'Hired') statusClass = 'status-hired'
        if (row.status === 'Rejected') statusClass = 'status-rejected'
        
        return <span className={`status-badge ${statusClass}`}>{row.status}</span>
      }
    },
  ]
  
  const openAddModal = () => {
    setCurrentCandidate(null)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      resume: '',
      status: 'New'
    })
    setIsModalOpen(true)
  }
  
  const openEditModal = (candidate) => {
    setCurrentCandidate(candidate)
    setFormData({
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      resume: candidate.resume,
      status: candidate.status
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

  // Handle file change for resume upload
  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData({
      ...formData,
      [name]: files[0] // Store the first file selected
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()

    if (currentCandidate) {
      // Update existing candidate
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.id === currentCandidate.id) {
          return {
            ...candidate,
            ...formData
          }
        }
        return candidate
      })
      
      setCandidates(updatedCandidates)
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates))
    } else {
      // Add new candidate
      const newCandidate = {
        id: Date.now().toString(),
        ...formData
      }
      
      const updatedCandidates = [...candidates, newCandidate]
      setCandidates(updatedCandidates)
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates))
    }
    
    setIsModalOpen(false)
  }
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      const updatedCandidates = candidates.filter(candidate => candidate.id !== id)
      setCandidates(updatedCandidates)
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates))
    }
  }

  // Download Resume function
  const downloadResume = (candidate) => {
    const pdf = new jsPDF()

    // Add candidate info to PDF
    pdf.setFontSize(20)
    pdf.text(candidate.fullName, 20, 20)

    pdf.setFontSize(12)
    pdf.text(`Email: ${candidate.email}`, 20, 30)
    pdf.text(`Phone: ${candidate.phone}`, 20, 37)
    pdf.text(`Position: ${candidate.position}`, 20, 44)
    pdf.text(`Status: ${candidate.status}`, 20, 51)

    pdf.setFontSize(14)
    pdf.text('Resume', 20, 65)

    pdf.setFontSize(10)
    const resumeText = candidate.resume ? candidate.resume : 'No resume content available.'

    // Simple word wrap for the resume text
    const textLines = pdf.splitTextToSize(resumeText, 170)
    pdf.text(textLines, 20, 75)

    // If it's a file URL, you could offer that file for download
    if (candidate.resume instanceof File) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(candidate.resume)
      link.download = `${candidate.fullName.replace(/\s+/g, '_')}_Resume.${candidate.resume.name.split('.').pop()}`
      link.click()
    } else {
      // If resume text, save PDF as before
      pdf.save(`${candidate.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
    }
  }
  
  const tableActions = (row) => (
    <div className="action-buttons">
      <Button
        variant="secondary"
        size="small"
        leftIcon={<FaDownload />}
        onClick={(e) => {
          e.stopPropagation()
          downloadResume(row)
        }}
      >
        Resume
      </Button>
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
    <div className="candidates-page">
      <div className="page-header">
        <h1 className="page-title">Candidates</h1>
        <Button
          variant="primary"
          leftIcon={<FaPlus />}
          onClick={openAddModal}
        >
          Add Candidate
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={candidates}
          actions={tableActions}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCandidate ? 'Edit Candidate' : 'Add New Candidate'}
      >
        <form onSubmit={handleSubmit} className="candidate-form">
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
          
          <div className="form-group">
            <label htmlFor="status">Status*</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="New">New</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="resume">Resume/CV*</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf, .doc, .docx, .txt, .rtf"
              onChange={handleFileChange}
            />
            <p className="form-helper">
              <FaFileAlt /> Upload your resume (PDF, DOCX, TXT).
            </p>
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
              {currentCandidate ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Candidates
