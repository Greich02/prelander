/**
 * Service pour envoyer des emails avec pièces jointes
 * et stocker les données des utilisateurs
 */

export async function sendEmailWithAttachment(email, userData = {}) {
  try {
    const payload = {
      email,
      userPattern: userData.userPattern || 'Unknown',
      vitalityScore: userData.vitalityScore || 0,
      userContext: userData.context || 'browsing'
    };

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur API:', result);
      return {
        success: false,
        message: result.message || 'Erreur lors de l\'envoi',
        error: result.error
      };
    }

    console.log('✅ Email envoyé avec succès:', result);
    return {
      success: true,
      message: 'Email envoyé avec succès!',
      data: result
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      message: 'Erreur réseau ou serveur',
      error: error.message
    };
  }
}

/**
 * Récupère la liste de tous les emails stockés
 * Utile pour le dashboard administrateur
 */
export async function getStoredEmails() {
  try {
    const response = await fetch('/api/get-emails');
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des emails');
    }
    
    const emails = await response.json();
    return {
      success: true,
      emails: emails
    };

  } catch (error) {
    console.error('❌ Erreur:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
