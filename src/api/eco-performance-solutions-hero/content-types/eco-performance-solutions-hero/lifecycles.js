const axios = require("axios");

module.exports = {
  async afterCreate(event) {
    console.log("[afterCreate] eco-performance-solutions-hero triggered", event.result);

    const { result } = event;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const message = `
Nouveau formulaire reçu (eco-performance-solutions-hero) :

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
        "[afterCreate] Discord webhook envoyé (eco-performance-solutions-hero). Statut :",
        response.status
      );
    } catch (error) {
      console.error(
        "[afterCreate] Erreur lors de l'envoi à Discord (eco-performance-solutions-hero) :",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }
  },

  async afterUpdate(event) {
    console.log("[afterUpdate] eco-performance-solutions-hero triggered", event.result);

    const { result } = event;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const message = `
Formulaire mis à jour (eco-performance-solutions-hero) :

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
        "[afterUpdate] Discord webhook envoyé (eco-performance-solutions-hero). Statut :",
        response.status
      );
    } catch (error) {
      console.error(
        "[afterUpdate] Erreur lors de l'envoi à Discord (eco-performance-solutions-hero) :",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }
  },
};
