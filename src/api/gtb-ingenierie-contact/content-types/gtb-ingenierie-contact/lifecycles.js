// /src/api/gtb-ingenierie-contact/content-types/gtb-ingenierie-contact/lifecycles.js

const axios = require("axios");

const formatValue = (value) => value || "Non renseigné";

const buildMessage = (result, context) => `
${context}

- Raison sociale : ${formatValue(result.raison_sociale)}
- SIRET : ${formatValue(result.SIRET)}
- Nom : ${formatValue(result.Nom)}
- Sexe : ${formatValue(result.Sexe)}
- Message : ${formatValue(result.message)}
- Horaire début : ${formatValue(result.HoraireDebut)}
- Horaire fin : ${formatValue(result.HoraireFin)}
- Téléphone : ${formatValue(result.telephone)}
- Email : ${formatValue(result.email)}
`;

const sendToDiscord = async (message, logPrefix) => {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  try {
    const response = await axios.post(discordWebhookUrl, {
      content: message,
    });
    console.log(`${logPrefix} Discord webhook envoyé. Statut :`, response.status);
  } catch (error) {
    console.error(`${logPrefix} Erreur Discord :`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }
};

module.exports = {
  async afterCreate(event) {
    console.log("[afterCreate] gtb-ingenierie-contact triggered");

    const message = buildMessage(
      event.result,
      "📬 Nouveau formulaire GTB Ingénierie (contact) :"
    );

    await sendToDiscord(message, "[afterCreate]");
  },

  async afterUpdate(event) {
    console.log("[afterUpdate] gtb-ingenierie-contact triggered");

    const message = buildMessage(
      event.result,
      "🔄 Formulaire mis à jour GTB Ingénierie (contact) :"
    );

    await sendToDiscord(message, "[afterUpdate]");
  },
};
