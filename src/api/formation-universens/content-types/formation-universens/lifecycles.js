const axios = require("axios");

const formatValue = (value) => value || "Non renseigné";

const buildMessage = (result, context) => `
${context}

- Nom : ${formatValue(result.nom)}
- Email : ${formatValue(result.email)}
- Téléphone : ${formatValue(result.telephone)}
- Message : ${formatValue(result.message)}
`;

const sendToDiscord = async (message, logPrefix) => {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  try {
    const response = await axios.post(discordWebhookUrl, {
      content: message,
    });
    console.log(
      `${logPrefix} Discord webhook envoyé (formation-universens). Statut :`,
      response.status
    );
  } catch (error) {
    console.error(`${logPrefix} Erreur Discord (formation-universens) :`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }
};

module.exports = {
  async afterCreate(event) {
    console.log("[afterCreate] formation-universens triggered");

    const message = buildMessage(
      event.result,
      "🆕 **NOUVELLE DEMANDE FORMATION UNIVERSENS**"
    );

    await sendToDiscord(message, "[afterCreate]");
  },

  async afterUpdate(event) {
    console.log("[afterUpdate] formation-universens triggered");

    const message = buildMessage(
      event.result,
      "✏️ **DEMANDE FORMATION UNIVERSENS MISE À JOUR**"
    );

    await sendToDiscord(message, "[afterUpdate]");
  },
};
