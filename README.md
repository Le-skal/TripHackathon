# TripWise

TripWise est une application web conçue pour améliorer la planification de voyages grâce à une interface intuitive et des fonctionnalités intelligentes. Elle utilise React pour le front-end et intègre des services comme Firebase et l’IA via Ollama pour enrichir l’expérience utilisateur.

## Fonctionnalités principales

- Interface utilisateur moderne avec React
- Navigation fluide grâce à React Router
- Intégration de Firebase pour la gestion des données
- Communication avec des services externes via Axios
- Utilisation de l'IA via Ollama pour des recommandations de voyage personnalisées

## Technologies utilisées

- React
- React Router DOM
- Firebase
- Axios
- Cors
- Node.js
- Ollama (Mistral)

## Installation et Lancement

### Tout dans Git Bash

1. **Créer l'application React :**
   ```bash
   npx create-react-app my-app
   cd my-app
   cd src
   rm -rf *
   ```

2. **Récupérer les fichiers depuis le dépôt Git :**
   ```bash
   git pull
   ```

3. **Installer les dépendances :**
   ```bash
   npm install react-router-dom firebase
   ```

4. **Télécharger et installer Ollama pour Windows :**  
   [https://ollama.com/download/windows](https://ollama.com/download/windows)

5. **Fermer et rouvrir VS Code.**

6. **Lancer le modèle Mistral avec Ollama :**
   ```bash
   ollama run mistral
   ```

7. **Installer d'autres dépendances :**
   ```bash
   cd my-app
   cd src
   npm install cors
   npm install axios
   ```

8. **Démarrer l'application React :**
   ```bash
   npm start
   ```

9. Une fois la page ouverte dans le navigateur, **ne pas la fermer**. Dans Git Bash, arrêter le serveur avec :
   ```bash
   ctrl + c
   ```

10. **Lancer le serveur Node.js :**
    ```bash
    node server.js
    ```

---

Bon planning avec TripWise ! 🌍✈️
