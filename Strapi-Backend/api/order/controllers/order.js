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
      entity = await strapi.services.order.update({ id }, data, {
        files,
      });
    } else {
        console.log("Hello")
        entity = await strapi.services.order.update({ id }, ctx.request.body);
        await strapi.plugins['email'].services.email.send({
            to: "a.lnetam3076@gmail.com",
            subject:`You have an Order`,
            text:`Order ID #${entity.id} . Please fulfill the order soon.`,
          });
    }
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};

