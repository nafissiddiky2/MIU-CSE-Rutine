// Google Sheets Web App URL for student registration
const STUDENT_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    const errorDiv = document.getElementById('errorMessage');
    
    if (!studentId || !password) {
        errorDiv.textContent = 'Please fill all fields';
        errorDiv.classList.add('show');
        return;
    }
    
    // Extract batch from ID (e.g., 2465cse01176 -> 65)
    const batchMatch = studentId.match(/\d{2}(\d{2})/i);
    const batch = batchMatch ? batchMatch[1] : '00';
    
    // Store user info in localStorage
    const userData = {
        student_id: studentId,
        batch: batch,
        loggedIn: true,
        loginTime: new Date().getTime()
    };
    
    localStorage.setItem('miu_user', JSON.stringify(userData));
    
    if (rememberMe) {
        localStorage.setItem('miu_remember', 'true');
    }
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});

// Register Form Handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorDiv = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validations
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match!';
        errorDiv.classList.add('show');
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters!';
        errorDiv.classList.add('show');
        return;
    }
    
    const idPattern = /^\d{4}[a-zA-Z]{3}\d{5}$/i;
    if (!idPattern.test(studentId)) {
        errorDiv.textContent = 'Invalid Student ID format! Example: 2465cse01176';
        errorDiv.classList.add('show');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    // Extract batch
    const batch = studentId.match(/\d{2}(\d{2})/i)?.[1] || '00';
    
    // Try to save to Google Sheet
    try {
        if (STUDENT_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            await fetch(STUDENT_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: studentId,
                    email: email,
                    phone: phone,
                    batch: batch,
                    registration_date: new Date().toLocaleString()
                })
            });
        }
    } catch (error) {
        console.log('Sheet save skipped or failed');
    }
    
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
});
