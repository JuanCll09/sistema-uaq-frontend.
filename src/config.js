fetch('http://18.221.215.255/proyecto_uaq/api_login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@uaq.mx', password: '123' })
})
.then(r => r.json())
.then(data => console.log('Resultado del Login:', data))
.catch(error => console.error('Error:', error));
