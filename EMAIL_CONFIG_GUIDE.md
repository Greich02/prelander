# 📧 Configuration du Système d'Email

## Vue d'ensemble

Le système d'email permet d'envoyer automatiquement un guide "9 Pineal Foods" avec pièce jointe à chaque utilisateur qui soumet son email via la popup de sortie.

Les données sont stockées dans `/data/emails.json` (accessible facilement pour vous).

## 🔧 Configuration

### 1. Variables d'environnement (.env.local)

Créez ou mettez à jour le fichier `.env.local` à la racine du projet:

```env
# Configuration Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app

# (Optionnel) Clé admin pour API sensibles
ADMIN_KEY=votre-clé-secrète-admin
```

### 2. Configuration Gmail (étapes essentielles)

#### Option A: Utiliser une application-specific password (RECOMMANDÉ)

1. Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
2. Activez l'authentification à 2 facteurs si ce n'est pas fait
3. Allez dans "App passwords"
4. Créez un mot de passe pour "Mail" et "Windows/Linux"
5. Copiez le mot de passe généré dans `EMAIL_PASSWORD` dans `.env.local`

#### Option B: Moins sécurisé (non recommandé)

Si vous n'avez pas l'authentification 2FA, vous pouvez autoriser les "less secure apps" 
- Allez sur [myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps)
- Autoriser l'accès

### 3. Configuration avec d'autres services email

Vous pouvez utiliser d'autres services:

```env
# SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.votre-clé-sendgrid

# Resend
EMAIL_HOST=smtp.resend.com
EMAIL_USER=resend
EMAIL_PASSWORD=votre-clé-resend

# Mailgun
EMAIL_HOST=smtp.mailgun.org
EMAIL_USER=postmaster@your-domain.com
EMAIL_PASSWORD=votre-clé-mailgun
```

## 📍 Où sont stockées les données?

Les emails des utilisateurs sont sauvegardés automatiquement dans:
```
/data/emails.json
```

Chaque entrée contient:
```json
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
```

## 📊 Accéder aux emails via API

### Récupérer tous les emails stockés

```bash
curl http://localhost:3000/api/get-emails
```

Réponse:
```json
{
  "totalEmails": 5,
  "emails": [...],
  "lastEmail": "2026-02-08T10:30:00.000Z",
  "exportedAt": "2026-02-08T11:00:00.000Z"
}
```

### Supprimer tous les emails (avec clé admin)

```bash
curl -X DELETE http://localhost:3000/api/get-emails \
  -H "x-admin-key: votre-clé-secrète-admin"
```

## 🚀 Test local

1. Installer les dépendances:
```bash
npm install nodemailer
```

2. Démarrer le serveur:
```bash
npm run dev
```

3. Faire un test:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "userPattern": "The Scientist",
    "vitalityScore": 85,
    "userContext": "completed"
  }'
```

## ⚙️ Personnaliser le contenu de l'email

Modifiez le fichier `/src/app/api/send-email/route.js`:

- **Subject**: Ligne 110
- **HTML Content**: Ligne 111-160
- **Attachments**: Ligne 161-180

## 📝 Contenu par défaut

L'email envoyé contient:
- ✅ Guide "9 Pineal Foods"
- ✅ Recommandations personnalisées basées sur le score
- ✅ Conseils pratiques
- ✅ Un fichier texte avec recettes et plan de repas

## 🔒 Sécurité

- **Fichier emails.json**: Accessible via API sécurisée
- **Variables d'environnement**: Ne jamais commit `.env.local`
- **Admin key**: Protège les opérations sensibles (DELETE)
- **Validation**: Vérification de l'email avant envoi

## ❌ Dépannage

### "Error: connect ECONNREFUSED"
→ Le serveur SMTP n'est pas accessible
→ Vérifiez EMAIL_HOST et EMAIL_PORT

### "Invalid login credentials"
→ Vérifiez EMAIL_USER et EMAIL_PASSWORD
→ Si Gmail: vérifiez la clé d'application

### "No 'Access-Control-Allow-Origin' header"
→ Normal en développement local - pas d'impact

## 📈 Prochaines étapes

- [ ] Configurer variables d'environnement
- [ ] Tester l'envoi (voir 🚀 Test local)
- [ ] Vérifier `/data/emails.json` après un envoi
- [ ] (Optionnel) Intégrer avec tableau de bord admin
- [ ] (Optionnel) Exporter emails vers CSV/Excel

---

**Questions?** Les logs dans la console vous aideront au dépannage! ✅
