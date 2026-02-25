# Firebase Firestore Database Architecture

This document describes the structure of the Firestore database used for VolleyBuild. It serves as ground truth for future AI agents and developers.

## Collections

### 1. `users/{uid}`

The root collection for all user-specific data.

#### -> `users/{uid}/data/state` (Document)
- **Description**: The private app state synchronized from the local Zustand (`useAppStore.js`) store.
- **Access**: Read/Write only by the authenticated user (`request.auth.uid == uid`).
- **Fields**: 
  - `isOnboarded` (boolean)
  - `profile` (object)
  - `stats` (object)
  - `workoutPhases` (array)
  - `weightLogs` (object)
  - `workoutHistory` (array)
  - `language` (string: `'nl' | 'en'`)
  - `mode` (string: `'serious' | 'fun'`)
  - `spikes` (number)
  - `inventory` (array of strings)
  - `chest_opens` (number)
  - `equipped` (object: `{ ball, court, hall, jersey, players: [] }`)
  - `customExercises` (array of objects)
  - `downloadedExercises` (array of objects)

#### -> `users/{uid}/profile` (Document)
- **Description**: Public info for social features. Created/deleted when user toggles "Public Profile".
- **Access**: Read by any authenticated user. Write only by the owner.
- **Fields**:
  - `uid` (string)
  - `displayName` (string)
  - `photoURL` (string | null)
  - `level` (string: `'novice' | 'intermediate' | 'advanced'`)
  - `stats` (object: e.g. `{ sessionsCompleted }`)
  - `equipped` (object: current team/items)
  - `updatedAt` (timestamp)

#### -> `users/{uid}/following/{targetUid}` (Document)
- **Description**: Users this `uid` is following.
- **Fields**:
  - `uid` (string)
  - `displayName` (string)
  - `followedAt` (timestamp)

#### -> `users/{uid}/followers/{followerUid}` (Document)
- **Description**: Users who follow this `uid`.
- **Fields**:
  - `uid` (string)
  - `displayName` (string)
  - `followedAt` (timestamp)


### 2. `community_exercises/{exerciseId}`

Global store of custom exercises published by users.

- **Description**: Public exercises/warmups available to download.
- **Access**: Read by any authenticated user. Write only by the creator (`request.auth.uid == createdByUid`).
- **Fields**:
  - `id` (string)
  - `type` (string: `'warmup' | 'workout' | 'cooldown'`)
  - `name` (string)
  - `description` (string)
  - `category` (string: `'performance' | 'core' | 'prehab'` - optional if warmup/cooldown)
  - `goal` (string: `'vertical' | 'agility' | 'injury' | 'all'`)
  - `equipment` (string: `'bodyweight' | 'dumbbells' | 'bands'`)
  - `safeFor` (array of strings: e.g. `['knee', 'shoulder', 'back']`)
  - `videoUrl` (string | null)
  - `impact` (string: `'low' | 'high'`)
  - `createdByUid` (string)
  - `creatorName` (string)
  - `downloads` (number)
  - `createdAt` (timestamp)


## Security Rules Example

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Private app state (Sync)
    match /users/{uid}/data/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    
    // Public Profiles
    match /users/{uid}/profile {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    
    // Followers / Following
    match /users/{uid}/{relationType}/{targetId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (request.auth.uid == uid || request.auth.uid == targetId);
    }
    
    // Community Exercises
    match /community_exercises/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.createdByUid == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.createdByUid == request.auth.uid;
    }
  }
}
```
