const axios = require("axios");

const formatValue = (value) => value || "Non renseigné";

const buildMessage = (result, context) => `
${context}

- Nom : ${formatValue(result.nom)}
- Email : ${formatValue(result.email)}
- Téléphone : ${formatValue(result.telephone)}
- Raison sociale : ${formatValue(result.raisonSociale)}
- Message : ${formatValue(result.message)}
- Source du formulaire : ${formatValue(result.sourceForm)}
- Accepte transmission données : ${formatValue(result.accepteTransmissionDonnees)}
`;

const sendToDiscord = async (message, logPrefix) => {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  try {
    const response = await axios.post(discordWebhookUrl, {
      content: message,
    });
    console.log(
      `${logPrefix} Discord webhook envoyé (universens-lead). Statut :`,
      response.status
    );
  } catch (error) {
    console.error(`${logPrefix} Erreur Discord (universens-lead) :`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }
};

module.exports = {
  async afterCreate(event) {
    console.log("[afterCreate] universens-lead triggered");

    const message = buildMessage(
      event.result,
      "🆕 **NOUVEAU LEAD UNIVERSENS REÇU**"
    );

    await sendToDiscord(message, "[afterCreate]");
  },

  async afterUpdate(event) {
    console.log("[afterUpdate] universens-lead triggered");

    const message = buildMessage(
      event.result,
      "✏️ **LEAD UNIVERSENS MIS À JOUR**"
    );

    await sendToDiscord(message, "[afterUpdate]");
  },
};
