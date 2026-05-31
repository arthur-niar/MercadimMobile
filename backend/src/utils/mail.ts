import nodemailer from 'nodemailer';

// Helper to check if email credentials are configured
const isEmailConfigured = (): boolean => {
  return !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
};

// Create a transporter lazy-loader
let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    if (!isEmailConfigured()) {
      throw new Error(
        'Configurações de e-mail incompletas no arquivo .env. Verifique EMAIL_HOST, EMAIL_PORT, EMAIL_USER e EMAIL_PASS.'
      );
    }

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Sends a premium verification email for registration.
 */
export const sendRegisterVerificationEmail = async (
  email: string,
  name: string,
  code: string
): Promise<void> => {
  if (!isEmailConfigured()) {
    console.warn(`[SMTP AVISO] E-mail não configurado. Código de registro para ${email}: ${code}`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Mercadim" <no-reply@mercadim.com>',
    to: email,
    subject: 'Mercadim - Confirme seu e-mail',
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme seu e-mail - Mercadim</title>
  <style>
    body {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 40px 0;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #FF662A 0%, #FCA537 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      color: rgba(255, 255, 255, 0.85);
      margin: 10px 0 0 0;
      font-size: 15px;
    }
    .content {
      padding: 40px 35px;
      color: #374151;
    }
    .content h2 {
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      color: #111827;
    }
    .content p {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 25px;
    }
    .code-card {
      background-color: #f9fafb;
      border: 1.5px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 30px 0;
    }
    .code-display {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #FF662A;
      margin: 0;
      padding-left: 8px; /* offset the last letter-spacing */
    }
    .code-expiry {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 8px;
      margin-bottom: 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 25px 35px;
      text-align: center;
      border-top: 1px solid #f3f4f6;
    }
    .footer p {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>MERCADIM</h1>
        <p>Sistema Inteligente de Gestão de Estoque</p>
      </div>
      <div class="content">
        <h2>Olá, ${name}!</h2>
        <p>Obrigado por se cadastrar no Mercadim. Para concluir a criação de sua conta e começar a gerenciar seu estoque, confirme seu e-mail informando o código abaixo no aplicativo:</p>
        
        <div class="code-card">
          <h3 class="code-display">${code}</h3>
          <p class="code-expiry">Este código expira em 15 minutos.</p>
        </div>

        <p>Se você não solicitou este cadastro, por favor desconsidere este e-mail.</p>
      </div>
      <div class="footer">
        <p>© 2026 Mercadim. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
</body>
</html>
`,
  };

  const info = await getTransporter().sendMail(mailOptions);
  console.log(`[SMTP] E-mail de registro enviado para ${email}. ID: ${info.messageId}`);
};

/**
 * Sends a premium password reset verification email.
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  code: string
): Promise<void> => {
  if (!isEmailConfigured()) {
    console.warn(`[SMTP AVISO] E-mail não configurado. Código de reset de senha para ${email}: ${code}`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Mercadim" <no-reply@mercadim.com>',
    to: email,
    subject: 'Mercadim - Redefinição de Senha',
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de Senha - Mercadim</title>
  <style>
    body {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 40px 0;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #FF662A 0%, #FCA537 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      color: rgba(255, 255, 255, 0.85);
      margin: 10px 0 0 0;
      font-size: 15px;
    }
    .content {
      padding: 40px 35px;
      color: #374151;
    }
    .content h2 {
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      color: #111827;
    }
    .content p {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 25px;
    }
    .code-card {
      background-color: #f9fafb;
      border: 1.5px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 30px 0;
    }
    .code-display {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #FF662A;
      margin: 0;
      padding-left: 8px; /* offset the last letter-spacing */
    }
    .code-expiry {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 8px;
      margin-bottom: 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 25px 35px;
      text-align: center;
      border-top: 1px solid #f3f4f6;
    }
    .footer p {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>MERCADIM</h1>
        <p>Sistema Inteligente de Gestão de Estoque</p>
      </div>
      <div class="content">
        <h2>Olá, ${name}!</h2>
        <p>Recebemos uma solicitação para redefinir a senha de sua conta no Mercadim. Use o código abaixo para prosseguir com a alteração de sua senha:</p>
        
        <div class="code-card">
          <h3 class="code-display">${code}</h3>
          <p class="code-expiry">Este código expira em 15 minutos.</p>
        </div>

        <p>Se você não solicitou a redefinição de sua senha, por favor desconsidere este e-mail. Sua senha permanecerá segura.</p>
      </div>
      <div class="footer">
        <p>© 2026 Mercadim. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
</body>
</html>
`,
  };

  const info = await getTransporter().sendMail(mailOptions);
  console.log(`[SMTP] E-mail de redefinição de senha enviado para ${email}. ID: ${info.messageId}`);
};
