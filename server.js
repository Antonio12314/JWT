const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('apps'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Clave secreta para firmar los tokens JWT
const secretKey = 'clave_secreta';

// Función para generar un token JWT
function generateToken(email) {
  return jwt.sign({ email }, secretKey, { expiresIn: '5m' });
}

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar las credenciales del usuario
  if (email === '2209141@upy.edu.mx' && password === 'UPY2209141') {
    const token = generateToken(email);
    
    // Establecer la cookie que contiene el token
    res.cookie('token', token, { httpOnly: true });
    
    // Redirigir al usuario al dashboard
    res.redirect('/dashboard');
  } else {
    res.status(401).send('Invalid email or password. Please try again.');
  }
});

// Ruta para el panel de control
app.get('/dashboard', (req, res) => {
  // Verificar si la cookie 'token' está presente
  if (req.cookies.token) {
    // Si el token está presente, enviar la página de dashboard
    res.sendFile(path.join(__dirname, 'apps', 'dashboard.html'));
  } else {
    // Si el token no está presente, redirigir al usuario al inicio de sesión
    res.redirect('/');
  }
});

// Ruta para la página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'apps', 'index.html'));
});

// Puerto de escucha del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
