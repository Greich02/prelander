# ✅ Email System - Quick Start Guide

## Ce qui a été créé ✨

Vous avez maintenant un système complet d'envoi d'emails avec:
- ✉️ **Envoi automatique** d'un guide avec pièce jointe
- 💾 **Stockage des données** dans `/data/emails.json`
- 📊 **Admin dashboard** pour gérer les emails
- 🔒 **API sécurisée** pour accéder aux données

## 🚀 Démarrage (5 minutes)

### 1. **Configuration initiale**

```bash
# Copier le fichier de configuration
cp .env.example .env.local

# Installer les dépendances
npm install
```

### 2. **Configurer Gmail** (ou autre service)

Modifiez `.env.local` avec:

```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-passe-app
```

**Pour Gmail:**
1. Allez → [Google Account Security](https://myaccount.google.com/security)
2. Activez "2-Step Verification" si ce n'est pas fait
3. Allez → "App passwords"
4. Créez un mot de passe pour "Mail" et "Windows"
5. Copiez le mot de passe généré dans `.env.local`

### 3. **Démarrer le serveur**

```bash
npm run dev
```

Serveur est prêt: `http://localhost:3000`

### 4. **Tester**

Attendez que le popup de sortie s'affiche et soumettez un email!

Les données seront sauvegardées dans: `/data/emails.json`

## 📊 Accéder au Dashboard Admin

Visitez: **http://localhost:3000/admin**

Vous pouvez:
- 📋 Voir tous les emails collectés
- 📥 Exporter en CSV
- 🗑️ Supprimer les emails (avec clé admin)

## 🔧 Fichiers créés/modifiés

```
✨ NOUVEAU:
├── src/app/api/send-email/route.js       ← Logique d'envoi d'email
├── src/app/api/get-emails/route.js       ← API pour récupérer les emails
├── src/app/admin/page.js                 ← Dashboard admin
├── src/app/utils/sendEmail.js            ← Fonction utilitaire
├── data/emails.json                      ← Stockage des données
├── .env.example                          ← Template de configuration
└── EMAIL_CONFIG_GUIDE.md                 ← Guide complet

✏️ MODIFIÉ:
├── src/app/components/ExitPopup.js       ← Intégration du nouveau système
└── package.json                          ← Ajout de nodemailer
```

## 📧 Contenu de l'email

Chaque email contient:
- ✅ Titre personnalisé avec l'heure limite
- ✅ Résumé des bénéfices
- ✅ Guide "9 Pineal Foods"
- ✅ Recommandations basées sur le score
- ✅ Plan de repas hebdomadaire
- ✅ Fichier texte détaillé en pièce jointe

## 💾 Format des données (emails.json)

```json
[
  {
    "id": 1707385200000,
    "email": "user@example.com",
    "userPattern": "The Seeker",
    "vitalityScore": 78,
    "context": "completed",
    "submittedAt": "2026-02-08T10:30:00.000Z",
    "emailSent": true,
    "source": "exit_popup"
  }
]
```

## 🔐 Sécurité

- **Variables d'environnement** → Ne jamais committer `.env.local`
- **Admin key** → Protège les actions sensibles
- **Validation** → Tous les emails sont vérifiés
- **Rate limiting** → À implémenter selon vos besoins

## 🤔 Questions Fréquentes

### "Les emails ne s'envoient pas"
1. Vérifiez `.env.local` exist
2. Vérifiez EMAIL_USER et EMAIL_PASSWORD
3. Vérifiez les logs du serveur (npm run dev)
4. Essayez un test curl:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","userPattern":"Test","vitalityScore":50,"userContext":"testing"}'
```

### "Impossible de trouver `/data/emails.json`"
→ Le fichier est créé automatiquement à la première soumission

### "Les données ne se sauvegardent pas"
→ Vérifiez que vous avez les droits d'accès au dossier `/data`

## 🎯 Prochaines étapes

- [ ] Configurer `.env.local`
- [ ] Installer dépendances: `npm install`
- [ ] Tester l'envoi d'email
- [ ] Vérifier le dashboard admin
- [ ] Exporter les emails en CSV
- [ ] (Optionnel) Ajouter rate limiting
- [ ] (Optionnel) Intégrer avec CRM/Email list

## 📞 Support

Pour plus de détails, consultez:
- [Email Config Guide](./EMAIL_CONFIG_GUIDE.md) - Configuration complète
- [Package.json](./package.json) - Dépendances
- API Routes:
  - POST `/api/send-email` - Envoyer un email
  - GET `/api/get-emails` - Récupérer les emails
  - DELETE `/api/get-emails` - Supprimer (admin only)

---

**Vous êtes prêt!** 🚀 Lancez `npm run dev` et testez!
