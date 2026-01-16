# Character Selection - Quick Start

## 🎯 New Workflow (3 Steps)

### Step 1: Player Login
```
Open → login.html
Enter Name → "Maria"
Click "Entrar"
```

### Step 2: Character Selection
```
See your character list
- Existing characters shown as cards
- OR see "Você ainda não tem nenhum personagem"

Option A: Load Existing
  Click "Carregar" button on character card

Option B: Create New
  Click "+ Criar Novo Personagem"
  Enter character name (required)
  Optionally select class and origin
  Click "Criar Personagem"
  Character appears in list
  Click "Carregar"
```

### Step 3: Edit Character Sheet
```
Character sheet loads with that character's data
Edit as needed (auto-saves)
Click "Trocar Jogador" to return to selection
```

---

## 📝 Example: First Time Setup

```
1. Open app → login.html
2. Enter name: "João"
3. Click "Entrar" → character-select.html
4. See: "Bem-vindo, João!"
5. See: Empty character list + helpful message
6. Click "+ Criar Novo Personagem"
7. Modal opens:
   - Name: "Guerreiro Valente" (type this)
   - Classe: "Combatente" (select this)
   - Origem: "Militar" (select this)
8. Click "Criar Personagem"
9. Modal closes, see new character card:
   
   ┌─────────────────────────────┐
   │ Guerreiro Valente           │
   │                             │
   │ Classe: Combatente          │
   │ Origem: Militar             │
   │                             │
   │ Última edição: Just now     │
   │                             │
   │ [Carregar]  [Deletar]       │
   └─────────────────────────────┘

10. Click "Carregar" → character sheet opens
11. Customize abilities, skills, attributes, etc.
12. Click "Trocar Jogador" to go back
13. Create more characters OR select "Guerreiro Valente" again
```

---

## 🎮 What You Can Do

| Action | Where | How |
|--------|-------|-----|
| **Create Character** | character-select.html | Click "+ Criar Novo Personagem" button |
| **Load Character** | character-select.html | Click "Carregar" on character card |
| **Edit Character** | index.html | Modify fields (auto-saves) |
| **Delete Character** | character-select.html | Click "Deletar" + confirm |
| **Switch Characters** | character-select.html | "Trocar Jogador" button or browser back |
| **Switch Players** | character-select.html | Click "Trocar Jogador" to login.html |

---

## 💾 Where Data is Saved

**Character Sheets:**
- Stored in browser's localStorage
- Keys: `characterSheet_<PlayerName>_<CharacterName>`
- Example: `characterSheet_João_Guerreiro Valente`
- Survives browser restart ✓

**Session Info:**
- Current player: sessionStorage (cleared on close)
- Current character: sessionStorage (cleared on close)
- Recovery key: localStorage `lastSessionCharacter` (persists)

**Result:** 
- Page reload = character loads exactly where you left off ✓
- Close browser = login again, character data still there ✓
- Delete character = gone forever (no undo) ⚠️

---

## 🔑 Key Files

| File | Purpose | You Need To Know |
|------|---------|------------------|
| login.html | Player/Admin login | Redirects to character-select.html |
| **character-select.html** | **Character selection** | **NEW - See your characters here** |
| index.html | Character sheet | Loads selected character |
| js/login.js | Login logic | Updated to use character-select.html |
| **js/character-select.js** | **Selection logic** | **NEW - Manages character CRUD** |
| js/character-sheet.js | Sheet logic | Updated for multi-character storage |
| **css/character-select-style.css** | **Selection styling** | **NEW - Dark themed cards** |

---

## 🛠️ Troubleshooting

### "I created a character but don't see it"
→ Refresh the page (F5)
→ Check browser console for errors (F12)

### "My character disappeared after delete"
→ You clicked "Deletar" + confirmed
→ Deletion is permanent, cannot be undone
→ Restore from JSON backup if you exported it

### "I keep getting sent to login"
→ Your sessionStorage was cleared
→ Log in again with same player name
→ Your characters are still in localStorage ✓

### "Creating new character fails"
→ Character name might already exist
→ Use a different name
→ Or delete the old one first

### "Can't type in character name field"
→ Clear browser cache
→ Disable browser extensions
→ Try incognito/private mode

---

## ✨ Pro Tips

1. **Export Your Characters**
   - On character sheet, click "Exportar JSON"
   - Save the file as backup
   - Can be restored manually if needed

2. **Multiple Players on Same Computer**
   - Each player name creates separate character list
   - No cross-player data leakage
   - Recommended: Use first names (Maria, João, etc)

3. **Mobile-Friendly**
   - Character-select.html works on phone/tablet
   - Touch "Carregar" and "Deletar" buttons
   - Card layout adapts to screen size

4. **Character Naming**
   - Use descriptive names: "Guerreiro Valente" ✓
   - Avoid special characters: "Guerreiro_v1" ✓
   - Can use full names: "Maria Silva - Oficial" ✓

---

## 📊 Storage Limits

**Per Character:**
- Limited by browser (usually 5-50 MB)
- Character sheet is ~50-100 KB
- Can safely create 100+ characters

**Per Player:**
- Each player list separate
- No interaction between players
- No maximum players

---

## 🔐 Security Notes

- Data stored locally in browser (no server)
- Characters visible only to that player
- Admin can view/delete any character
- Clear browser data = lose everything
- Consider exporting backups

---

## 🎓 Learn More

See detailed guides:
- **CHARACTER_SELECTION.md** - Full documentation
- **LOGIN_SYSTEM.md** - Player login details
- **ADMIN_SYSTEM.md** - Admin panel guide
- **FLOW_DIAGRAM.md** - Complete application flow

---

## 🚀 Ready to Play?

1. Open `login.html`
2. Enter your player name
3. Create your first character
4. Start customizing your operatives!

**Enjoy building your paranormal investigation team!** 🔮👻⚔️
