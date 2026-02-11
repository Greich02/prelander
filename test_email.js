const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmailOptimized() {
  console.log('🚀 Testing optimized email...');

  try {
    const data = await resend.emails.send({
      from: 'contact@mind-body.fit', // ✅ Juste l'email, sans nom
      to: 'test-rgygw5o1d@srv1.mail-tester.com', // ← Nouvelle adresse Mail-Tester
      subject: 'Health Assessment Results', // ✅ Très neutre
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; color: #333; line-height: 1.6;">
          
          <p>Hello,</p>
          
          <p>Thank you for completing your health assessment.</p>
          
          <p>Based on your results, here are some foods that may support your wellness:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Dark Chocolate (70%+ cacao)</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Chlorophyll (Spirulina, Chlorella)</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Iodine-rich foods (Seaweed)</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Raw Cacao</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Cilantro</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Oregano Oil</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Apple Cider Vinegar</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Turmeric</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Beets</td>
            </tr>
          </table>
          
          <p>If you have questions, feel free to reply to this email.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>Health Team</p>
          
          <p style="font-size: 11px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            contact@mind-body.fit
          </p>
          
        </div>
      `,
      text: `
Hello,

Thank you for completing your health assessment.

Based on your results, here are some foods that may support your wellness:

- Dark Chocolate (70%+ cacao)
- Chlorophyll (Spirulina, Chlorella)
- Iodine-rich foods (Seaweed)
- Raw Cacao
- Cilantro
- Oregano Oil
- Apple Cider Vinegar
- Turmeric
- Beets

If you have questions, feel free to reply to this email.

Best regards,
Health Team

contact@mind-body.fit
      `.trim()
    });

    console.log('✅ Email sent!');
    console.log('Message ID:', data.id);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmailOptimized();