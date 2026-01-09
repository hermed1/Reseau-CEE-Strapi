const axios = require("axios");

module.exports = {
  async afterCreate(event) {
    console.log("[afterCreate] praxis-energie-hero triggered", event.result);

    const { result } = event;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const message = `
Nouveau formulaire reçu (praxis-energie-hero) :

- Raison sociale : ${result.raison_sociale || "Non renseigné"}
- Nom : ${result.nom || "Non renseigné"}
- Téléphone : ${result.telephone || "Non renseigné"}
- Email : ${result.email || "Non renseigné"}
- Message : ${result.message || "Non renseigné"}
`;

    try {
      const response = await axios.post(discordWebhookUrl, {
        content: message,
      });
      console.log(
        "[afterCreate] Discord webhook envoyé (praxis-energie-hero). Statut :",
        response.status
      );
    } catch (error) {
      console.error(
        "[afterCreate] Erreur lors de l'envoi à Discord (praxis-energie-hero) :",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }
  },

  async afterUpdate(event) {
    console.log("[afterUpdate] praxis-energie-hero triggered", event.result);

    const { result } = event;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const message = `
Formulaire mis à jour (praxis-energie-hero) :

- Raison sociale : ${result.raison_sociale || "Non renseigné"}
- Nom : ${result.nom || "Non renseigné"}
- Téléphone : ${result.telephone || "Non renseigné"}
- Email : ${result.email || "Non renseigné"}
- Message : ${result.message || "Non renseigné"}
`;

    try {
      const response = await axios.post(discordWebhookUrl, {
        content: message,
      });
      console.log(
        "[afterUpdate] Discord webhook envoyé (praxis-energie-hero). Statut :",
        response.status
      );
    } catch (error) {
      console.error(
        "[afterUpdate] Erreur lors de l'envoi à Discord (praxis-energie-hero) :",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }
  },
};
