# Chat Save Implementation - Summary

## Overview

All user chats are now saved in the database in **raw form without encryption**. Passwords are also stored in plain text for testing purposes.

## Changes Made

### 1. **Database Model Updates**

#### File: `backend/models/ChatSession.js`

- Added `userId` field (required) to link chats to specific users
- Removed `unique: true` from `sessionId`
- Added compound index on `userId` + `sessionId` to ensure each user has unique sessions
- Chat messages remain unencrypted

### 2. **Save Chat Function**

#### File: `backend/utils/saveChat.js`

- Updated `saveMessage(userId, sessionId, role, content)` to accept `userId` as first parameter
- Now queries by both `userId` and `sessionId` for user-specific chat storage
- Keeps last 20 messages per session

### 3. **Get Chat History Function**

#### File: `backend/utils/getChatHistory.js`

- Updated `getChatHistory(userId, sessionId, limit = 6)` to accept `userId`
- Returns only chats for the authenticated user

### 4. **Authentication Routes**

#### File: `backend/routes/auth.js`

- **Password**: Plain text comparison (no encryption)
- Added `POST /auth/logout` endpoint
- Logout signal for frontend to clear token

### 5. **Chat Endpoints**

#### File: `backend/index.js`

- Updated `POST /chat` to require authentication (auth middleware)
- Extracts `userId` from JWT token
- Saves user and LLM messages with user ID

#### New Endpoints Added:

**GET `/chat/history/:sessionId`** (Requires Authentication)

```
Returns all chat messages for a specific session
Query Params: sessionId
Response: { history: [...messages] }
```

**DELETE `/chat/session/:sessionId`** (Requires Authentication)

```
Deletes a specific chat session for the user
Returns: { success: true, message: "Chat session deleted" }
```

**DELETE `/chat/clear-all`** (Requires Authentication)

```
Deletes ALL chat sessions for the logged-in user
Called on logout to remove all chats
Returns: { success: true, deletedCount: number }
```

## How It Works

### For Users

1. **Login**: User logs in with username/password (plain text)
2. **Chat**: Each message is automatically saved with the user's ID
3. **Logout**: Call `DELETE /chat/clear-all` to remove all chats from database
4. **Session Isolation**: Only authenticated users can access their own chats

### Database Storage

- All chats stored in `ChatSession` collection
- Each document contains: `userId`, `sessionId`, `messages[]`, `timestamps`
- Messages stored as: `{ role: "user"|"llm", content: "text" }`
- **No encryption** - raw text storage

## Frontend Integration

### Login/Signup

```javascript
// Same as before - plain text password
POST / auth / signup;
POST / auth / login;
// Returns: { token: "jwt_token" }
```

### Chat Saving (Automatic)

```javascript
// Already handled by backend
POST / auth / logout; // Optional frontend notification
DELETE / chat / clear - all; // Call this before clearing local storage
```

### Headers Required

```javascript
Authorization: Bearer <jwt_token>
```

## Testing Checklist

- [x] Password stored in plain text
- [x] Chats saved per user without encryption
- [x] Chats linked to user ID in database
- [x] Logout clears all user chats from DB
- [x] Another user cannot access deleted user's chats
- [x] User can view chat history with sessionId
- [x] New users start with empty chat

## Security Note

⚠️ **This setup is for TESTING ONLY**:

- Passwords are in plain text
- Chats are unencrypted
- No production security measures
- Suitable only for development/testing environments
