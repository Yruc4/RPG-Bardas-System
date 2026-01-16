// Login Page Interactivity - Ordem Paranormal RPG

// Storage keys
const PLAYERS_STORAGE_KEY = 'characterSheet_Players';
const RECENT_PLAYERS_KEY = 'characterSheet_RecentPlayers';
const ADMIN_SESSION_KEY = 'adminSession';
const ADMINS_STORAGE_KEY = 'characterSheet_Admins';
const ROOMS_STORAGE_KEY = 'characterSheet_Rooms';

// Default admin credentials (legacy support)
const DEFAULT_ADMIN_USERNAME = 'BigBard';
const DEFAULT_ADMIN_PASSWORD = 'mumesar';
const DEFAULT_ROOM_CODE = 'BARD00';

// Initialize default admin if not exists
function initializeDefaultAdmin() {
  const admins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '{}');
  if (!admins[DEFAULT_ADMIN_USERNAME]) {
    admins[DEFAULT_ADMIN_USERNAME] = {
      password: DEFAULT_ADMIN_PASSWORD,
      roomCode: DEFAULT_ROOM_CODE,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  }
}

// Generate random room code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Ensure room code is unique
function getUniqueRoomCode() {
  const admins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '{}');
  const existingCodes = Object.values(admins).map(a => a.roomCode);
  
  let code;
  do {
    code = generateRoomCode();
  } while (existingCodes.includes(code));
  
  return code;
}

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
  initializeDefaultAdmin();
  
  const form = document.getElementById('login-form');
  const adminForm = document.getElementById('admin-form');
  const createAdminForm = document.getElementById('create-admin-form');
  const playerNameInput = document.getElementById('player-name-input');

  // Focus on input for better UX
  playerNameInput.focus();

  // Handle player form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = document.getElementById('player-name-input').value.trim();
    const roomCode = document.getElementById('room-code-input').value.trim().toUpperCase();
    
    if (playerName && roomCode) {
      loginPlayer(playerName, roomCode);
    }
  });

  // Handle admin form submission
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;
    
    loginAdmin(username, password);
  });

  // Handle create admin form submission
  createAdminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('new-admin-username').value.trim();
    const password = document.getElementById('new-admin-password').value;
    const confirmPassword = document.getElementById('confirm-admin-password').value;
    
    createAdminAccount(username, password, confirmPassword);
  });

  // Load and display recent players
  loadRecentPlayers();
});

// Show create admin form
function showCreateAdminForm() {
  document.getElementById('player-login-box').style.display = 'none';
  document.getElementById('admin-login-box').style.display = 'none';
  document.getElementById('create-admin-box').style.display = 'block';
  document.getElementById('new-admin-username').focus();
}

// Hide create admin form
function hideCreateAdminForm() {
  document.getElementById('create-admin-box').style.display = 'none';
  document.getElementById('player-login-box').style.display = 'block';
  document.getElementById('player-name-input').focus();
  
  // Clear form
  document.getElementById('new-admin-username').value = '';
  document.getElementById('new-admin-password').value = '';
  document.getElementById('confirm-admin-password').value = '';
}

// Toggle between player and admin login
function toggleAdminLogin() {
  const playerBox = document.getElementById('player-login-box');
  const adminBox = document.getElementById('admin-login-box');
  const createBox = document.getElementById('create-admin-box');
  
  createBox.style.display = 'none';
  
  if (adminBox.style.display === 'none') {
    playerBox.style.display = 'none';
    adminBox.style.display = 'block';
    document.getElementById('admin-username').focus();
  } else {
    adminBox.style.display = 'none';
    playerBox.style.display = 'block';
    document.getElementById('player-name-input').focus();
  }

  // Clear admin form
  document.getElementById('admin-username').value = '';
  document.getElementById('admin-password').value = '';
}

// Create admin account
function createAdminAccount(username, password, confirmPassword) {
  const usernameInput = document.getElementById('new-admin-username');
  const passwordInput = document.getElementById('new-admin-password');
  const confirmInput = document.getElementById('confirm-admin-password');
  
  // Validate username length
  if (username.length < 3) {
    showError(usernameInput, 'Usuário deve ter pelo menos 3 caracteres');
    return;
  }
  
  // Validate password length
  if (password.length < 4) {
    showError(passwordInput, 'Senha deve ter pelo menos 4 caracteres');
    return;
  }
  
  // Check if passwords match
  if (password !== confirmPassword) {
    showError(confirmInput, 'As senhas não coincidem');
    return;
  }
  
  // Check if username already exists
  const admins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '{}');
  if (admins[username]) {
    showError(usernameInput, 'Este usuário já existe');
    return;
  }
  
  // Generate unique room code
  const roomCode = getUniqueRoomCode();
  
  // Create admin account
  admins[username] = {
    password: password,
    roomCode: roomCode,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  
  // Show success message with room code
  alert(`Conta criada com sucesso!\\n\\nSeu código de sala: ${roomCode}\\n\\nGuarde este código para compartilhar com seus jogadores.`);
  
  // Auto-login the new admin
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  sessionStorage.setItem('currentAdmin', username);
  sessionStorage.setItem('currentRoomCode', roomCode);
  sessionStorage.removeItem('currentPlayer');
  
  // Redirect to admin panel
  window.location.href = 'admin.html';
}

// Show error message
function showError(input, message) {
  input.style.borderColor = '#ef4444';
  const originalPlaceholder = input.placeholder;
  input.value = '';
  input.placeholder = message;
  
  setTimeout(() => {
    input.style.borderColor = '';
    input.placeholder = originalPlaceholder;
  }, 3000);
}

// Login a player (loads their data or creates new)
function loginPlayer(playerName, roomCode) {
  // Validate room code exists
  const admins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '{}');
  const roomExists = Object.values(admins).some(admin => admin.roomCode === roomCode);
  
  if (!roomExists) {
    const roomInput = document.getElementById('room-code-input');
    showError(roomInput, 'Código de sala inválido');
    return;
  }
  
  // Save to recent players list
  addToRecentPlayers(playerName, roomCode);
  
  // Store current player name and room code in sessionStorage
  sessionStorage.setItem('currentPlayer', playerName);
  sessionStorage.setItem('currentRoomCode', roomCode);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  
  // Redirect to character selection screen
  window.location.href = 'character-select.html';
}

// Login as admin
function loginAdmin(username, password) {
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');
  
  // Get all admins
  const admins = JSON.parse(localStorage.getItem(ADMINS_STORAGE_KEY) || '{}');
  
  // Validate credentials
  if (admins[username] && admins[username].password === password) {
    // Store admin session
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    sessionStorage.setItem('currentAdmin', username);
    sessionStorage.setItem('currentRoomCode', admins[username].roomCode);
    sessionStorage.removeItem('currentPlayer');
    
    // Redirect to admin panel
    window.location.href = 'admin.html';
  } else {
    showError(passwordInput, 'Usuário ou senha incorretos');
  }
}

// Add player to recent players list (with room code)
function addToRecentPlayers(playerName, roomCode) {
  let recentPlayers = JSON.parse(localStorage.getItem(RECENT_PLAYERS_KEY) || '[]');
  
  // Remove if already exists (to move to top)
  recentPlayers = recentPlayers.filter(p => p.name !== playerName || p.roomCode !== roomCode);
  
  // Add to beginning
  recentPlayers.unshift({ name: playerName, roomCode: roomCode });
  
  // Keep only last 5 players
  recentPlayers = recentPlayers.slice(0, 5);
  
  localStorage.setItem(RECENT_PLAYERS_KEY, JSON.stringify(recentPlayers));
}

// Load and display recent players
function loadRecentPlayers() {
  const recentPlayers = JSON.parse(localStorage.getItem(RECENT_PLAYERS_KEY) || '[]');
  const listContainer = document.getElementById('recent-players-list');
  
  listContainer.innerHTML = '';
  
  if (recentPlayers.length > 0) {
    recentPlayers.forEach(player => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'recent-player-btn';
      button.textContent = `${player.name} (${player.roomCode})`;
      button.addEventListener('click', () => {
        document.getElementById('player-name-input').value = player.name;
        document.getElementById('room-code-input').value = player.roomCode;
      });
      listContainer.appendChild(button);
    });
  }
}
