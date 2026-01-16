// Character Selection Screen Logic

// Redirect to login if no player is logged in
function checkPlayerSession() {
  const currentPlayer = sessionStorage.getItem('currentPlayer');
  const currentRoomCode = sessionStorage.getItem('currentRoomCode');
  if (!currentPlayer || !currentRoomCode) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Load and display player's characters
function loadPlayerCharacters() {
  if (!checkPlayerSession()) return;

  const currentPlayer = sessionStorage.getItem('currentPlayer');
  const currentRoomCode = sessionStorage.getItem('currentRoomCode');
  const playerDisplay = document.getElementById('player-name-display');
  const container = document.getElementById('characters-container');

  if (playerDisplay) {
    playerDisplay.textContent = `${currentPlayer} (Sala: ${currentRoomCode})`;
  }

  // Get all characters for this player in this room from localStorage
  const characters = getAllCharactersForPlayer(currentPlayer, currentRoomCode);

  container.innerHTML = ''; // Clear previous

  if (characters.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>Você ainda não tem nenhum personagem.</p>
        <p>Crie um novo clicando no botão abaixo!</p>
      </div>
    `;
    return;
  }

  // Display each character as a card
  characters.forEach(char => {
    const card = createCharacterCard(char, currentPlayer);
    container.appendChild(card);
  });
}

// Get all characters for a player in a specific room
function getAllCharactersForPlayer(playerName, roomCode) {
  const characters = [];
  
  // Search for all keys like 'characterSheet_<RoomCode>_<PlayerName>_<CharacterName>'
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const prefix = `characterSheet_${roomCode}_${playerName}_`;
    
    if (key.startsWith(prefix) && !key.endsWith('_lastModified')) {
      const characterName = key.substring(prefix.length);
      
      // Skip if it's a meta key
      if (!characterName.includes('_')) {
        const data = localStorage.getItem(key);
        const lastModified = localStorage.getItem(`${key}_lastModified`) || 'Nunca';
        
        try {
          const parsed = JSON.parse(data);
          characters.push({
            name: characterName,
            playerName: playerName,
            roomCode: roomCode,
            storageKey: key,
            classe: parsed['classe'] || 'Não definida',
            origem: parsed['origem'] || 'Não definida',
            lastModified: lastModified,
            data: parsed
          });
        } catch (e) {
          console.error(`Could not parse character ${characterName}`);
        }
      }
    }
  }

  return characters;
}

// Create a character card element
function createCharacterCard(character, playerName) {
  const card = document.createElement('div');
  card.className = 'character-card';

  const classeDisplay = character.classe === '' ? 'Não definida' : character.classe;
  const origemDisplay = character.origem === '' ? 'Não definida' : character.origem;

  card.innerHTML = `
    <div>
      <h3>${escapeHtml(character.name)}</h3>
      <div class="character-info">
        <div>Classe: <strong>${escapeHtml(classeDisplay)}</strong></div>
        <div>Origem: <strong>${escapeHtml(origemDisplay)}</strong></div>
      </div>
      <div class="character-meta">
        Última edição: ${character.lastModified}
      </div>
    </div>
    <div class="character-actions">
      <button class="btn btn-load" onclick="loadCharacter('${escapeAttr(character.name)}')">
        Carregar
      </button>
      <button class="btn btn-delete" onclick="openDeleteConfirm('${escapeAttr(character.name)}')">
        Deletar
      </button>
    </div>
  `;

  return card;
}

// Load selected character and go to sheet
function loadCharacter(characterName) {
  const currentPlayer = sessionStorage.getItem('currentPlayer');
  
  // Store selected character in sessionStorage
  sessionStorage.setItem('currentCharacter', characterName);
  
  // Redirect to character sheet
  window.location.href = 'index.html';
}

// Open create character modal
function openCreateModal() {
  const modal = document.getElementById('create-modal');
  modal.classList.remove('hidden');
  document.getElementById('new-character-name').focus();
}

// Close create modal
function closeCreateModal() {
  const modal = document.getElementById('create-modal');
  modal.classList.add('hidden');
  document.getElementById('create-character-form').reset();
}

// Handle create character form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-character-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const characterName = document.getElementById('new-character-name').value.trim();
      const classe = document.getElementById('new-character-class').value;
      const origem = document.getElementById('new-character-origin').value;

      if (!characterName) {
        alert('Por favor, digite um nome para o personagem.');
        return;
      }

      const currentPlayer = sessionStorage.getItem('currentPlayer');
      const currentRoomCode = sessionStorage.getItem('currentRoomCode');

      // Check if character already exists
      const characters = getAllCharactersForPlayer(currentPlayer, currentRoomCode);
      if (characters.some(c => c.name === characterName)) {
        alert('Um personagem com esse nome já existe!');
        return;
      }

      // Create new character sheet
      createNewCharacter(currentPlayer, currentRoomCode, characterName, classe, origem);

      // Close modal and reload
      closeCreateModal();
      loadPlayerCharacters();
    });
  }

  // Close modals when clicking outside
  document.getElementById('create-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('create-modal')) {
      closeCreateModal();
    }
  });

  document.getElementById('delete-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('delete-modal')) {
      closeDeleteModal();
    }
  });

  // Load characters on page load
  loadPlayerCharacters();
});

// Create new character with initial data
function createNewCharacter(playerName, roomCode, characterName, classe, origem) {
  const storageKey = getPlayerCharacterStorageKey(playerName, roomCode, characterName);

  // Initialize with minimal data
  const initialData = {
    'player-name': playerName,
    'character-name': characterName,
    'classe': classe,
    'origem': origem,
    'nex': '5', // Default NEX
    'origem': origem,
    'afinidade': '',
    // Other fields remain empty for user to fill
  };

  localStorage.setItem(storageKey, JSON.stringify(initialData));
  
  // Set last modified
  const now = new Date().toLocaleString('pt-BR');
  localStorage.setItem(`${storageKey}_lastModified`, now);
}

// Get storage key for a character
function getPlayerCharacterStorageKey(playerName, roomCode, characterName) {
  return `characterSheet_${roomCode}_${playerName}_${characterName}`;
}

// Open delete confirmation
function openDeleteConfirm(characterName) {
  const modal = document.getElementById('delete-modal');
  const nameDisplay = document.getElementById('delete-char-name');
  
  nameDisplay.textContent = escapeHtml(characterName);
  
  // Store character name for confirmation
  window.charToDelete = characterName;
  
  modal.classList.remove('hidden');
}

// Close delete modal
function closeDeleteModal() {
  const modal = document.getElementById('delete-modal');
  modal.classList.add('hidden');
  window.charToDelete = null;
}

// Confirm delete
function confirmDelete() {
  if (!window.charToDelete) return;

  const currentPlayer = sessionStorage.getItem('currentPlayer');
  const currentRoomCode = sessionStorage.getItem('currentRoomCode');
  const storageKey = getPlayerCharacterStorageKey(currentPlayer, currentRoomCode, window.charToDelete);

  // Remove from localStorage
  localStorage.removeItem(storageKey);
  localStorage.removeItem(`${storageKey}_lastModified`);

  closeDeleteModal();
  loadPlayerCharacters();
}

// Logout and return to login
function logoutFromSelect() {
  sessionStorage.removeItem('currentPlayer');
  sessionStorage.removeItem('currentCharacter');
  sessionStorage.removeItem('currentRoomCode');
  window.location.href = 'login.html';
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Helper: Escape attribute value
function escapeAttr(text) {
  return escapeHtml(text).replace(/'/g, '&#039;');
}
