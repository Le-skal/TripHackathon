# 🌍 TripWise - Planificateur de Voyages Intelligent

Une application web complète de planification de voyages alimentée par l'IA, permettant aux utilisateurs de créer des itinéraires personnalisés, gérer leurs voyages et partager leurs expériences.

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Technologies utilisées](#technologies-utilisées)
4. [Installation et configuration](#installation-et-configuration)
5. [Démarrage de l'application](#démarrage-de-lapplication)
6. [Structure des fichiers](#structure-des-fichiers)
7. [Fonctionnalités](#fonctionnalités)
8. [Configuration Firebase](#configuration-firebase)
9. [Serveur backend](#serveur-backend)
10. [Choix technologiques](#choix-technologiques)
11. [Déploiement](#déploiement)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'ensemble

**TripWise** est une application SaaS (Software as a Service) qui permet aux utilisateurs de :

- ✅ **S'inscrire et se connecter** avec authentification sécurisée
- ✅ **Créer des voyages** avec des informations détaillées
- ✅ **Générer des itinéraires IA** basés sur les préférences utilisateur
- ✅ **Consulter et gérer** tous leurs voyages
- ✅ **Visualiser des voyages** passés et futurs
- ✅ **Gérer leur profil** utilisateur

### Cas d'usage principal :
Un utilisateur veut planifier un voyage à Bali en 5 jours pour 2 personnes avec un budget de 2000€. Il entre ces informations, l'IA génère automatiquement un itinéraire détaillé jour par jour avec des suggestions d'activités, restaurants et hébergements.

---

## 🏗️ Architecture du projet

### Vue globale :

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                       │
│                  Port 3000                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SignIn / SignUp (Firebase Auth)                │  │
│  │  Dashboard (Vue des voyages)                    │  │
│  │  CreateTrip (Formulaire + Génération IA)        │  │
│  │  TripList (Liste des voyages)                   │  │
│  │  Profile (Gestion du profil)                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│           FIREBASE (Google Cloud)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Authentication (Firebase Auth)                 │  │
│  │  Firestore (Base de données NoSQL)              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND NODE.JS                            │
│                  Port 5000                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  /api/generate-plan (Génération d'itinéraire)    │   │
│  │  Intégration Ollama (LLM local)                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│              OLLAMA (LLM Local)                         │
│                  Port 11434                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Modèle: Mistral (ou autre)                      │   │
│  │  Génération de texte IA pour les itinéraires     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Flux de données :

```
Utilisateur crée un voyage
        ▼
React capture les données du formulaire
        ▼
Frontend envoie requête POST → Backend Node.js:5000
        ▼
Backend appelle Ollama:11434 avec le prompt
        ▼
Ollama génère le plan IA
        ▼
Backend retourne le plan au Frontend
        ▼
Utilisateur voit le plan et clique "Sauvegarder"
        ▼
Frontend sauvegarde dans Firestore
        ▼
Voyage stocké avec userId et timestamp
```

---

## 🛠️ Technologies utilisées

### Frontend
| Technologie | Version | Raison |
|---|---|---|
| **React** | 19.1.0 | Framework UI moderne, composants réutilisables |
| **React Router DOM** | 7.5.3 | Navigation côté client, routing SPA |
| **Axios** | 1.9.0 | Requêtes HTTP (initialement, remplacé par fetch) |
| **Firebase SDK** | 11.6.1 | Authentification et base de données temps réel |

### Backend
| Technologie | Version | Raison |
|---|---|---|
| **Node.js** | 20+ | Runtime JavaScript côté serveur |
| **Express** | 5.1.0 | Framework web minimal et efficace |
| **CORS** | 2.8.5 | Autoriser les requêtes cross-origin du frontend |
| **Body Parser** | 2.2.0 | Parser les requêtes JSON |
| **Axios** | 1.9.0 | Requêtes HTTP vers Ollama |
| **Dotenv** | 16.5.0 | Variables d'environnement |

### Infrastructure & Services
| Service | Raison |
|---|---|
| **Firebase (Google Cloud)** | Authentification, Firestore (DB NoSQL), Hosting optionnel |
| **Ollama** | LLM local gratuit (Mistral, Llama2, etc.) |
| **Git/GitHub** | Versioning et collaboration |

---

## 📥 Installation et configuration

### Prérequis

Assurez-vous d'avoir installé :
- **Node.js** (v16+) - [Télécharger](https://nodejs.org)
- **Git** - [Télécharger](https://git-scm.com)
- **Ollama** - [Télécharger](https://ollama.ai)

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/Le-skal/TripHackathon.git
cd TripWise
```

### Étape 2 : Installer les dépendances

```bash
# Installer les dépendances du frontend
cd my-app
npm install
```

### Étape 3 : Configurer les variables d'environnement (optionnel)

Créer un fichier `.env` à la racine du projet :

```env
# Backend configuration
BACKEND_PORT=5000
OLLAMA_API_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=mistral
```

### Étape 4 : Configurer Firebase

1. Accédez à [Firebase Console](https://console.firebase.google.com)
2. Créez un projet ou utilisez `tripwise-af773`
3. Allez dans **Firestore Database**
4. **Remplacez les règles** par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Autoriser les utilisateurs authentifiés à créer et gérer leurs voyages
    match /trips/{tripId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Autoriser les utilisateurs authentifiés à gérer leurs profils
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Cliquez sur **Publish**

### Étape 5 : Installer et configurer Ollama

```bash
# Télécharger Ollama depuis https://ollama.ai
# Après installation, ouvrir un terminal et exécuter :

ollama pull mistral
ollama serve  # Démarre Ollama sur localhost:11434
```

---

## 🚀 Démarrage de l'application

### Option 1 : Démarrage manuel (recommandé pour le développement)

**Terminal 1 - Démarrer Ollama :**
```bash
ollama serve
```

**Terminal 2 - Démarrer le Backend Node.js :**
```bash
cd my-app/src
node server.js
```

**Terminal 3 - Démarrer le Frontend React :**
```bash
cd my-app
npm start
```

L'application s'ouvrira automatiquement sur `http://localhost:3000`

---

## 📁 Structure des fichiers

```
TripWise/
├── README.md                      # Documentation complète
├── package.json                   # Dépendances racine
│
├── my-app/                        # Application React
│   ├── package.json              # Dépendances Frontend
│   ├── package-lock.json
│   │
│   ├── public/                   # Fichiers statiques
│   │   ├── index.html           # Point d'entrée HTML
│   │   ├── manifest.json        # Manifest PWA
│   │   └── robots.txt           # SEO
│   │
│   └── src/                      # Code source
│       ├── index.js             # Point d'entrée React
│       ├── App.js               # Routeur principal
│       ├── firebase.js          # Configuration Firebase
│       ├── server.js            # Backend Express
│       ├── README.md            # Documentation src
│       │
│       ├── UserAuth/            # Authentification
│       │   ├── SignIn.jsx       # Page connexion
│       │   └── SignUp.jsx       # Page inscription
│       │
│       ├── DashOptions/         # Pages principales
│       │   ├── Dashboard.jsx    # Tableau de bord
│       │   ├── CreateTrip.jsx   # Création de voyage
│       │   ├── TripList.jsx     # Liste des voyages
│       │   └── Profile.jsx      # Profil utilisateur
│       │
│       ├── beauty/              # Fichiers CSS
│       │   ├── SignIn.css
│       │   ├── SignUp.css
│       │   ├── DashBoard.css
│       │   ├── CreateTrip.css
│       │   ├── TripList.css
│       │   └── Profile.css
│       │
│       └── server/
│           └── routes/
│               └── aiPlan.js    # Routes IA (futur)
```

---

## ✨ Fonctionnalités

### 1. **Authentification Utilisateur**
- Inscription avec email/mot de passe
- Connexion sécurisée via Firebase
- Gestion des sessions
- Logout sécurisé

**Fichiers** : `SignIn.jsx`, `SignUp.jsx`

### 2. **Création de Voyage**
- Formulaire complet avec champs :
  - Nom du voyage
  - Lieu de départ
  - Destination
  - Dates de début/fin
  - Budget estimé
  - Nombre de personnes
  - Description des préférences

**Fichiers** : `CreateTrip.jsx`, `CreateTrip.css`

### 3. **Génération IA d'Itinéraire**
- Appel à l'API Ollama avec prompt structuré
- Génération de plans jour par jour
- Suggestions d'activités, restaurants, hébergements

**Flux** :
```
Utilisateur clique "Générer un plan IA"
  ↓
POST /api/generate-plan (Backend:5000)
  ↓
Backend envoie prompt à Ollama:11434
  ↓
Ollama retourne le texte généré
  ↓
Frontend affiche le plan
```

### 4. **Tableau de Bord**
- Affichage des voyages futurs (< 1 an)
- Affichage des voyages passés
- Navigation rapide vers autres pages

**Fichiers** : `Dashboard.jsx`, `DashBoard.css`

### 5. **Gestion des Voyages**
- Voir tous les voyages utilisateur
- Supprimer des voyages (mode suppression multiple)
- Voir détails du voyage avec plan IA formaté
- Modifier voyage (futur)

**Fichiers** : `TripList.jsx`, `TripList.css`

### 6. **Profil Utilisateur**
- Afficher informations utilisateur
- Modifier les préférences
- Déconnexion

**Fichiers** : `Profile.jsx`, `Profile.css`

---

## 🔐 Configuration Firebase

### Structure Firestore

```
firestore/
├── trips/                    # Collection de voyages
│   ├── {tripId}
│   │   ├── name: string
│   │   ├── depart: string
│   │   ├── destination: string
│   │   ├── startDate: date
│   │   ├── endDate: date
│   │   ├── description: string
│   │   ├── budget: number
│   │   ├── peopleCount: number
│   │   ├── aiPlan: string (long texte)
│   │   ├── userId: string (identifiant utilisateur)
│   │   └── createdAt: timestamp
│   └── ...
│
└── users/                    # Collection d'utilisateurs (optionnel)
    ├── {userId}
    │   ├── email: string
    │   ├── name: string
    │   ├── avatar: string (URL)
    │   └── createdAt: timestamp
    └── ...
```

### Règles de sécurité - Explicitation

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // VOYAGES - Chaque utilisateur ne peut accéder qu'à ses propres voyages
    match /trips/{tripId} {
      // Création : userId doit correspondre à l'utilisateur authentifié
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      
      // Lecture et modification : userId doit correspondre
      allow read, write: if request.auth != null 
                         && resource.data.userId == request.auth.uid;
    }
    
    // UTILISATEURS - Chaque utilisateur peut gérer son propre profil
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

**Points clés :**
- **`allow create`** : Autorise la création si l'utilisateur est authentifié ET le userId du document correspond au uid Firebase
- **`allow read, write`** : Autorise la lecture et modification si l'userId correspond à l'utilisateur authentifié
- **Isolation des données** : Chaque utilisateur ne peut voir/modifier que ses propres voyages (security best practice)

---

## 🖥️ Serveur Backend

### Architecture du serveur

```javascript
// server.js (my-app/src/server.js)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());                    // Autoriser les requêtes du frontend
app.use(bodyParser.json());         // Parser les requêtes JSON

// Route de génération d'itinéraire IA
app.post('/api/generate-plan', async (req, res) => {
  // Récupérer les données du voyage
  const { tripName, depart, destination, startDate, endDate, 
          description, peopleCount, budget } = req.body;

  // Construire le prompt pour l'IA
  const prompt = `Tu es un expert en planification de voyages...`;

  try {
    // Appeler Ollama (LLM local)
    const response = await axios.post(
      'http://localhost:11434/api/generate', 
      {
        model: 'mistral',
        prompt,
        stream: false
      }
    );

    // Retourner le plan généré
    res.json({ plan: response.data.response });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur lors de la génération du plan' 
    });
  }
});

app.listen(5000, () => {
  console.log('✅ Serveur AI démarré sur http://localhost:5000');
});
```

### Endpoints disponibles

#### POST `/api/generate-plan`

**Requête :**
```json
{
  "tripName": "Vacances à Bali",
  "depart": "Paris",
  "destination": "Bali, Indonésie",
  "startDate": "2025-12-20",
  "endDate": "2025-12-25",
  "description": "Détente, plages, culture",
  "peopleCount": "2",
  "budget": "2000"
}
```

**Réponse :**
```json
{
  "plan": "Jour 1: Arrivée à l'aéroport de Bali...\nJour 2: Visite des temples...\n..."
}
```

---

## 🤔 Choix technologiques

### Pourquoi React ?
- ✅ **Composants réutilisables** : Pages réutilisables (SignIn, Dashboard, etc.)
- ✅ **Hot reload** : Modification du code = rechargement automatique
- ✅ **Écosystème mature** : Nombreuses bibliothèques disponibles
- ✅ **Communauté large** : Documentation et tutoriels abondants

### Pourquoi Firebase ?
- ✅ **Authentification simple** : Gestion des utilisateurs en quelques lignes
- ✅ **Base de données temps réel** : Firestore NoSQL
- ✅ **Serverless** : Pas de serveur à gérer (CRUD automatique)
- ✅ **Sécurité intégrée** : Règles de sécurité au niveau document
- ✅ **Gratuit** : Free tier généreux pour les projets petits/moyens

### Pourquoi Node.js + Express ?
- ✅ **Simplicité** : Backend léger pour l'orchestration IA
- ✅ **Synchrone avec le frontend** : JavaScript partout
- ✅ **Performance** : Non-bloquant, asynchrone
- ✅ **Écosystème npm** : Des milliers de packages disponibles

### Pourquoi Ollama (au lieu d'OpenAI) ?
- ✅ **Gratuit** : Pas de frais d'API
- ✅ **Local** : Données non envoyées à des serveurs externes
- ✅ **Modèles ouverts** : Mistral, Llama2, Gemma, etc.
- ✅ **Contrôle** : Configuration complète du modèle
- ❌ **Moins puissant** : Ollama < GPT-4, mais suffisant pour des itinéraires

### Alternative OpenAI (si budget disponible)

Remplacer dans `server.js` :
```javascript
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/generate-plan', async (req, res) => {
  const { tripName, depart, destination, ... } = req.body;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Tu es un expert en planification de voyages'
      },
      {
        role: 'user',
        content: `Génère un plan pour un voyage à ${destination}...`
      }
    ]
  });

  res.json({ plan: response.choices[0].message.content });
});
```

---

## 🚀 Déploiement

### Déployer sur Vercel (Frontend recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
cd my-app
vercel
```

**Configuration** :
- Framework : React
- Build Command : `npm run build`
- Output Directory : `build`

### Déployer sur Railway (Backend recommandé)

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Déployer
railway up
```

**Configuration** :
- Start Command : `node src/server.js`
- Node Version : 18+

---

## 🐛 Troubleshooting

### Erreur : "Missing or insufficient permissions" sur Firestore

**Cause** : Les règles de sécurité ne permettent pas l'accès

**Solution** :
1. Allez dans Firebase Console → Firestore Database → Rules
2. Remplacez par les règles fournies dans la section Configuration Firebase
3. Cliquez "Publish"
4. Vérifiez que vous êtes connecté (`auth.currentUser !== null`)

### Erreur : "Failed to fetch" ou "net::ERR_CONNECTION_REFUSED"

**Cause** : Le serveur backend n'est pas en cours d'exécution

**Solution** :
```bash
# Terminal 1
cd my-app/src
node server.js

# Vérifier que http://localhost:5000 est accessible
curl http://localhost:5000/
```

### Erreur : "Cannot connect to Ollama"

**Cause** : Ollama n'est pas en cours d'exécution

**Solution** :
```bash
# Terminal
ollama serve

# Ou si ollama n'existe pas
# Télécharger depuis https://ollama.ai
```

### Erreur : "net::ERR_BLOCKED_BY_CLIENT"

**Cause** : Adblock ou extension du navigateur bloque la requête

**Solution** :
- Désactiver les extensions (notamment les adblockers)
- Essayer en mode incognito

---

## 📚 Ressources utiles

- [Documentation React](https://react.dev)
- [Documentation React Router](https://reactrouter.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Express.js Guide](https://expressjs.com)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 👨‍💻 Auteur

**Projet** : TripHackathon (TripWise)  
**Repository** : [github.com/Le-skal/TripHackathon](https://github.com/Le-skal/TripHackathon)  
**Branch** : main

---

## 📝 Licence

Ce projet est libre d'utilisation à des fins éducatives et personnelles.

---

## 🎓 Notes pour les futurs développeurs

### Améliorations possibles :

1. **Base de données utilisateur** : Créer une collection `/users` dans Firestore
2. **Partage de voyages** : Permettre aux utilisateurs de partager leurs itinéraires
3. **Commentaires et notes** : Ajouter des notes sur chaque jour du voyage
4. **Budget détaillé** : Tracker les dépenses réelles vs budget
5. **Intégration Google Maps** : Afficher les trajets sur une carte
6. **Export PDF** : Générer des itinéraires en PDF
7. **Notifications** : Rappels pour les voyages à venir
8. **Tests unitaires** : Jest + React Testing Library
9. **Animations** : Framer Motion pour des transitions fluides
10. **Multi-langue** : i18n pour plusieurs langues

---

**Dernière mise à jour** : 29 octobre 2025  
**Version** : 1.0.0  
**Bon planning avec TripWise ! 🌍✈️**
