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
    
    // CORRECTION : On récupère l'entrée brute depuis la base pour avoir accès aux champs "private"
    const data = await strapi.entityService.findOne(
      'api::eco-cee-hero.eco-cee-hero',
      response.data.id
    );

    // 2. Construction du HTML (Style Vert Pro)
    const htmlContent = `
    <div style="background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header Vert -->
        <div style="background-color: #2E7D32; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 0.5px;">Nouvelle demande (Hero)</h1>
          <p style="color: #E8F5E9; margin: 10px 0 0 0; font-size: 14px;">Source : Formulaire Rapide Eco-CEE</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px;">
          <p style="color: #546E7A; font-size: 16px; margin-top: 0;">Bonjour Sébastien,</p>
          <p style="color: #37474F; line-height: 1.6;">Une nouvelle demande rapide a été reçue. Voici les informations :</p>

          <div style="margin-top: 30px; border: 1px solid #ECEFF1; border-radius: 6px;">
            
            <!-- Raison Sociale -->
            <div style="padding: 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 30px; font-size: 18px;">🏢</div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Société</div>
                <div style="font-size: 15px; color: #263238; font-weight: 600; margin-top: 2px;">
                  ${data.raison_sociale || 'Non renseigné'}
                </div>
              </div>
            </div>

            <!-- Identité -->
            <div style="padding: 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 30px; font-size: 18px;">👤</div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Nom</div>
                <div style="font-size: 15px; color: #263238; font-weight: 600; margin-top: 2px;">
                  ${data.nom || 'Non renseigné'}
                </div>
              </div>
            </div>

            <!-- Téléphone -->
            <div style="padding: 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 30px; font-size: 18px;">📞</div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Téléphone</div>
                <div style="font-size: 15px; color: #263238; font-weight: 600; margin-top: 2px;">
                  <a href="tel:${data.telephone}" style="color: #263238; text-decoration: none;">${data.telephone || 'Non renseigné'}</a>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div style="padding: 15px; display: flex; align-items: center;">
              <div style="width: 30px; font-size: 18px;">✉️</div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Email</div>
                <div style="font-size: 15px; color: #2E7D32; font-weight: 600; margin-top: 2px;">
                  <a href="mailto:${data.email}" style="color: #2E7D32; text-decoration: none;">${data.email}</a>
                </div>
              </div>
            </div>

          </div>

          <!-- Message Box -->
          <div style="margin-top: 30px;">
            <div style="font-size: 12px; font-weight: bold; color: #546E7A; margin-bottom: 8px; text-transform: uppercase;">Message du prospect</div>
            <div style="background-color: #F1F8E9; border-left: 4px solid #2E7D32; padding: 20px; border-radius: 4px; color: #33691E; font-style: italic; line-height: 1.6;">
              "${(data.message || 'Aucun message').replace(/\n/g, '<br>')}"
            </div>
          </div>

          <p style="margin-top: 40px; color: #37474F; font-size: 14px;">Bonne réception,<br><strong style="color: #2E7D32;">Votre assistant Eco-CEE</strong></p>
        </div>

        <!-- Footer -->
        <div style="background-color: #FAFAFA; padding: 20px; text-align: center; border-top: 1px solid #EEEEEE;">
          <p style="margin: 0; font-size: 11px; color: #90A4AE;">© ${new Date().getFullYear()} Eco-CEE. Tous droits réservés.</p>
        </div>
      </div>
    </div>
    `;

    // 3. Création du brouillon Gmail
    try {
      await mailer.createDraft({
        subject: `Contact : ${data.raison_sociale || data.nom} (Eco-CEE)`,
        html: htmlContent
      });
      console.log(`[EcoCEE-Hero] Brouillon créé pour ${data.email}`);
    } catch (err) {
      console.error("[EcoCEE-Hero] Erreur création brouillon :", err);
    }

    return response;
  }
}));