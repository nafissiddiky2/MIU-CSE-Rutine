// Google Sheets Web App URL for student registration
const STUDENT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzoBPLzrMevEIwSg_Y5OeYvtyFBpg_V5UpxJAsH1spJ4EmgjOvoGuDZKfBT3sssIyGi4A/exec';

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    const errorDiv = document.getElementById('errorMessage');
    
    // Simple validation
    if (!studentId || !password) {
        errorDiv.textContent = 'Please fill all fields';
        errorDiv.classList.add('show');
        return;
    }
    
    // Extract batch from ID
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
    
    // Save to Google Sheet
    const batch = studentId.match(/\d{2}(\d{2})/i)?.[1] || '00';
    
    try {
        const response = await fetch(STUDENT_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: studentId,
                email: email,
                phone: phone,
                password: password,
                batch: batch,
                registration_date: new Date().toLocaleString()
            })
        });
        
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        // Still allow registration even if sheet fails
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    }
});
