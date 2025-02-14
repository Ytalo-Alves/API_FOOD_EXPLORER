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
}

module.exports = DishesController;
