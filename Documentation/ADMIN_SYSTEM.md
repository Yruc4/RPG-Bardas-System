# Admin Panel System - Ordem Paranormal RPG

## Overview
The system now includes a complete admin panel that allows authorized administrators to manage all player character sheets with full view and delete capabilities.

## Admin Credentials
- **Username**: `BigBard`
- **Password**: `mumesar`

## Features

### 1. **Dual Login System**
- **Player Login**: Regular players log in with their name
- **Admin Login**: Toggle to admin section and authenticate with credentials

### 2. **Admin Panel** (`admin.html`)
After logging in with admin credentials, you get access to:
- **View All Character Sheets**: See all saved player character sheets
- **Search Functionality**: Quick search by player name or character name
- **View Sheets**: Click "Visualizar" to view/edit any player's sheet
- **Delete Sheets**: Click "Deletar" to remove a sheet (with confirmation)
- **Last Modified Tracking**: See when each sheet was last edited

### 3. **Secure Authentication**
- Admin credentials stored in code (hardcoded, can be changed)
- Session-based authentication via `sessionStorage`
- Automatic redirect to login if session expires
- Different session types for players vs. admins

### 4. **Data Management**
- Each player's data isolated in their own localStorage key
- Admin can view and manage all player data
- Delete confirmation modal prevents accidental data loss
- Last modified timestamp automatically tracked

## File Structure

```
RPG-Bardas-System/
├── login.html                 (Entry point - handles both player & admin login)
├── admin.html                 (NEW - Admin panel interface)
├── index.html                 (Character sheet)
├── js/
│   ├── login.js              (UPDATED - Added admin authentication)
│   ├── admin.js              (NEW - Admin panel logic)
│   └── character-sheet.js    (UPDATED - Track last modified)
└── css/
    ├── login-style.css       (UPDATED - Added admin button styling)
    ├── admin-style.css       (NEW - Admin panel styling)
    └── style.css             (Character sheet styling)
```

## How It Works

### For Players
1. Open `login.html`
2. Enter your player name
3. Click "Entrar" or select from recent players
4. Character sheet loads with your data
5. All changes auto-save

### For Administrators
1. Open `login.html`
2. Click "Acesso Administrador"
3. Enter username: `BigBard`
4. Enter password: `mumesar`
5. Access admin panel to manage all sheets

### Data Flow

**Player Session:**
```
login.html → (store in sessionStorage) → index.html
Player name used to create unique localStorage key: characterSheet_<PlayerName>
```

**Admin Session:**
```
login.html → (admin authentication) → admin.html
Can access all characterSheet_* keys in localStorage
```

## Technical Details

### Storage Keys
- **Player Data**: `characterSheet_<PlayerName>` (e.g., `characterSheet_Maria`)
- **Recent Players**: `characterSheet_RecentPlayers` (JSON array)
- **Last Modified**: `characterSheet_<PlayerName>_lastModified` (timestamp)
- **Session**: `adminSession` in sessionStorage (authentication flag)

### Key Functions

**In `login.js`:**
- `loginPlayer(playerName)` - Handle player login
- `loginAdmin(username, password)` - Validate admin credentials
- `toggleAdminLogin()` - Switch between player/admin login views
- `addToRecentPlayers(playerName)` - Manage recent players list

**In `admin.js`:**
- `isAdminAuthenticated()` - Check if user is logged in as admin
- `loadAllSheets()` - Fetch and display all character sheets
- `createSheetCard()` - Generate card UI for each sheet
- `filterSheets()` - Search/filter sheets in real-time
- `openDeleteModal()` - Show confirmation before delete
- `confirmDelete()` - Execute sheet deletion
- `logoutAdmin()` - End admin session

**In `character-sheet.js`:**
- `updateLastModifiedTime()` - Track when sheets are saved
- `getPlayerStorageKey()` - Get unique key for current player

## Security Notes

### Current Implementation
- Credentials are hardcoded in `login.js` (fine for local/LAN use)
- No password hashing or encryption
- Session stored in `sessionStorage` (cleared when browser closes)

### For Production Use
Consider:
- Move credentials to a backend server
- Implement proper password hashing (bcrypt, Argon2)
- Add JWT or session tokens
- Use HTTPS
- Implement rate limiting on login attempts
- Add audit logging

## Customization

### Change Admin Credentials
Edit `js/login.js`:
```javascript
const ADMIN_USERNAME = 'BigBard';    // Change username
const ADMIN_PASSWORD = 'mumesar';    // Change password
```

### Change Admin Panel Layout
Edit `css/admin-style.css` to customize colors, spacing, etc.

### Add More Admin Features
Edit `admin.js` to add features like:
- Export all sheets as ZIP
- Bulk operations
- Player statistics
- Backup/restore functionality

## Usage Examples

### Viewing a Player's Sheet as Admin
1. Go to admin panel
2. Find the player in the list
3. Click "Visualizar"
4. Edit their sheet if needed
5. Changes auto-save
6. Go back to admin panel (logout to return)

### Deleting a Sheet
1. Find the player in admin panel
2. Click "Deletar"
3. Confirm deletion in modal
4. Sheet is permanently removed
5. List automatically refreshes

### Searching for a Sheet
1. Use the search bar at the top
2. Type player name or character name
3. Results filter in real-time
4. Clear search to see all sheets

## Troubleshooting

### Admin Login Not Working
- Check username and password are exactly: `BigBard` and `mumesar`
- Ensure caps-lock is OFF
- Try clearing browser cache/cookies

### Can't Access Admin Panel
- Make sure `sessionStorage` is enabled in browser
- Try private/incognito window
- Check browser console for errors

### Sheets Not Showing in Admin Panel
- Check browser DevTools → Application → LocalStorage
- Look for keys starting with `characterSheet_`
- Make sure localStorage isn't full (browser storage limits)

## Browser Requirements
- Modern browser with localStorage support
- JavaScript enabled
- sessionStorage enabled
- Minimum 5MB storage available

## Notes
- Each player's data is completely isolated
- Admin access doesn't modify the login system
- Recent players list is per-browser (not account-based)
- Last modified timestamps are local browser time
- Deleting a sheet from admin panel cannot be undone
