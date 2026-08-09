// Google Sheets Web App URL
const STUDENT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxOXxupqYJkH_K4QCwkxT7SdE07-CEAWmOQArnbBcraYrOn9tPHNivffod7Suwpdu_r9Q/exec';

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
    
    try {
        const response = await fetch(STUDENT_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'login',
                student_id: studentId,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const userData = {
                student_id: data.student_id,
                batch: data.batch,
                email: data.email,
                phone: data.phone,
                loggedIn: true,
                loginTime: new Date().getTime()
            };
            
            localStorage.setItem('miu_user', JSON.stringify(userData));
            
            if (rememberMe) {
                localStorage.setItem('miu_remember', 'true');
            }
            
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.textContent = data.error || 'Invalid credentials';
            errorDiv.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    } catch (error) {
        errorDiv.textContent = 'Connection error. Please try again.';
        errorDiv.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
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
    
    const batch = studentId.match(/\d{2}(\d{2})/i)?.[1] || '00';
    
    try {
        const response = await fetch(STUDENT_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'register',
                student_id: studentId,
                email: email,
                phone: phone,
                batch: batch,
                password: password,
                registration_date: new Date().toLocaleString()
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            errorDiv.textContent = data.error || 'Registration failed';
            errorDiv.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    } catch (error) {
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    }
});
