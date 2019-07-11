const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');
const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    //Check if there is a current userId
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info,
    );
  },
  async users(parent, args, ctx, info) {
    // 1. check if the user is logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    // 2. Check if the user has permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // 3. If they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // 1. Make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error("You aren't logged in");
    }
    // 2. Query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info,
    );
    // 3. Check if they have the permissions to see this order
    console.log(order.user.id);
    console.log(ctx.request.userId);
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      'ADMIN',
    );

    if (!ownsOrder && !hasPermissionToSeeOrder) {
      throw new Error("You can't view this order!");
    }
    // 4. Return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    //1 Make sure user is logged in
    if (!ctx.request.userId) {
      throw new Error('You are not logged in');
    }
    //2 Query all the orders by user
    const orders = await ctx.db.query.orders(
      {
        where: { user: { id: args.userId } },
      },
      info,
    );

    //3 Check permissions that user can access
    const ownsOrder = ctx.request.userId === args.userId;
    const hasPermissionToSeeAllOrders = ctx.request.user.permissions.includes(
      'ADMIN',
    );

    if (!ownsOrder && !hasPermissionToSeeAllOrders) {
      throw new Error('You do not have access to view all orders');
    }

    //3 Return orders
    return orders;
  },
};

module.exports = Query;
