import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, vitalityScore, userPattern } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Lire le PDF depuis le dossier public
    const pdfPath = path.join(process.cwd(), 'public', '9-Pineal-Foods-Guide.pdf');
    let pdfBuffer = null;
    
    try {
      pdfBuffer = fs.readFileSync(pdfPath);
      console.log('✅ PDF loaded successfully:', pdfBuffer.length, 'bytes');
    } catch (pdfError) {
      console.error('⚠️ PDF not found, will send email without attachment:', pdfError.message);
    }

    // Préparer les attachments
    const attachments = pdfBuffer ? [{
      filename: '9-Pineal-Foods-Guide.pdf',
      content: pdfBuffer,
    }] : [];

    // Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: 'Mind-Body Wellness <contact@mind-body.fit>',
      to: [email],
      subject: `Your Personalized Wellness Guide - Score: ${vitalityScore || 'N/A'}/100`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Wellness Guide</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: Arial, Helvetica, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f7f7f7;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                
                <!-- Main Container -->
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.3;">
                        Your Wellness Assessment Results
                      </h1>
                      <p style="margin: 12px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                        ${userPattern || 'Wellness Seeker'}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Score Badge -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <div style="margin-top: -25px; text-align: center;">
                        <div style="display: inline-block; background-color: #ffffff; border-radius: 50px; padding: 12px 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                          <span style="color: #4a5568; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Vitality Score</span>
                          <span style="margin: 0 8px; color: #F59E0B; font-size: 24px; font-weight: 700;">${vitalityScore || 'N/A'}</span>
                          <span style="color: #9ca3af; font-size: 16px;">/100</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 40px 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                      <p style="margin: 0 0 20px;">Hello,</p>
                      
                      <p style="margin: 0 0 20px;">
                        Thank you for completing your wellness assessment. Based on your results, we have prepared a personalized guide to support your vitality journey.
                      </p>
                      
                      <p style="margin: 0 0 24px; padding: 20px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px; color: #78350F; font-size: 15px;">
                        <strong style="color: #78350F;">📎 Attached:</strong> Your complete "9 Foods Guide" with detailed protocols, meal plans, and shopping lists customized for your wellness pattern.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Quick Preview -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 20px; font-weight: 700;">
                        What's Inside Your Guide:
                      </h2>
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #7C3AED; font-weight: 600;">✓</span>
                            <span style="margin-left: 12px; color: #4a5568;">The 9 scientifically-backed foods for vitality</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #7C3AED; font-weight: 600;">✓</span>
                            <span style="margin-left: 12px; color: #4a5568;">Exact daily dosages and consumption methods</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #7C3AED; font-weight: 600;">✓</span>
                            <span style="margin-left: 12px; color: #4a5568;">7-day meal plan with shopping list</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #7C3AED; font-weight: 600;">✓</span>
                            <span style="margin-left: 12px; color: #4a5568;">90-day wellness timeline and expectations</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0;">
                            <span style="color: #7C3AED; font-weight: 600;">✓</span>
                            <span style="margin-left: 12px; color: #4a5568;">Foods to avoid and why</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Next Step -->
                  <tr>
                    <td style="padding: 0 40px 40px;">
                      <div style="background: linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%); border-radius: 8px; padding: 24px; text-align: center;">
                        <h3 style="margin: 0 0 12px; color: #1e40af; font-size: 18px; font-weight: 700;">
                          🚀 Ready to Start?
                        </h3>
                        <p style="margin: 0 0 16px; color: #1e3a8a; font-size: 15px; line-height: 1.5;">
                          Open the attached guide and begin with Foods #2 (Chlorophyll) and #5 (Cilantro) this week for fastest results.
                        </p>
                        <p style="margin: 0; color: #4338ca; font-size: 14px; font-style: italic;">
                          Most people notice energy shifts within 7-14 days.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 16px; color: #4a5568; font-size: 15px;">
                        Questions? Simply reply to this email - we read every message.
                      </p>
                      <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                        To your vitality,<br>
                        <span style="color: #7C3AED;">The Mind-Body Team</span>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Legal Footer -->
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f3f4f6; text-align: center;">
                      <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                        Mind-Body Wellness | contact@mind-body.fit
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 11px; line-height: 1.4;">
                        This guide is for educational purposes only and does not constitute medical advice.<br>
                        Consult with a healthcare provider before making dietary changes.
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `YOUR WELLNESS ASSESSMENT RESULTS

Hello,

Thank you for completing your wellness assessment.

VITALITY SCORE: ${vitalityScore || 'N/A'}/100
PATTERN: ${userPattern || 'Wellness Seeker'}

ATTACHED: Your personalized "9 Foods Guide" (PDF)

What's Inside:
- The 9 scientifically-backed foods for vitality
- Exact daily dosages and consumption methods  
- 7-day meal plan with shopping list
- 90-day wellness timeline
- Foods to avoid and why

NEXT STEP: Open the attached guide and begin with Foods #2 (Chlorophyll) and #5 (Cilantro) this week for fastest results.

Most people notice energy shifts within 7-14 days.

Questions? Simply reply to this email.

To your vitality,
The Mind-Body Team

---
Mind-Body Wellness | contact@mind-body.fit
This guide is for educational purposes only and does not constitute medical advice.`,
      attachments: attachments
    });

    console.log('✅ Email sent successfully:', data);

    // Sauvegarder dans le fichier JSON local (optionnel)
    const emailData = {
      email,
      vitalityScore,
      userPattern,
      timestamp: new Date().toISOString(),
      emailId: data.id
    };

    const emailsFilePath = path.join(process.cwd(), 'emails.json');
    let emailsArray = [];
    
    if (fs.existsSync(emailsFilePath)) {
      const fileContent = fs.readFileSync(emailsFilePath, 'utf-8');
      emailsArray = JSON.parse(fileContent);
    }
    
    emailsArray.push(emailData);
    fs.writeFileSync(emailsFilePath, JSON.stringify(emailsArray, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: data.id,
      attachmentSent: !!pdfBuffer
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}