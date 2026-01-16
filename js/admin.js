// Admin Panel Interactivity - Ordem Paranormal RPG

let currentDeleteKey = null;
let currentDeletePlayer = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated as admin
  if (!isAdminAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  // Display admin's room code
  displayAdminRoomCode();

  // Load players first
  loadAllPlayers();

  // Setup player search
  const playerSearchInput = document.getElementById('player-search-input');
  if (playerSearchInput) playerSearchInput.addEventListener('input', filterPlayers);

  // Setup character search (active after player selection)
  const characterSearchInput = document.getElementById('character-search-input');
  if (characterSearchInput) characterSearchInput.addEventListener('input', filterSheets);

  // Clear selected player
  const clearBtn = document.getElementById('clear-selected-player');
  if (clearBtn) clearBtn.addEventListener('click', clearSelectedPlayer);
});

// Display admin's room code in header
function displayAdminRoomCode() {
  const roomCode = sessionStorage.getItem('currentRoomCode');
  const headerTitle = document.querySelector('.admin-title p');
  
  if (headerTitle && roomCode) {
    headerTitle.textContent = `Gerenciamento de Fichas de Personagem - Sala: ${roomCode}`;
  }
}

// Check if admin is authenticated
function isAdminAuthenticated() {
  return sessionStorage.getItem('adminSession') === 'true' && 
         sessionStorage.getItem('currentRoomCode');
}

// Load all character sheets
function loadAllSheets(selectedPlayer = null) {
  const container = document.getElementById('sheets-container');
  container.innerHTML = '';
  
  if (!selectedPlayer) {
    container.innerHTML = '<p class="no-results">Selecione um jogador para listar as fichas.</p>';
    return;
  }

  const roomCode = sessionStorage.getItem('currentRoomCode');
  if (!roomCode) {
    container.innerHTML = '<p class="no-results">Erro: código de sala não encontrado.</p>';
    return;
  }

  const allKeys = Object.keys(localStorage);
  const prefix = `characterSheet_${roomCode}_${selectedPlayer}_`;
  const characterKeys = allKeys.filter(key => key.startsWith(prefix) && !key.endsWith('_lastModified'));

  if (characterKeys.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhuma ficha encontrada para este jogador.</p>';
    return;
  }

  characterKeys.forEach(key => {
    try {
      const sheetData = JSON.parse(localStorage.getItem(key));
      const characterName = sheetData['character-name'] || '(Sem Nome)';
      const card = createSheetCard(selectedPlayer, characterName, key);
      container.appendChild(card);
    } catch (e) {
      console.error(`Error parsing sheet for ${selectedPlayer}:`, e);
    }
  });
}

// Create a sheet card element
function createSheetCard(playerName, characterName, storageKey) {
  const card = document.createElement('div');
  card.className = 'sheet-card';
  card.dataset.playerName = playerName;
  card.dataset.characterName = characterName;
  card.dataset.storageKey = storageKey;

  const info = document.createElement('div');
  info.className = 'sheet-info';
  
  const playerEl = document.createElement('div');
  playerEl.className = 'sheet-player';
  playerEl.textContent = playerName;
  
  const characterEl = document.createElement('div');
  characterEl.className = characterName === '(Sem Nome)' ? 'sheet-character sheet-character-empty' : 'sheet-character';
  characterEl.textContent = `Personagem: ${characterName}`;
  
  const detailsEl = document.createElement('div');
  detailsEl.className = 'sheet-details';
  const lastModified = localStorage.getItem(`${storageKey}_lastModified`) || 'data desconhecida';
  detailsEl.textContent = `Última edição: ${lastModified}`;
  
  info.appendChild(playerEl);
  info.appendChild(characterEl);
  info.appendChild(detailsEl);

  const actions = document.createElement('div');
  actions.className = 'sheet-actions';

  const viewBtn = document.createElement('button');
  viewBtn.className = 'action-btn btn-view';
  viewBtn.textContent = 'Visualizar';
  viewBtn.addEventListener('click', () => {
    const roomCode = sessionStorage.getItem('currentRoomCode');
    sessionStorage.setItem('currentPlayer', playerName);
    sessionStorage.setItem('currentCharacter', characterName);
    sessionStorage.setItem('currentRoomCode', roomCode);
    window.location.href = 'index.html';
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn btn-delete';
  deleteBtn.textContent = 'Deletar';
  deleteBtn.addEventListener('click', () => {
    openDeleteModal(playerName, storageKey);
  });

  actions.appendChild(viewBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(info);
  card.appendChild(actions);

  return card;
}

// Load and display players list
function loadAllPlayers() {
  const container = document.getElementById('players-container');
  if (!container) return;
  container.innerHTML = '';

  const roomCode = sessionStorage.getItem('currentRoomCode');
  if (!roomCode) {
    container.innerHTML = '<p class="no-results">Erro: código de sala não encontrado.</p>';
    return;
  }

  const allKeys = Object.keys(localStorage);
  const playerSet = new Set();

  allKeys.forEach(key => {
    if (key.startsWith(`characterSheet_${roomCode}_`) && !key.endsWith('_lastModified')) {
      const parts = key.split('_');
      // Format: characterSheet_ROOMCODE_PLAYERNAME_CHARNAME
      if (parts.length >= 4) {
        const playerName = parts[2];
        playerSet.add(playerName);
      }
    }
  });

  const players = Array.from(playerSet).sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));

  if (players.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhum jogador encontrado nesta sala.</p>';
    return;
  }

  players.forEach(playerName => {
    const playerCard = document.createElement('div');
    playerCard.className = 'sheet-card';
    playerCard.dataset.playerName = playerName;

    const info = document.createElement('div');
    info.className = 'sheet-info';
    const playerEl = document.createElement('div');
    playerEl.className = 'sheet-player';
    playerEl.textContent = playerName;
    info.appendChild(playerEl);

    const actions = document.createElement('div');
    actions.className = 'sheet-actions';
    const selectBtn = document.createElement('button');
    selectBtn.className = 'action-btn btn-view';
    selectBtn.textContent = 'Selecionar';
    selectBtn.addEventListener('click', () => selectPlayer(playerName));
    actions.appendChild(selectBtn);

    const deletePlayerBtn = document.createElement('button');
    deletePlayerBtn.className = 'action-btn btn-delete';
    deletePlayerBtn.textContent = 'Deletar Jogador';
    deletePlayerBtn.addEventListener('click', () => openDeletePlayerModal(playerName));
    actions.appendChild(deletePlayerBtn);

    playerCard.appendChild(info);
    playerCard.appendChild(actions);
    container.appendChild(playerCard);
  });
}

// Filter players list
function filterPlayers() {
  const input = document.getElementById('player-search-input');
  const searchTerm = (input?.value || '').toLowerCase();
  const cards = document.querySelectorAll('#players-container .sheet-card');
  let visible = 0;
  cards.forEach(card => {
    const playerName = card.dataset.playerName.toLowerCase();
    if (playerName.includes(searchTerm)) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });
  const container = document.getElementById('players-container');
  let noEl = container.querySelector('.no-results');
  if (visible === 0) {
    if (!noEl) {
      noEl = document.createElement('p');
      noEl.className = 'no-results';
      noEl.textContent = 'Nenhum jogador encontrado com esse termo.';
      container.appendChild(noEl);
    }
  } else if (noEl) {
    noEl.remove();
  }
}

// Select player and show their characters
function selectPlayer(playerName) {
  const selectedBox = document.getElementById('selected-player-box');
  const title = document.getElementById('selected-player-title');
  const characterSearchBar = document.getElementById('character-search-bar');
  selectedBox.style.display = 'flex';
  title.textContent = `Jogador: ${playerName}`;
  characterSearchBar.style.display = 'block';

  window.__selectedPlayer = playerName;
  loadAllSheets(playerName);
}

// Clear selected player
function clearSelectedPlayer() {
  window.__selectedPlayer = null;
  const selectedBox = document.getElementById('selected-player-box');
  const characterSearchBar = document.getElementById('character-search-bar');
  selectedBox.style.display = 'none';
  characterSearchBar.style.display = 'none';
  const sheets = document.getElementById('sheets-container');
  sheets.innerHTML = '<p class="no-results">Selecione um jogador para listar as fichas.</p>';
}

// Filter sheets based on search input
function filterSheets() {
  const searchTerm = document.getElementById('character-search-input').value.toLowerCase();
  const cards = document.querySelectorAll('.sheet-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const characterName = card.dataset.characterName.toLowerCase();

    if (characterName.includes(searchTerm)) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show "no results" message if needed
  if (visibleCount === 0 && cards.length > 0) {
    const container = document.getElementById('sheets-container');
    if (!container.querySelector('.no-results')) {
      const noResults = document.createElement('p');
      noResults.className = 'no-results';
      noResults.textContent = 'Nenhuma ficha encontrada com esse termo.';
      container.appendChild(noResults);
    }
  } else {
    const noResults = document.querySelector('.no-results');
    if (noResults && visibleCount > 0) {
      noResults.remove();
    }
  }
}

// Open delete confirmation modal
function openDeleteModal(playerName, storageKey) {
  currentDeleteKey = storageKey;
  currentDeletePlayer = null;
  const modal = document.getElementById('delete-modal');
  const message = document.getElementById('delete-message');
  
  message.textContent = `Tem certeza que deseja deletar a ficha de \"${playerName}\"? Esta ação não pode ser desfeita.`;
  modal.style.display = 'flex';
}

// Open player delete confirmation
function openDeletePlayerModal(playerName) {
  currentDeletePlayer = playerName;
  currentDeleteKey = null;
  const modal = document.getElementById('delete-modal');
  const message = document.getElementById('delete-message');
  message.textContent = `Tem certeza que deseja deletar o jogador \"${playerName}\" e TODAS as suas fichas? Esta ação não pode ser desfeita.`;
  modal.style.display = 'flex';
}

// Close delete modal
function closeDeleteModal() {
  const modal = document.getElementById('delete-modal');
  modal.style.display = 'none';
  currentDeleteKey = null;
  currentDeletePlayer = null;
}

// Confirm and execute deletion
function confirmDelete() {
  // Delete a single sheet
  if (currentDeleteKey) {
    localStorage.removeItem(currentDeleteKey);
    const lastModKey = `${currentDeleteKey}_lastModified`;
    localStorage.removeItem(lastModKey);
  }

  // Delete an entire player (all character sheets and references)
  if (currentDeletePlayer) {
    // Second confirmation: require typing the player's name
    const typed = window.prompt(`Para confirmar, digite exatamente o nome do jogador: \"${currentDeletePlayer}\"`);
    if (!typed || typed.trim() !== currentDeletePlayer) {
      // Abort deletion if confirmation fails
      closeDeleteModal();
      return;
    }

    const prefix = `characterSheet_${currentDeletePlayer}_`;
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_lastModified`);
      }
    });
    // Remove from recent players list
    const recentRaw = localStorage.getItem('characterSheet_RecentPlayers');
    if (recentRaw) {
      try {
        const arr = JSON.parse(recentRaw).filter(p => p !== currentDeletePlayer);
        localStorage.setItem('characterSheet_RecentPlayers', JSON.stringify(arr));
      } catch {}
    }
    // If selected player was deleted, clear selection UI
    if (window.__selectedPlayer === currentDeletePlayer) {
      clearSelectedPlayer();
    }
  }

  // Close modal
  closeDeleteModal();

  // Reload appropriate view
  if (currentDeletePlayer) {
    loadAllPlayers();
  } else {
    if (window.__selectedPlayer) {
      loadAllSheets(window.__selectedPlayer);
    } else {
      loadAllPlayers();
    }
  }
}

// Logout admin
function logoutAdmin() {
  sessionStorage.removeItem('adminSession');
  sessionStorage.removeItem('currentAdmin');
  sessionStorage.removeItem('currentRoomCode');
  window.location.href = 'login.html';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('delete-modal');
  if (e.target === modal) {
    closeDeleteModal();
  }
});
