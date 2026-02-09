import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const emailsFile = path.join(dataDir, 'emails.json');

    // Vérifier si le fichier existe
    if (!fs.existsSync(emailsFile)) {
      return NextResponse.json([]);
    }

    // Lire le fichier
    const fileContent = fs.readFileSync(emailsFile, 'utf-8');
    const emails = fileContent.trim() ? JSON.parse(fileContent) : [];

    // Ajouter quelques statistiques
    const stats = {
      totalEmails: emails.length,
      emails: emails,
      lastEmail: emails.length > 0 ? emails[emails.length - 1].submittedAt : null,
      exportedAt: new Date().toISOString()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('❌ Erreur lors de la lecture des emails:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint - Pour nettoyer les données
 * Utilisez avec prudence!
 */
export async function DELETE(request) {
  try {
    // Ajouter une vérification d'authentication si nécessaire
    const adminKey = request.headers.get('x-admin-key');
    
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 403 }
      );
    }

    const dataDir = path.join(process.cwd(), 'data');
    const emailsFile = path.join(dataDir, 'emails.json');

    if (fs.existsSync(emailsFile)) {
      fs.writeFileSync(emailsFile, '[]');
      return NextResponse.json({
        success: true,
        message: 'Tous les emails ont été supprimés'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Fichier non trouvé'
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
