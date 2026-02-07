/**
 * Alerte par email lors d'une nouvelle capture de lead
 */
function onEdit(e) {
  const sheet = e.getSource().getActiveSheet();
  
  // On n'exécute le script que sur la feuille de données brutes
  if (sheet.getName() === "Raw Data") {
    const lastRow = sheet.getLastRow();
    
    // Récupération des données (A=1, B=2, C=3, D=4)
    const email = sheet.getRange(lastRow, 2).getValue();
    const pattern = sheet.getRange(lastRow, 3).getValue();
    const score = sheet.getRange(lastRow, 4).getValue();
    
    // Sécurité : on n'envoie l'email que si la colonne Email n'est pas vide
    if (email && email.toString().includes("@")) {
      const recipient = "votre-email@gmail.com"; // ⚠️ À MODIFIER
      const subject = "🎯 NOUVEAU LEAD : " + pattern;
      const body = `Un nouveau lead vient d'être capturé !
      
📧 Email : ${email}
🧠 Profil : ${pattern}
📊 Score Vitalité : ${score}/100
      
Accéder au dashboard : ${e.getSource().getUrl()}`;

      GmailApp.sendEmail(recipient, subject, body);
    }
  }
}