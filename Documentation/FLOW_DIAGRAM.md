# Application Flow Diagram - With Character Selection

```
┌─────────────────────────────────────────────────────────────────┐
│                        ORDEM PARANORMAL RPG                     │
│                   Character Sheet Management System              │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                            ENTRY POINT
═══════════════════════════════════════════════════════════════════

                          login.html
                      (Player/Admin Login)
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        Player Login                  Admin Login
        (Name only)                   (BigBard/mumesar)
                │                           │
                │                    adminSession = true
                │                           │
                │                    sessionStorage
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                     currentPlayer = set
                        (sessionStorage)
                              │
                              ▼
    ┌─────────────────────────────────────────────────────┐
    │         PLAYER PATH vs ADMIN PATH                  │
    └─────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                        PLAYER LOGIN PATH
═══════════════════════════════════════════════════════════════════

            currentPlayer = "Maria"
            adminSession = false
                    │
                    ▼
          character-select.html
        (Character Selection Screen)
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    Existing    Create New   Logout
    Characters  Character    Button
        │           │           │
        │           │           └──► login.html
        │           │
        │           ▼
        │     + Criar Novo
        │     Personagem Modal
        │           │
        │     (Enter details)
        │           │
        │           ▼
        │     createNewCharacter()
        │     └─► localStorage:
        │         characterSheet_Maria_Guerreiro
        │
        └──► Click "Carregar"
             └─► currentCharacter = set
             └─► sessionStorage
                    │
                    ▼
              index.html
        (Character Sheet)
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
    Edit Sheet          "Trocar Jogador"
    (Auto-save)                │
        │                      │
        │                  sessionStorage
        │                  clear player/char
        │                      │
        └──────┬───────────────┘
               │
               ▼
        character-select.html
    (Back to character selection)

═══════════════════════════════════════════════════════════════════
                         ADMIN LOGIN PATH
═══════════════════════════════════════════════════════════════════

          currentPlayer = undefined
          adminSession = true
                    │
                    ▼
               admin.html
          (Admin Panel)
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    Search     View Sheet   Delete Sheet
    Sheets     (loadCharacter)
        │           │           │
        │           │      ┌────┴─────┐
        │           │      │           │
        │           │      ▼           ▼
        │           │   Confirm    Cancel
        │           │   Delete     (Modal)
        │           │      │
        │           │   Remove from
        │           │   localStorage
        │           │
        │           └──► index.html
        │           (View/Edit
        │           Player's Sheet)
        │                   │
        │            (Can't change
        │             player/character)
        │                   │
        │                   ▼
        │          "Trocar Jogador"
        │                   │
        │          (Redirect to
        │           character-select)
        │
        └──► "Sair" Button
             └─► admin.html
                 logout
                    │
                    ▼
                login.html

═══════════════════════════════════════════════════════════════════
                       DATA STORAGE KEYS
═══════════════════════════════════════════════════════════════════

Player: "Maria"
Characters: "Guerreiro", "Maga", "Infiltrador"

Storage Keys:
├── characterSheet_Maria_Guerreiro
│   └─ Full character sheet data (JSON)
│
├── characterSheet_Maria_Guerreiro_lastModified
│   └─ "Dec 11, 2025 3:45 PM"
│
├── characterSheet_Maria_Maga
│   └─ Full character sheet data (JSON)
│
├── characterSheet_Maria_Infiltrador
│   └─ Full character sheet data (JSON)
│
├── characterSheet_RecentPlayers
│   └─ ["Maria", "João", "Pedro", ...]
│
└── lastSessionPlayer
    └─ "Maria" (for reload persistence)

════════════════════════════════════════════════════════════════════

SessionStorage (cleared on browser close):
├── currentPlayer: "Maria"
├── currentCharacter: "Guerreiro"
└── adminSession: true/false

LocalStorage (persists forever):
├── characterSheet_<Player>_<Character>
├── characterSheet_<Player>_<Character>_lastModified
├── characterSheet_RecentPlayers
└── lastSessionPlayer (for reload recovery)

════════════════════════════════════════════════════════════════════
                        PAGE RELOAD BEHAVIOR
════════════════════════════════════════════════════════════════════

Scenario: User editing "Maria's Guerreiro" → Presses F5

1. Browser closes sessionStorage (lost currentPlayer, currentCharacter)
2. Page reloads → window.addEventListener('load')
3. Load handler checks sessionStorage (empty)
4. Fallback to localStorage:
   - lastSessionPlayer = "Maria" ✓
   - lastSessionCharacter = "Guerreiro" ✓
5. Restore to sessionStorage
6. Load character data from:
   characterSheet_Maria_Guerreiro
7. Character sheet loads exactly where they left off ✓

════════════════════════════════════════════════════════════════════
                      CHARACTER SELECTION FLOW
════════════════════════════════════════════════════════════════════

character-select.html Actions:

1. Load Characters
   getAllCharactersForPlayer(currentPlayer)
   └─ Query all localStorage keys starting with
      "characterSheet_<PlayerName>_"
   └─ Parse each, display as card

2. Card Display
   Character Name: "Guerreiro"
   Classe: "Combatente"
   Origem: "Militar"
   Last Modified: "Dec 11, 2025"
   
   [Carregar] [Deletar]

3. Carregar (Load)
   currentCharacter = "Guerreiro"
   sessionStorage.setItem('currentCharacter', ...)
   window.location.href = 'index.html'
   └─ Character sheet loads with full data

4. Deletar (Delete)
   → openDeleteConfirm('Guerreiro')
   → Confirmation Modal
   → confirmDelete()
   → localStorage.removeItem('characterSheet_Maria_Guerreiro')
   → localStorage.removeItem('...lastModified')
   → Reload character list (card vanishes)

5. + Criar Novo Personagem
   → openCreateModal()
   → Form Modal
   → Input: "Lâmina Paranormal" (name)
   → Select: "Ocultista" (class)
   → Select: "Culista Arrependido" (origin)
   → confirmCreate()
   → createNewCharacter('Maria', 'Lâmina Paranormal', ...)
   → New localStorage key created
   → Card appears in list

════════════════════════════════════════════════════════════════════
                           FILE STRUCTURE
════════════════════════════════════════════════════════════════════

Project Root/
├── login.html ─────────────┐ Entry point
│                           │
├── character-select.html ◄─┘ New: Character selection
│
├── index.html ─────────── Character sheet
│
├── admin.html ─────────── Admin panel
│
├── css/
│   ├── Style.css ─────────── Character sheet styling
│   ├── login-style.css
│   ├── admin-style.css
│   └── character-select-style.css ◄─ New: Selection styling
│
├── js/
│   ├── login.js ─────────────── Handles login redirects
│   ├── character-select.js ◄─── New: Selection logic
│   ├── character-sheet.js ───── Updated: Multi-character keys
│   └── admin.js
│
└── Documentation/
    ├── LOGIN_SYSTEM.md
    ├── ADMIN_SYSTEM.md
    ├── ADMIN_QUICKSTART.md
    └── CHARACTER_SELECTION.md ◄─ New: This feature guide

════════════════════════════════════════════════════════════════════
```

## Key Changes Summary

### New Features
✅ Character selection screen after login
✅ Create new characters with optional class/origin
✅ Load existing characters
✅ Delete characters with confirmation
✅ Multi-character support per player
✅ Character-based data isolation

### Updated Flows
✅ Player login → character-select.html (not index.html directly)
✅ Character selection → index.html with character loaded
✅ "Trocar Jogador" → character-select.html (not login.html)
✅ Storage keys now include character name

### Data Architecture
✅ `characterSheet_<Player>_<Character>` storage keys
✅ Session persistence across browser reloads
✅ Complete player/character data isolation
✅ Last modified tracking per character

### User Experience
✅ Beautiful card-based character list
✅ Safe deletion with confirmation modal
✅ Quick character creation in modal
✅ Clear visual feedback for all actions
✅ Dark-themed responsive design
