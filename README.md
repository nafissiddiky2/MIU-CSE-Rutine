# 📅 MIU Routine Management System

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
└── README.md # This file

text

## 🚀 How to Run Locally

### Prerequisites
- Any modern web browser
- Python 3 (or any HTTP server)

### Steps

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd miu-routine
Start a local server

bash
# Using Python 3
python3 -m http.server 3000

# OR using Node.js
npx http-server -p 3000

# OR using PHP
php -S localhost:3000
Open in browser

text
http://localhost:3000
📋 Setup Instructions
1. Google Sheets Configuration
The system uses two Google Sheets:

A. Routine Data Sheet (Already configured)
Sheet ID: 1pH0ZzPfwNNvvFpDR8N7eDtqeXKd1KcDKNRz4ca42T9U

GID: 350123385

This sheet contains the class routine data

Must be published to web or set to "Anyone with link can view"

B. Student Registration Sheet (Requires setup)
Create a Google Sheet named "Student Registrations"

Add headers in Row 1:

text
Student ID | Email | Phone | Batch | Password | Registration Date
Open Apps Script:

Extensions → Apps Script

Paste this code:

javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.student_id,
      data.email,
      data.phone,
      data.batch,
      data.password,
      data.registration_date || new Date().toLocaleString()
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
Deploy:

Deploy → New Deployment → Web App

Execute as: Me

Who has access: Anyone

Copy the Web App URL

Update the URL:

Open js/auth.js

Replace YOUR_GOOGLE_APPS_SCRIPT_URL_HERE with your Web App URL

2. Student ID Format
Student IDs should follow this format:

text
YYYYXXXNNNNN
Examples:

2465cse01176 → Batch 65

2567CSE01234 → Batch 67

2460cse01001 → Batch 60

The batch number is extracted from digits 3-4 of the ID.

🎨 Color Palette
Primary Green: #2d6a4f

Light Green: #52b788

Pale Green: #d8f3dc

Yellow: #ffd166

Light Yellow: #fff3cd

White: #ffffff

📝 Teacher Shortcodes
Code	Full Name
DMR	Prof. Dr. Mizanur Rahman
DRA	Prof. Dr. Ramit Azad
JF	Jannatul Ferdaous
SA	Soaib Abdullah
TK	Tahsin Kabir
ZH	Zahurul Haque
...	... (see dashboard for full list)
🔧 Customization
Changing the Routine Sheet
Edit the SHEET_CSV_URL in dashboard.html:

javascript
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=YOUR_GID';
Adding New Teacher Codes
Edit the teacherNames object in dashboard.html.

📤 Deployment
GitHub Pages
Push to GitHub repository

Settings → Pages → Source: Main branch

Save and access at https://<username>.github.io/<repo-name>/

Any Static Hosting
Upload all files to any static hosting service:

Netlify

Vercel

Firebase Hosting

Surge.sh

⚠️ Important Notes
No backend required - Fully static site

Student data stored in Google Sheets - No local database

Login uses localStorage - Not secure for production (demo purpose)

CORS - Google Sheets must allow cross-origin requests

Session - 15-minute default timeout with optional 15-day "Remember Me"

📄 License
This project is created for Manarat International University, Department of CSE.

👨‍💻 Author
Developed for MIU CSE Department Routine Management

For any issues or questions, please contact the department.
