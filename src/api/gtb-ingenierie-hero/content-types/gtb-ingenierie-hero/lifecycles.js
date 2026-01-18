// /src/api/gtb-ingenierie-hero/content-types/gtb-ingenierie-hero/lifecycles.js

const axios = require("axios");

const formatValue = (value) => value || "Non renseigné";

const buildMessage = (result, context) => `
${context}

- Raison sociale : ${formatValue(result.raison_sociale)}
- Nom : ${formatValue(result.nom)}
- Téléphone : ${formatValue(result.telephone)}
- Email : ${formatValue(result.email)}
- Message : ${formatValue(result.message)}
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
    console.log("[afterCreate] gtb-ingenierie-hero triggered");

    const message = buildMessage(
      event.result,
      "🚀 Nouveau lead GTB Ingénierie (hero) :"
    );

    await sendToDiscord(message, "[afterCreate]");
  },

  async afterUpdate(event) {
    console.log("[afterUpdate] gtb-ingenierie-hero triggered");

    const message = buildMessage(
      event.result,
      "🔄 Lead mis à jour GTB Ingénierie (hero) :"
    );

    await sendToDiscord(message, "[afterUpdate]");
  },
};
