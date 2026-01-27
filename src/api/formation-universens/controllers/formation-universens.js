'use strict';

/**
 * formation-universens controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const mailer = require('../../../lib/mailer');

module.exports = createCoreController('api::formation-universens.formation-universens', ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    const data = await strapi.entityService.findOne(
      'api::formation-universens.formation-universens',
      response.data.id
    );

    const dateReception = new Date(data.createdAt).toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const htmlContent = `
    <div style="background-color: #f4f6f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #7B1FA2; height: 8px;"></div> <!-- Couleur Violet foncé pour Formation -->
        <div style="padding: 25px;">
          <p style="color: #546E7A; font-size: 16px; margin-top: 0;">Bonjour Nicolas,</p>
          <p style="color: #37474F; line-height: 1.6;">Une nouvelle demande de <strong>Formation</strong> a été reçue :</p>
          <div style="margin-top: 25px; border: 1px solid #ECEFF1; border-radius: 6px;">
            
            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">📅</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Date de réception</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">${dateReception}</div>
              </div>
            </div>

            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">👤</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Nom</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">${data.nom || 'Non renseigné'}</div>
              </div>
            </div>

            <div style="padding: 12px 15px; border-bottom: 1px solid #ECEFF1; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">📞</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Téléphone</div>
                <div style="font-size: 14px; color: #263238; font-weight: 600; margin-top: 1px;">
                  <a href="tel:${data.telephone}" style="color: #263238; text-decoration: none;">${data.telephone || 'Non renseigné'}</a>
                </div>
              </div>
            </div>

            <div style="padding: 12px 15px; display: flex; align-items: center;">
              <div style="width: 25px; font-size: 16px; margin-right: 15px;">✉️</div>
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #90A4AE; font-weight: bold; letter-spacing: 0.5px;">Email</div>
                <div style="font-size: 14px; color: #7B1FA2; font-weight: 600; margin-top: 1px;">
                  <a href="mailto:${data.email}" style="color: #7B1FA2; text-decoration: none;">${data.email}</a>
                </div>
              </div>
            </div>

          </div>

          <div style="margin-top: 25px;">
            <div style="font-size: 11px; font-weight: bold; color: #546E7A; margin-bottom: 6px; text-transform: uppercase;">Message</div>
            <div style="background-color: #F3E5F5; border-left: 4px solid #7B1FA2; padding: 15px; border-radius: 4px; color: #4A148C; font-style: italic; line-height: 1.5; font-size: 14px;">${(data.message || 'Aucun message').replace(/\n/g, '<br>')}</div>
          </div>
          <p style="margin-top: 30px; color: #37474F; font-size: 14px;">Bonne journée,</p>
        </div>
      </div>
    </div>`;

    try {
      await mailer.createDraft({ subject: `Demande Formation - ${data.nom}`, html: htmlContent });
    } catch (err) { console.error(err); }
    return response;
  }
}));
