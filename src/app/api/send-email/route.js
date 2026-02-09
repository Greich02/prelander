import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Configuration Email
const EMAIL_CONFIG = {
  service: 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'test@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'test-password'
  }
};

console.log('📧 Email Config:', {
  host: EMAIL_CONFIG.host,
  user: EMAIL_CONFIG.auth.user,
  password: EMAIL_CONFIG.auth.pass ? '***hidden***' : 'NOT SET'
});

// Créer le transport nodemailer
let transporter;
try {
  transporter = nodemailer.createTransport(EMAIL_CONFIG);
} catch (err) {
  console.error('❌ Erreur création transporter:', err);
}

// Fonction pour sauvegarder l'email dans emails.json
function saveEmailToFile(email, userData) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const emailsFile = path.join(dataDir, 'emails.json');

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Lire ou initialiser le fichier
    let emails = [];
    if (fs.existsSync(emailsFile)) {
      const fileContent = fs.readFileSync(emailsFile, 'utf-8');
      if (fileContent.trim()) {
        try {
          emails = JSON.parse(fileContent);
        } catch (e) {
          console.warn('⚠️ JSON invalide dans emails.json, reset à []');
          emails = [];
        }
      }
    }

    // Ajouter la nouvelle entrée
    const newEntry = {
      id: Date.now(),
      email: email,
      userPattern: userData.userPattern,
      vitalityScore: userData.vitalityScore,
      context: userData.context,
      submittedAt: new Date().toISOString(),
      emailSent: userData.emailSent || false,
      source: 'exit_popup'
    };

    emails.push(newEntry);

    // Sauvegarder
    fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2));
    console.log(`✅ Email sauvegardé dans ${emailsFile}: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du fichier:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, userPattern, vitalityScore, userContext } = body;

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Email invalide' },
        { status: 400 }
      );
    }

    console.log(`📨 Traitement email: ${email}`);

    // ═════════════════════════════════════════════════════════
    // ÉTAPE 1: SAUVEGARDER IMMÉDIATEMENT (avant envoi)
    // ═════════════════════════════════════════════════════════
    const savedToFile = saveEmailToFile(email, {
      userPattern,
      vitalityScore,
      context: userContext,
      emailSent: false // On marque comme non envoyé pour l'instant
    });

    if (!savedToFile) {
      console.warn('⚠️ Impossible de sauvegarder le fichier');
    }

    // ═════════════════════════════════════════════════════════
    // ÉTAPE 2: ESSAYER D'ENVOYER L'EMAIL (optionnel)
    // ═════════════════════════════════════════════════════════
    let emailSent = false;
    let emailError = null;

    if (!transporter) {
      console.warn('⚠️ Transporter non initialisé, skip envoi email');
      emailError = 'Transporter not initialized';
    } else {
      try {
        // Configuration du mail
        const mailOptions = {
          from: process.env.EMAIL_USER || 'noreply@prelander.com',
          to: email,
          subject: '🎯 Your 9 Pineal Foods Guide is Ready!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">🧠 Welcome to Your Pineal Journey!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Your personalized guide is attached</p>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; color: #333;">Hello,</p>
                
                <p style="font-size: 15px; color: #555; line-height: 1.6;">
                  Thank you for taking the Pineal Health Assessment! Based on your results, we've prepared a personalized guide with <strong>9 foods that naturally decalcify your pineal gland</strong>.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <p style="margin: 0; font-size: 14px; color: #333;"><strong>Your Assessment Results:</strong></p>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li style="font-size: 14px; color: #555;">User Pattern: <strong>${userPattern}</strong></li>
                    <li style="font-size: 14px; color: #555;">Vitality Score: <strong>${vitalityScore}/100</strong></li>
                  </ul>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                  Questions? Reply to this email and we'll help you on your journey.
                </p>
                
                <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
                  To Your Health,<br>
                  <strong>The Pineal Health Team</strong>
                </p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: '9-Pineal-Foods-Guide.txt',
              content: `
🧠 9 FOODS THAT DECALCIFY YOUR PINEAL GLAND
Complete Guide for Optimal Brain Health

FOODS TO BOOST PINEAL FUNCTION:

1. DARK CHOCOLATE (70% cacao minimum)
   → Rich in antioxidants that protect the pineal gland
   → Dosage: 70g per day

2. CHLOROPHYLL (Spirulina, Chlorella)
   → Naturally purifies the body
   → Dosage: 1-2g per day

3. IODINE-RICH FOODS (Seaweed, Marine Algae)
   → Optimal support for pineal function
   → Dosage: 150mcg per day

Generated: ${new Date().toLocaleDateString()}
              `
            }
          ]
        };

        console.log('📧 Envoi de l\'email à:', email);
        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`✅ Email envoyé à: ${email}`);

        // Mettre à jour le fichier pour marquer comme envoyé
        const dataDir = path.join(process.cwd(), 'data');
        const emailsFile = path.join(dataDir, 'emails.json');
        if (fs.existsSync(emailsFile)) {
          const fileContent = fs.readFileSync(emailsFile, 'utf-8');
          let emails = JSON.parse(fileContent);
          // Marquer le dernier email comme envoyé
          if (emails.length > 0) {
            emails[emails.length - 1].emailSent = true;
            fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2));
          }
        }

      } catch (smtpError) {
        emailError = smtpError.message;
        console.warn(`⚠️ Erreur SMTP (email pas envoyé, mais données sauvegardées):`, smtpError.message);
        // NE PAS THROW - on continue même si email échoue
      }
    }

    // ═════════════════════════════════════════════════════════
    // ÉTAPE 3: RÉPONDRE AU CLIENT
    // ═════════════════════════════════════════════════════════
    return NextResponse.json({
      success: true, // true parce que les données ont été sauvegardées!
      message: emailSent 
        ? 'Email envoyé avec succès et données sauvegardées'
        : 'Données sauvegardées (email non envoyé - vérifiez .env.local)',
      emailSent: emailSent,
      fileSaved: savedToFile,
      emailError: emailError ? `⚠️ ${emailError}` : null
    });

  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors du traitement de la requête',
        error: error.message
      },
      { status: 500 }
    );
  }
}
