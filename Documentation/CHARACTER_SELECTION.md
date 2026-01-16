# Character Selection System - User Guide

## 📋 Overview

After logging in with a player name, you now have a dedicated screen to manage your characters. This allows you to:
- View all your existing characters
- Load a character to edit their sheet
- Create new characters
- Delete characters

---

## 🎮 Workflow

### 1. **Login**
```
1. Open login.html
2. Enter your player name (e.g., "Maria", "João")
3. Click "Entrar"
```

### 2. **Character Selection Screen**
You'll see:
- **Welcome message** with your player name
- **Your Characters** section showing all your existing characters
- **Create New Character** button

### 3. **Load a Character**
Click the green **"Carregar"** button on any character card to:
- Open that character's sheet
- Edit their abilities, skills, resources, etc.
- Changes auto-save to your character

### 4. **Create a New Character**
Click **"+ Criar Novo Personagem"** to:
- Enter character name (required)
- Optionally select class and origin (can be set later on the sheet)
- Character created with NEX defaulting to 5

### 5. **Delete a Character**
Click the red **"Deletar"** button to:
- See a confirmation dialog
- Click "Deletar" to permanently remove
- Character is gone forever (no undo)

### 6. **Switch Player**
Click **"Trocar Jogador"** to:
- Return to login page
- Log in as a different player
- See that player's characters

---

## 📁 Data Storage Structure

Each character is stored with a unique key:
```
characterSheet_<PlayerName>_<CharacterName>
```

Example:
- Player: "Maria"
- Characters: "Guerreiro Valente", "Maga Misteriosa"

Storage keys:
- `characterSheet_Maria_Guerreiro Valente`
- `characterSheet_Maria_Maga Misteriosa`

Each player's characters are completely isolated from other players.

---

## 🎨 UI Features

### Character Cards
Each character shows:
- **Character Name** (large, prominent)
- **Classe** (e.g., Combatente, Especialista, Ocultista)
- **Origem** (e.g., Militar, Acadêmico)
- **Last Modified** timestamp (e.g., "Dec 11, 2025 at 3:45 PM")
- **Action Buttons**:
  - Green "Carregar" → Load character sheet
  - Red "Deletar" → Delete character

### Empty State
When you have no characters yet:
- Helpful message: "Você ainda não tem nenhum personagem."
- Instruction: "Crie um novo clicando no botão abaixo!"

### Create Character Modal
Popup form with:
- **Character Name** input (required)
- **Classe** dropdown (optional, set later on sheet)
- **Origem** dropdown (optional, set later on sheet)
- "Criar Personagem" button (submit)
- "Cancelar" button (close)

### Delete Confirmation Modal
Safety confirmation with:
- Character name to be deleted
- Warning: "Esta ação é irreversível" (This action cannot be undone)
- "Deletar" button (confirm)
- "Cancelar" button (cancel)

---

## 💾 Session Management

### Page Reload Persistence
Characters persist across:
- Browser page refresh (F5)
- Tab closure and reopening
- Computer restart (if localStorage intact)

Your current character name is stored in `lastSessionCharacter` localStorage key.

### Session Context
Two types of sessions maintained:
- **Player Session**: `currentPlayer` in sessionStorage
- **Character Selection**: `currentCharacter` in sessionStorage

Both are cleared when you click "Trocar Jogador".

---

## 🔧 Technical Details

### New Files Created

1. **`character-select.html`** - Character selection page
   - Header with player name and logout button
   - Character grid with cards
   - Create and delete modals

2. **`css/character-select-style.css`** - Dark-themed styling
   - Card-based layout
   - Responsive grid (mobile-friendly)
   - Modal animations
   - Button states and transitions

3. **`js/character-select.js`** - Selection logic
   - `loadPlayerCharacters()` - Fetch and display all characters
   - `getAllCharactersForPlayer(playerName)` - Query localStorage
   - `createCharacterCard(character)` - Generate card DOM
   - `createNewCharacter(playerName, characterName, classe, origem)` - Initialize character
   - `loadCharacter(characterName)` - Set current character and go to sheet
   - `openCreateModal()` / `closeCreateModal()` - Modal handling
   - `openDeleteConfirm()` / `confirmDelete()` - Delete flow

### Updated Files

1. **`js/login.js`**
   - `loginPlayer()` now redirects to `character-select.html` instead of `index.html`

2. **`js/character-sheet.js`**
   - `getPlayerStorageKey()` now supports character-based keys: `characterSheet_<Player>_<Character>`
   - Load handler restores `lastSessionCharacter` for page reload persistence
   - `logoutPlayer()` clears character session and redirects to `character-select.html`

---

## ✨ Key Features

✅ **Multiple Characters per Player** - Create as many as you want
✅ **Easy Selection** - Simple card-based interface
✅ **Quick Creation** - Modal form for new characters
✅ **Safe Deletion** - Confirmation prevents accidents
✅ **Persistent Data** - Characters saved across browser sessions
✅ **Session Management** - Clean separation between players
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Dark Theme** - Matches rest of application

---

## 🎯 Workflow Example

1. **First Time User**
   - Opens app → Sees login
   - Enters name "João"
   - Lands on character-select.html with "Bem-vindo, João!"
   - Empty characters section
   - Clicks "+ Criar Novo Personagem"
   - Names character "Guerreiro"
   - Selects "Combatente" class
   - Clicks "Criar Personagem"
   - Sees new card for "Guerreiro"
   - Clicks "Carregar"
   - Opens character sheet to customize

2. **Returning User**
   - Opens app → Sees login
   - Enters same name "João"
   - Lands on character-select.html
   - Sees all previously created characters
   - Clicks "Carregar" on "Guerreiro"
   - Character sheet loads with previous data

3. **Multiple Characters**
   - Same player "João" has 3 characters
   - Can load any one
   - Data isolated per character
   - Delete only affects one character

---

## 🛠️ Troubleshooting

### Characters Not Showing
- Clear browser cache
- Check localStorage isn't disabled
- Verify player name spelling matches previous login

### Can't Create Character with Same Name
- Each character name must be unique per player
- Different players can have same character name
- Delete old character if you want to reuse name

### Lost a Character
- If you deleted by accident, it's unrecoverable
- Consider exported character sheet as backup (JSON export)

### Page Reloads Take You to Login
- This is normal if you clear sessionStorage
- Your character data is still saved (in localStorage)
- Simply log in again and select your character

---

## 📚 Related Documentation

- **LOGIN_SYSTEM.md** - Player login details
- **ADMIN_SYSTEM.md** - Admin panel guide
- For character sheet help, see main README

---

## 🚀 Next Steps

1. **Create Your First Character** - Click "Criar Novo Personagem"
2. **Load It** - Click "Carregar" to open the character sheet
3. **Customize** - Fill in details, abilities, skills
4. **Save** - Changes auto-save as you type
5. **Create More** - Return to character-select.html via "Trocar Jogador"

Enjoy building your paranormal operatives!
