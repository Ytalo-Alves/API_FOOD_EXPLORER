const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body;

    // Check if the dish already exists
    const checkDishAlreadyExists = await knex("dishes").where({ title }).first();
    if (checkDishAlreadyExists) {
      throw new AppError("This dish already exists on the menu.");
    }

    // Insert the dish (without an image)
    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      category,
      price
    });

    // Ensure `ingredients` is always an array
    const parsedIngredients = typeof ingredients === "string"
      ? [ingredients]
      : Array.isArray(ingredients)
      ? ingredients
      : [];

    // Prepare ingredients for insertion
    const ingredientsInsert = parsedIngredients.map(name => ({
      name,
      dish_id
    }));

    // Insert ingredients into the database only if there are any
    if (ingredientsInsert.length > 0) {
      await knex("ingredients").insert(ingredientsInsert);
    }

    return response.status(201).json({ message: "Dish created successfully!" });
  }

  async delete(request, response) {
   const { id } = request.params

   await knex('dishes').where({id}).delete()

   return response.json("Dishe delete successfully", 200)

  }

  async show(request, response) {
    const {id} = request.params

    const dish = await knex('dishes').where({id}).first()
    const ingredients = await knex('ingredients').where({dish_id: id}).orderBy('name')

    return response.json({
      ...dish,
      ingredients
    })
  }

  async index(request, response) {
    const { title, ingredients } = request.query

    let dishes;

    if(ingredients) {
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())

      dishes = await knex('ingredients')
        .select([
          'dishes.id',
          'dishes.title',
          'dishes.description',
          'dishes.category',
          'dishes.price'
        ])
        .whereLike('dishes.title', `%${title}%`)
        .whereIn('name', filterIngredients)
        .innerJoin('dishes', 'dishes.id', 'ingredients.dish_id')
        .groupBy("dishes.id")
        .orderBy('dishes.title')
    } else {
      dishes = await knex('dishes')
       .whereLike('title', `%${title}%`)
       .orderBy('title')
    }

    const dishesIngredients = await knex('ingredients')
    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id)
      return {...dish, ingredients: dishIngredients }
    })

    return response.json(dishesWithIngredients)
  }
}

module.exports = DishesController;
