# Master Admin System - Quick Start Guide

## 🔐 Admin Access

**URL**: `login.html` → Click "Acesso Administrador"

**Credentials**:
- Username: `BigBard`
- Password: `mumesar`

## ✨ What You Can Do as Admin

### 1. **View All Character Sheets**
- See a list of all player character sheets
- View which sheets exist and who owns them
- See last modification date for each sheet

### 2. **Search Sheets**
- Search by player name: "Maria", "João"
- Search by character name: "Guerreiro", "Mago"
- Real-time filtering as you type

### 3. **View/Edit Any Sheet**
- Click "Visualizar" to view a player's character sheet
- Edit their data as needed (changes auto-save)
- Sheets remain isolated per player

### 4. **Delete Sheets**
- Click "Deletar" to remove a character sheet
- Confirmation modal prevents accidents
- Deletion is permanent and cannot be undone

## 📁 New Files Created

1. **`admin.html`** - Admin panel interface
2. **`js/admin.js`** - Admin panel logic
3. **`css/admin-style.css`** - Admin styling
4. **`ADMIN_SYSTEM.md`** - Full documentation

## 📝 Updated Files

1. **`login.html`** - Added admin login section
2. **`css/login-style.css`** - Added admin button styling
3. **`js/login.js`** - Added admin authentication
4. **`js/character-sheet.js`** - Added last modified tracking

## 🎮 How to Use

### Access Admin Panel:
```
1. Go to login.html
2. Click "Acesso Administrador" button
3. Enter: BigBard (username)
4. Enter: mumesar (password)
5. Click "Acessar Painel"
```

### Manage Sheets:
- **Search**: Type in search bar to find players/characters
- **View**: Click "Visualizar" to edit a sheet
- **Delete**: Click "Deletar" then confirm to remove

### Return to Login:
- Click "Sair" button to logout and return to login page

## 🔑 Key Features

✅ Separate admin and player login systems
✅ Search all character sheets instantly
✅ View and edit any player's sheet
✅ Delete sheets with confirmation
✅ Automatic last-modified timestamp tracking
✅ Secure session-based authentication
✅ Beautiful dark-themed UI

## ⚙️ Technical Details

- **Authentication**: Session-based in `sessionStorage`
- **Data Storage**: localStorage with player-specific keys
- **Last Modified**: Auto-tracked on each save
- **Search**: Real-time client-side filtering
- **Delete**: Removes data from localStorage permanently

## 🛡️ Security Notes

Current setup is suitable for:
- Local use
- LAN (local network) use
- Single trusted user scenarios

For production/remote access, consider:
- Backend authentication server
- Password hashing
- HTTPS encryption
- Audit logging

## 📚 Full Documentation

See `ADMIN_SYSTEM.md` for:
- Detailed feature explanations
- Customization options
- Troubleshooting guide
- Browser requirements
- Change admin credentials
- Add more admin features

## 🚀 Quick Tips

- Admin credentials are: `BigBard` / `mumesar`
- You can change these in `js/login.js` if needed
- Search is instant - no button needed
- Deleting cannot be undone - be careful!
- Logout with "Sair" to return to login
