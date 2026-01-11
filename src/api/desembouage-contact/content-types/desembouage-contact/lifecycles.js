const axios = require("axios");

module.exports = {
  async afterCreate(event) {
    console.log("[afterCreate] desembouage-contact triggered", event.result);

    const { result } = event;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const message = `
Nouveau formulaire reçu (desembouage-contact) :

- Nom copropriété : ${result.nom_copro || "Non renseigné"}
- Nom complet : ${result.nom_complet || "Non renseigné"}
- Téléphone : ${result.telephone || "Non renseigné"}
- Email : ${result.email || "Non renseigné"}
- Message : ${result.message || "Non renseigné"}
`;

    try {
      const response = await axios.post(discordWebhookUrl, {
        content: message,
      });
      console.log(
        "[afterCreate] Discord webhook envoyé (desembouage). Statut :",
        response.status
      );
    } catch (error) {
      console.error(
        "[afterCreate] Erreur lors de l'envoi à Discord (desembouage) :",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }
  },

  async afterUpdate(event) {
    console.log("[afterUpdate] desembouage-contact triggered", event.result);

    const { result } = event;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const message = `
Formulaire mis à jour (desembouage-contact) :

- Nom copropriété : ${result.nom_copro || "Non renseigné"}
- Nom complet : ${result.nom_complet || "Non renseigné"}
- Téléphone : ${result.telephone || "Non renseigné"}
- Email : ${result.email || "Non renseigné"}
- Message : ${result.message || "Non renseigné"}
`;

    try {
      const response = await axios.post(discordWebhookUrl, {
        content: message,
      });
      console.log(
        "[afterUpdate] Discord webhook envoyé (desembouage). Statut :",
        response.status
      );
    } catch (error) {
      console.error(
        "[afterUpdate] Erreur lors de l'envoi à Discord (desembouage) :",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }
  },
};
