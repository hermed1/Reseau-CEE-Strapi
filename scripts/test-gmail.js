const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');

// 1. Chargement manuel du .env
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
      console.error("❌ Fichier .env introuvable à la racine !");
      process.exit(1);
    }
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Enlever les quotes
        process.env[key] = value;
      }
    });
    console.log("✅ Configuration .env chargée.");
  } catch (e) {
    console.error("❌ Erreur lecture .env", e);
  }
}

loadEnv();

// 2. Test de connexion
async function testGmail() {
  console.log("🔄 Tentative de connexion à Gmail API...");
  
  if (!process.env.CLIENT_ID || !process.env.REFRESH_TOKEN) {
    console.error("❌ Manque CLIENT_ID ou REFRESH_TOKEN dans le .env");
    return;
  }

  try {
    const auth = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    // On force le rafraîchissement du token pour voir s'il est valide
    const accessTokenResponse = await auth.getAccessToken();
    if (!accessTokenResponse.token) {
      throw new Error("Impossible d'obtenir un Access Token. Le Refresh Token est peut-être invalide.");
    }
    console.log("✅ Authentification réussie ! Access Token généré.");

    const gmail = google.gmail({ version: 'v1', auth });

    // 3. Création d'un brouillon de test
    const mail = new MailComposer({
      to: process.env.EMAIL_DESTINATAIRE || 'test@example.com',
      subject: "Test Diagnostic Strapi",
      text: "Ceci est un test pour vérifier la connexion Gmail API.",
      html: "<p>Ceci est un test pour vérifier la connexion Gmail API.</p>",
    });

    const message = await mail.compile().build();
    const rawMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const res = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: { message: { raw: rawMessage } }
    });

    console.log("✅ SUCCÈS TOTAL : Brouillon créé avec l'ID", res.data.id);
    console.log("👉 Allez vérifier vos brouillons Gmail.");

  } catch (error) {
    console.error("\n❌ ÉCHEC DU TEST :");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data.error === 'invalid_grant') {
        console.error("\n🚨 DIAGNOSTIC : 'invalid_grant'");
        console.error("Cela signifie que votre Refresh Token a expiré ou a été révoqué.");
        console.error("Causes possibles :");
        console.error("1. Votre app est en mode 'Testing' et le token a + de 7 jours.");
        console.error("2. Le mot de passe du compte Gmail a été changé.");
      }
    } else {
      console.error(error);
    }
  }
}

testGmail();
