export function resetPasswordTemplate(username: string, resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting" />
  <title>Réinitialisation du mot de passe - Brandbox</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: #0f0e09; }
    img { border: 0; display: block; max-width: 100%; }
    a { color: inherit; }

    @media only screen and (max-width: 620px) {
      .wrapper   { padding: 20px 0 !important; }
      .card      { padding: 28px 20px !important; border-radius: 12px !important; }
      .logo      { width: 110px !important; }
      .title     { font-size: 18px !important; }
      .outer     { width: 100% !important; padding: 0 12px !important; }
      .sig-right { text-align: left !important; padding-top: 12px !important; }
      .social td { padding-right: 10px !important; }
      .cta-btn   { padding: 12px 24px !important; font-size: 13px !important; }
    }
  </style>
</head>
<body>
  <table class="wrapper" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#0f0e09;padding:40px 0;">
    <tr>
      <td align="center">
        <table class="outer" width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img
                class="logo"
                src="src="data:image/png;base64,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"
                alt="Brandbox"
                width="140"
              />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="card"
              style="background-color:#1a1900;border:1px solid #2a2800;border-radius:16px;padding:40px;">

              <h1 class="title"
                style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
                Réinitialisation du mot de passe
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#737373;font-family:'Segoe UI',Arial,sans-serif;line-height:1.6;">
                Bonjour <strong style="color:#ffffff;">${username}</strong>,
                une demande de réinitialisation de mot de passe a été effectuée pour votre compte.
                Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
              </p>

              <hr style="border:none;border-top:1px solid #2a2800;margin:0 0 28px;" />

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a
                      class="cta-btn"
                      href="${resetUrl}"
                      style="display:inline-block;background-color:#FBAE17;color:#000000;
                        font-weight:700;font-size:14px;text-decoration:none;
                        padding:14px 36px;border-radius:12px;
                        font-family:'Segoe UI',Arial,sans-serif;"
                    >
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <div style="background-color:#FBAE1710;border:1px solid #FBAE1730;
                border-radius:10px;padding:14px 18px;margin-bottom:28px;">
                <p style="margin:0;font-size:13px;color:#FBAE17;font-family:'Segoe UI',Arial,sans-serif;line-height:1.5;">
                  ⏱ Ce lien est valable pendant <strong>15 minutes</strong> et ne peut être utilisé qu'une seule fois.
                </p>
              </div>

              <hr style="border:none;border-top:1px solid #2a2800;margin:0 0 24px;" />

              <p style="margin:0;font-size:12px;color:#525252;text-align:center;
                font-family:'Segoe UI',Arial,sans-serif;line-height:1.6;">
                Si vous n&apos;avez pas demandé de réinitialisation, ignorez cet e-mail.<br/>
                Votre mot de passe actuel reste inchangé.
              </p>

            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding-top:36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #2a2800;padding-top:28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
                            Brandbox
                          </p>
                          <p style="margin:0 0 12px;font-size:12px;color:#525252;font-family:'Segoe UI',Arial,sans-serif;">
                            Creative Agency — Sousse, Tunisie
                          </p>
                          <table class="social" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-right:12px;">
                                <a href="https://www.facebook.com/profile.php?id=61572638457632"
                                  style="font-size:12px;color:#737373;text-decoration:none;font-family:'Segoe UI',Arial,sans-serif;">Facebook</a>
                              </td>
                              <td style="padding-right:12px;">
                                <a href="https://www.instagram.com/brandbox_agency/"
                                  style="font-size:12px;color:#737373;text-decoration:none;font-family:'Segoe UI',Arial,sans-serif;">Instagram</a>
                              </td>
                              <td style="padding-right:12px;">
                                <a href="https://www.behance.net/brandboxtunisia"
                                  style="font-size:12px;color:#737373;text-decoration:none;font-family:'Segoe UI',Arial,sans-serif;">Behance</a>
                              </td>
                              <td>
                                <a href="https://www.linkedin.com/company/brandbox-creative-agency/"
                                  style="font-size:12px;color:#737373;text-decoration:none;font-family:'Segoe UI',Arial,sans-serif;">LinkedIn</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="sig-right" align="right" valign="top">
                          <p style="margin:0;font-size:11px;color:#3a3800;font-family:'Segoe UI',Arial,sans-serif;line-height:1.6;">
                            © ${new Date().getFullYear()} Brandbox.<br/>Tous droits réservés.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}