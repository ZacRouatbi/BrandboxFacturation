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
                src="https://i.postimg.cc/MKmJp7Sb/badge-02.png"
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