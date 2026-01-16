# Room-Based System - Bardas RPG

## Overview
The system now supports multiple administrators, each with their own private room. Players must have a room code to join and create characters.

## Key Features

### 1. **Admin Account Creation**
- Admins can create their own accounts at the login screen
- Each admin gets a unique 6-character room code (e.g., `ABC123`)
- The default admin account still exists:
  - Username: `BigBard`
  - Password: `mumesar`
  - Room Code: `BARD00`

### 2. **Player Login**
- Players must enter their name AND a room code
- Only valid room codes are accepted
- Players are associated with the room they join
- Recent players list now shows player names with their room codes

### 3. **Data Isolation**
- Each room's data is completely isolated
- Storage format: `characterSheet_[ROOMCODE]_[PLAYERNAME]_[CHARNAME]`
- Admins only see players and characters from their own room
- Players only see their characters from their current room

### 4. **Admin Panel**
- Displays the admin's room code in the header
- Lists only players from the admin's room
- Can view and manage only characters in their room

## How to Use

### For Admins:
1. Go to the login screen
2. Click "Criar Conta de Administrador"
3. Enter a username and password
4. Your room code will be displayed - **save this code!**
5. Share the room code with your players

### For Players:
1. Enter your player name
2. Enter the room code provided by your admin
3. Create and manage your characters

## Technical Changes

### Modified Files:
- `login.html` - Added room code input and admin creation form
- `login.js` - Handles admin creation, room code validation
- `character-select.js` - Filters characters by room code
- `admin.js` - Filters data by admin's room code
- `character-sheet.js` - Includes room code in storage keys

### Storage Structure:
- Admin accounts: `characterSheet_Admins` (JSON object)
- Characters: `characterSheet_[ROOMCODE]_[PLAYER]_[CHARACTER]`
- Recent players: Stores name and room code pairs

## Important Notes
- Room codes are automatically generated and unique
- Each admin's data is completely separate
- Players can be in multiple rooms with different room codes
- The system is backward compatible with existing data
