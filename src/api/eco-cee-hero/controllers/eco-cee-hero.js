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

    // 2. Construction du HTML (Style Vert Pro & Sobre)
    const htmlContent = `
    <div style="background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header Vert (Bandeau simple) -->
        <div style="background-color: #2E7D32; height: 10px;"></div>

        <!-- Body -->
        <div style="padding: 40px;">
          <p style="color: #546E7A; font-size: 16px; margin-top: 0;">Bonjour Sébastien,</p>
          <p style="color: #37474F; line-height: 1.6;">Voici les coordonnées d'un nouveau contact :</p>

          <div style="margin-top: 30px; border: 1px solid #ECEFF1; border-radius: 6px;">
            
            <!-- Site d'origine -->
            <div style="padding: 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 30px; font-size: 18px;">🌐</div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Site d'origine</div>
                <div style="font-size: 15px; color: #2E7D32; font-weight: 600; margin-top: 2px;">
                  <a href="https://eco-cee.fr" style="color: #2E7D32; text-decoration: none;">eco-cee.fr</a>
                </div>
              </div>
            </div>

            <!-- Raison Sociale -->
            <div style="padding: 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 30px; font-size: 18px;">🏢</div>
              <div>
                <div style="font-size: 11px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Raison sociale</div>
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
            <div style="font-size: 12px; font-weight: bold; color: #546E7A; margin-bottom: 8px; text-transform: uppercase;">Message</div>
            <div style="background-color: #F1F8E9; border-left: 4px solid #2E7D32; padding: 20px; border-radius: 4px; color: #33691E; font-style: italic; line-height: 1.6;">
              "${(data.message || 'Aucun message').replace(/\n/g, '<br>')}"
            </div>
          </div>

          <p style="margin-top: 40px; color: #37474F; font-size: 14px;">Bonne journée.</p>
        </div>
      </div>
    </div>
    `;

    // 3. Création du brouillon Gmail
    try {
      await mailer.createDraft({
        subject: `Transmission contact CEE - ${data.raison_sociale || data.nom}`,
        html: htmlContent
      });
      console.log(`[EcoCEE-Hero] Brouillon créé pour ${data.email}`);
    } catch (err) {
      console.error("[EcoCEE-Hero] Erreur création brouillon :", err);
    }

    return response;
  }
}));
