document.addEventListener('DOMContentLoaded', () => {
  console.log('JS chargé');
  // Inscription
  const registerForm = document.querySelector('#registerForm');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    // Récupère le rôle choisi dans le select
    const role = document.querySelector('#registerRole').value;

    const res = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();
    if (res.ok) {
      // Si l'inscription réussit, on connecte automatiquement l'utilisateur
      const loginRes = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (loginData.token) {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('userEmail', loginData.user.email);
        localStorage.setItem('userRole', loginData.user.role);
        window.location.replace('dashboard.html');
      } else {
        alert(loginData.error || 'Erreur lors de la connexion automatique.');
      }
    } else {
      // Affichage d'un message d'erreur précis
      alert(data.error || 'Erreur lors de l\'inscription');
    }
  });

  // Connexion
  const loginForm = document.querySelector('#loginForm');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        // Nettoie le localStorage avant de stocker
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        // Log la réponse API pour debug
        console.log('Réponse API login:', data);
        // Correction : stocke les infos même si elles sont vides
        if (data.user) {
          localStorage.setItem('userEmail', data.user.email ? data.user.email : '');
          localStorage.setItem('userRole', data.user.role ? data.user.role : '');
        } else {
          alert('Réponse API incomplète : ' + JSON.stringify(data));
        }
        localStorage.setItem('token', data.token);
        // Log du localStorage juste avant redirection
        console.log('Avant redirection, localStorage:', {
          token: localStorage.getItem('token'),
          userEmail: localStorage.getItem('userEmail'),
          userRole: localStorage.getItem('userRole')
        });
        // Redirection immédiate vers le dashboard
        window.location.replace('dashboard.html');
      } else {
        alert(data.error || 'Échec de connexion');
      }
    } catch (e) {
      alert('Erreur JS : ' + e.message);
    }
  });

  // Force la suppression de l'attribut action sur les formulaires pour éviter tout POST direct vers /login
  document.querySelectorAll('form').forEach(f => f.removeAttribute('action'));

  // Empêche tout submit natif sur tous les formulaires (sécurité anti POST /login)
  document.addEventListener('submit', function(e) {
    e.preventDefault();
  }, true);
});
