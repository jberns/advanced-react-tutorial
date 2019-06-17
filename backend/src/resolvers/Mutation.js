const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO: Check if they are logged in
    console.log(args);
    console.log(ctx.db);
    const item = await ctx.db.mutation.createItem(
      {
        data: { ...args },
      },
      info,
    );
    return item;
  },
};

module.exports = Mutations;
