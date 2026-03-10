# HR DocGen 🚀
Application web de génération automatique de documents RH.

## Déploiement sur Vercel (3 étapes)

### Méthode 1 — Via GitHub (recommandée)
1. Créez un dépôt GitHub et poussez ce dossier :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE_USER/hr-docgen.git
   git push -u origin main
   ```
2. Sur [vercel.com](https://vercel.com) → **Add New Project** → importez le dépôt GitHub
3. Cliquez **Deploy** → votre URL est prête ✅

### Méthode 2 — Via CLI Vercel
```bash
npm install
npx vercel login
npx vercel --prod
```

## Lancer en local
```bash
npm install
npm start
# Ouvre http://localhost:3000
```
