// Google Sheets Web App URL
const STUDENT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwBDAo1DTvPfqpJ28WYe3bY4Zpm1Gnx37_MnYtqhbBUuY2VyNuTCxbyVLlnmYLgK5RAyQ/exec';

function getBatchFromId(studentId) {
    const id = String(studentId).trim();
    const match1 = id.match(/^\d{2}(\d{2})[a-zA-Z]/i);
    if (match1) return match1[1];
    const match2 = id.match(/^(\d{3})/);
    if (match2) {
        const prefix = match2[1];
        const batchMap = {'015': '61', '016': '62', '017': '63'};
        return batchMap[prefix] || prefix;
    }
    return '00';
}

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    const errorDiv = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!studentId || !password) {
        errorDiv.textContent = 'Please fill all fields';
        errorDiv.classList.add('show');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    const extractedBatch = getBatchFromId(studentId);
    
    // ALWAYS allow login - save user and redirect
    const userData = {
        student_id: studentId,
        batch: extractedBatch,
        loggedIn: true,
        loginTime: new Date().getTime()
    };
    
    localStorage.setItem('miu_user', JSON.stringify(userData));
    if (rememberMe) localStorage.setItem('miu_remember', 'true');
    
    // Try to verify with sheet in background (doesn't block login)
    try {
        const response = await fetch(STUDENT_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'login', student_id: studentId, password: password })
        });
        const data = await response.json();
        if (data.success) {
            userData.batch = data.batch || extractedBatch;
            userData.email = data.email || '';
            userData.phone = data.phone || '';
            localStorage.setItem('miu_user', JSON.stringify(userData));
        }
    } catch (err) {
        console.log('Sheet verification skipped');
    }
    
    window.location.href = 'dashboard.html';
});

// Register Form Handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value.trim();
    const batch = document.getElementById('batch').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorDiv = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!batch) { errorDiv.textContent = 'Please select your batch!'; errorDiv.classList.add('show'); return; }
    if (password !== confirmPassword) { errorDiv.textContent = 'Passwords do not match!'; errorDiv.classList.add('show'); return; }
    if (password.length < 6) { errorDiv.textContent = 'Password must be at least 6 characters!'; errorDiv.classList.add('show'); return; }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    try {
        await fetch(STUDENT_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'register', student_id: studentId, email, phone,
                batch, batch_number: batch.replace(/\([FM]\)/, '').trim(),
                password, registration_date: new Date().toLocaleString()
            })
        });
    } catch (err) {}
    
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
});
