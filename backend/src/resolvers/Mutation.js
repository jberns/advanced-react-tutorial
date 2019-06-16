const Mutations = {
  createDog(parent, args, ctx, inf) {
    global.dogs = global.dogs || [];
    const newDog = {name: args.name}
    global.dogs.push(newDog);
    return newDog;
    console.log(args);
  }
};

module.exports = Mutations;
