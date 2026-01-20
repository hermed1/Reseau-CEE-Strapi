'use strict';

/**
 * eco-cee-contact controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const mailer = require('../../../lib/mailer');

module.exports = createCoreController('api::eco-cee-contact.eco-cee-contact', ({ strapi }) => ({
  async create(ctx) {
    // 1. Sauvegarde en base (standard)
    const response = await super.create(ctx);
    
    // CORRECTION : On récupère l'entrée brute depuis la base pour avoir accès aux champs "private"
    const data = await strapi.entityService.findOne(
      'api::eco-cee-contact.eco-cee-contact',
      response.data.id
    );

    // Formatage de la date
    const dateReception = new Date(data.createdAt).toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 2. Construction du HTML (Style Vert Pro - Compact)
    const htmlContent = `
    <div style="background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header Vert (Bandeau simple) -->
        <div style="background-color: #2E7D32; height: 8px;"></div>

        <!-- Body -->
        <div style="padding: 25px;">
          <p style="color: #546E7A; font-size: 16px; margin-top: 0;">Bonjour Sébastien,</p>
          <p style="color: #37474F; line-height: 1.6;">Voici les coordonnées d'un nouveau contact :</p>

          <div style="margin-top: 25px; border: 1px solid #ECEFF1; border-radius: 6px;">
            
            <!-- Site d'origine -->
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">🌐</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Site d'origine</div>
                <div style="font-size: 14px; color: #2E7D32; font-weight: 600; margin-top: 1px;">
                  <a href="https://eco-cee.fr" style="color: #2E7D32; text-decoration: none;">eco-cee.fr</a>
                </div>
              </div>
            </div>

            <!-- Date de réception -->
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">📅</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Date de réception</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">
                  ${dateReception}
                </div>
              </div>
            </div>

            <!-- Raison Sociale -->
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">🏢</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Raison sociale</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">
                  ${data.raison_sociale || 'Non renseigné'}
                </div>
              </div>
            </div>

            <!-- SIRET (Ligne séparée) -->
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">🔢</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">SIRET</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">
                  ${data.SIRET || 'Non renseigné'}
                </div>
              </div>
            </div>

            <!-- Identité -->
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">👤</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Nom</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">
                  ${data.Sexe ? (data.Sexe === 'monsieur' ? 'M.' : 'Mme') : ''} ${data.Nom || 'Non renseigné'}
                </div>
              </div>
            </div>

            <!-- Téléphone -->
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">📞</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Téléphone</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">
                  <a href="tel:${data.telephone}" style="color: #263238; text-decoration: none;">${data.telephone || 'Non renseigné'}</a>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">✉️</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Email</div>
                <div style="font-size: 14px; color: #2E7D32; font-weight: 600; margin-top: 1px;">
                  <a href="mailto:${data.email}" style="color: #2E7D32; text-decoration: none;">${data.email}</a>
                </div>
              </div>
            </div>

            <!-- Horaires -->
             <div style="padding: 12px 15px; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">🕒</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Préférence horaire</div>
                <div style="font-size: 14px; color: #263238; font-top: 1px;">
                  ${data.HoraireDebut || '?'} - ${data.HoraireFin || '?'}
                </div>
              </div>
            </div>

          </div>

          <!-- Message Box -->
          <div style="margin-top: 25px;">
            <div style="font-size: 11px; font-weight: bold; color: #546E7A; margin-bottom: 6px; text-transform: uppercase;">Message</div>
            <div style="background-color: #F1F8E9; border-left: 4px solid #2E7D32; padding: 15px; border-radius: 4px; color: #33691E; font-style: italic; line-height: 1.5; font-size: 14px;">
              "${(data.message || 'Aucun message').replace(/\n/g, '<br>')}"
            </div>
          </div>

          <p style="margin-top: 30px; color: #37474F; font-size: 14px;">Bonne journée,</p>
        </div>
      </div>
    </div>
    `;

    // 3. Création du brouillon Gmail
    try {
      await mailer.createDraft({
        subject: "Transmission contact CEE",
        html: htmlContent
      });
      console.log(`[EcoCEE-Contact] Brouillon créé pour ${data.email}`);
    } catch (err) {
      console.error("[EcoCEE-Contact] Erreur création brouillon :", err);
    }

    return response;
  }
}));