# [MIU Routine Management System](https://nafissiddiky2.github.io/MIU-CSE-Rutine/)

A web-based class routine management system for Manarat International University (MIU) Department of Computer Science & Engineering. Students can view their class schedules, search by batch, room, or teacher, and navigate between days.

## 🚀 Features

- **📚 View Class Routine** - See daily class schedules with course codes, rooms, and teachers
- **👥 Batch-wise Search** - Filter routines by batch number (e.g., 65, 67, 70(F), 70(M))
- **🏫 Room Search** - Find which classes are scheduled in specific rooms
- **👨‍🏫 Teacher Search** - View schedules for specific teachers
- **📅 Day Navigation** - Browse routines for any day (Yesterday/Today/Tomorrow)
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices
- **🔐 Student Registration** - New students can register with their ID, email, and phone
- **📊 Google Sheets Integration** - Routine data loaded from Google Sheets, registration data saved to Google Sheets

## 🛠️ Technology Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Data Source:** Google Sheets (CSV Export)
- **Storage:** Google Sheets (for student registrations), LocalStorage (for sessions)
- **Deployment:** GitHub Pages / Any static hosting

## 📁 Project Structure
miu-routine/
├── index.html # Entry point - redirects to login
├── login.html # Student login page
├── register.html # Student registration page
├── dashboard.html # Main dashboard with routine display
├── css/
│ └── style.css # All styles
├── js/
│ └── auth.js # Authentication & registration logic
└── README.md 

##⚠️ Important Notes
No backend required - Fully static site

Student data stored in Google Sheets - No local database

Login uses localStorage - Not secure for production (demo purpose)

CORS - Google Sheets must allow cross-origin requests

Session - 15-minute default timeout with optional 15-day "Remember Me"

📄 License
This project is created for Manarat International University, Department of CSE.

👨‍💻 Author
Developed for MIU CSE Department Routine Management

For any issues or questions, please [contact](https://nafissiddiky2.github.io/Portfolio/).
