#  HRMS Dashboard

This project is an **HR Management System (HRMS) Dashboard** designed to streamline and manage Human Resources workflows. It includes features like employee and candidate management, attendance tracking, leave handling, and secure authentication. The UI is developed in alignment with Figma design guidelines and is fully responsive across devices.

## 🚀 Features

### ✅ Authentication & Authorization
- Secure user login using **JWT tokens**.
- Session timeout set to **2 hours**.
- Auto logout upon session expiration.
- Robust **form validation** for both login and registration forms.

### 🧑‍💻 Candidate Management
- HR can **create and manage candidate profiles**.
- Download candidate resumes in **PDF format**.
- Move selected candidates to the **Employee Management** section seamlessly.
- **Search and filters** implemented as per Figma UI designs.

### 👥 Employee Management
- HR can **edit**, **delete**, and **assign roles** to employees.
- Employee listing supports **filters and search** based on Figma.

### ⏱️ Attendance Management
- Only current employees are visible in attendance.
- **Search and filter** functionality implemented per design guidelines.

### 🌴 Leaves Management
- Only **"Present" employees** can request leaves.
- HR can **create**, **update**, and **approve** leaves.




## Requirements

-  Fully responsive design

- Interactive charts and graphs

- Dynamic data fetching


## Installation & Setup

**Steps to Run the Project**

- **Clone the repository:** https://github.com/shubhoo3/HRMS_Dashboard_psquare.git


- **Install Independencies:** npm install

- **env Setup:**

  JWT_SECRET=your_jwt_secret
  SESSION_TIMEOUT=7200
  DATABASE_URL=your_database_url


## Technologies Used

- React.js 

- Vanilla CSS 

- Nodejs 

- Mongodb

- bcrypt and jwt


## Screenshot

 ##Login Page
![image](https://github.com/user-attachments/assets/39991a30-1a1c-456f-9d86-386eb57a2fa3)

##Register Page
![image](https://github.com/user-attachments/assets/d4f20a7a-83c1-4c84-b8f6-d6098c91d45b)

##Dashboard Page
![image](https://github.com/user-attachments/assets/5373e23f-2b3f-4874-a92d-ca27a1d8b14d)

##Candidates Page
![image](https://github.com/user-attachments/assets/fdcf870d-0af9-4a6c-8db7-788d85195036)

##Employees Page

![image](https://github.com/user-attachments/assets/375f2347-223f-4734-b62e-a225828adeae)

#Attendance Page
![image](https://github.com/user-attachments/assets/493b8644-e416-4271-9d25-c5d6970f6869)

#Leaves Page
![image](https://github.com/user-attachments/assets/227a7957-cc60-46a0-a39f-d821bfcffc3d)



