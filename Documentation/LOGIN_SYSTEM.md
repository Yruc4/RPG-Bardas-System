# Login System Implementation - Ordem Paranormal RPG

## Overview
The character sheet now has a login system that manages character data per player. Each player's data is saved separately in localStorage.

## Features

### 1. **Login Page** (`login.html`)
- Simple interface asking only for the player's name
- Recent players list for quick access (remembers last 5 players)
- Click on a recent player to quickly login
- Automatically redirects to the character sheet after login

### 2. **Player-Based Data Storage**
- Each player's character sheet is saved with their own storage key: `characterSheet_<PlayerName>`
- Completely isolated data per player - no mixing of character sheets
- Switching players is as simple as going back to the login page

### 3. **Auto-Fill Player Name**
- When a player logs in, their name automatically fills the "Nome do Jogador" field
- Can still be edited if needed

### 4. **New Player Default (NEX = 5)**
- When a new player logs in for the first time, the NEX field automatically defaults to 5
- Returning players see their previously saved NEX value

## How It Works

### Starting the Application
1. User opens `login.html` instead of `index.html`
2. Types their player name and hits Enter or clicks "Entrar"
3. Automatically redirected to `index.html` with their name set

### Data Flow
1. **Login** → Player name stored in `sessionStorage` (temporary, for this session)
2. **Character Sheet** → Uses player name to create unique localStorage key
3. **Save** → All changes automatically saved to that player's key
4. **Logout/Return** → New player gets NEX = 5, returning player gets their data

### Recent Players
- Automatically tracked in `characterSheet_RecentPlayers`
- Shows last 5 players
- Click any recent player to quickly login

## File Structure

```
RPG-Bardas-System/
├── login.html                 (NEW - Entry point)
├── index.html                 (Character sheet - unchanged)
├── js/
│   ├── login.js              (NEW - Login logic)
│   └── character-sheet.js    (UPDATED - Player-based storage)
└── css/
    ├── login-style.css       (NEW - Login styling)
    └── style.css             (Character sheet styling - unchanged)
```

## Usage Instructions

### For Users
1. **First Time**: Go to `login.html`, enter your name, click "Entrar"
2. **Returning**: Go to `login.html`, either:
   - Type your name and press Enter, OR
   - Click your name in the "Jogadores Recentes" list
3. Your character sheet will load with your saved data (or NEX=5 if new player)

### Customization Options

#### Change recent players limit
In `js/login.js`, change this line:
```javascript
recentPlayers = recentPlayers.slice(0, 5);  // Change 5 to desired number
```

#### Redirect URL
If you rename `index.html`, update `js/login.js`:
```javascript
window.location.href = 'index.html';  // Change to your new filename
```

#### Default NEX value
In `js/character-sheet.js`, change:
```javascript
nexField.value = '5';  // Change 5 to desired default
```

## Technical Details

### Storage Keys
- **Recent Players**: `characterSheet_RecentPlayers` (JSON array of player names)
- **Per-Player Data**: `characterSheet_<PlayerName>` (JSON object with all form fields)
- **Session**: `currentPlayer` in sessionStorage (current login session)

### Key Functions

**In `login.js`:**
- `loginPlayer(playerName)` - Handles login logic
- `addToRecentPlayers(playerName)` - Manages recent players list
- `loadRecentPlayers()` - Displays recent players on page load

**In `character-sheet.js`:**
- `getPlayerStorageKey()` - Returns the unique storage key for current player
- `saveCharacterData()` - Saves to player-specific key
- Auto-fill player name from sessionStorage

## Notes
- Player-based storage is isolated - characters don't interfere with each other
- Recent players list persists even after closing the browser
- To delete a player's data, clear that specific localStorage key in browser DevTools
- To clear all data, use "Clear Site Data" in browser settings
