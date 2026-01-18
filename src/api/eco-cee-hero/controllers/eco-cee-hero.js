'use strict';

/**
 * eco-cee-hero controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const mailer = require('../../../lib/mailer');

module.exports = createCoreController('api::eco-cee-hero.eco-cee-hero', ({ strapi }) => ({
  async create(ctx) {
    // 1. Sauvegarde en base (standard)
    const response = await super.create(ctx);
    const data = response.data.attributes;

    // 2. Construction du HTML (version simplifiée sans SIRET/Civilité/Horaires)
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <p>Bonjour Sébastien,</p>
      <p>Vous trouverez ci-après les coordonnées d'un nouveau contact :</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-left: 5px solid #0056b3; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Raison sociale :</strong> ${data.raison_sociale || 'Non renseigné'}</p>
        <p style="margin: 5px 0;"><strong>Nom :</strong> ${data.nom || 'Non renseigné'}</p>
        <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${data.telephone || 'Non renseigné'}</p>
        <p style="margin: 5px 0;"><strong>E-mail :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p style="margin: 5px 0;"><strong>Message :</strong></p>
        <p style="background: #fff; padding: 10px; border: 1px solid #ddd;">${(data.message || '').replace(/\n/g, '<br>')}</p>
      </div>

      <p>Bonne journée.</p>
    </div>
    `;

    // 3. Création du brouillon Gmail
    try {
      await mailer.createDraft({
        subject: "Transmission contact CEE",
        html: htmlContent
      });
      console.log(`[EcoCEE-Hero] Brouillon créé pour ${data.email}`);
    } catch (err) {
      console.error("[EcoCEE-Hero] Erreur création brouillon :", err);
    }

    return response;
  }
}));