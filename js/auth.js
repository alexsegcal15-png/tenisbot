document.addEventListener('DOMContentLoaded', function() {
    const PASSWORD = 'tenisbot123';
    
    // Verificar si ya está autenticado
    if (localStorage.getItem('tenisbot_auth') === 'true') {
        window.location.href = 'menu.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;

        if (password === PASSWORD) {
            localStorage.setItem('tenisbot_auth', 'true');
            window.location.href = 'menu.html';
        } else {
            errorMsg.textContent = '❌ Contraseña incorrecta';
            document.getElementById('password').value = '';
        }
    });
});
