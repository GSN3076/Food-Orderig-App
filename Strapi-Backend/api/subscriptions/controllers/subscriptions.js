const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.subscriptions.update({ id }, data, {
        files,
      });
    } else {
        entity = await strapi.services.subscriptions.update({ id }, ctx.request.body);
        await strapi.plugins['email'].services.email.send({
            to: "a.lnetam3076@gmail.com",
            subject:`You have a new subscriptions order`,
            text:`Subscription ID #${entity.id} . Please fulfill the subscriptions soon.`,
          });
    }
    return sanitizeEntity(entity, { model: strapi.models.subscriptions });
  },
};

