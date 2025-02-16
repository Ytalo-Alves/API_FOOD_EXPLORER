const knex = require("../database/knex");

class OrderController {
  async create(request, response) {
    const { cart, orderStatus, paymentMethod } = request.body;
    const user_id = request.user.id;

    let totalPrice = 0

    for (const item of cart) {
      const dish = await knex('dishes').where({ id: item.id }).first();
      if(!dish){
        return response.json('Dish is not exist', 401)
      }
      totalPrice += dish.price * item.quantity;
    }

    const order_id = await knex('orders').insert({
      orderStatus,
      totalPrice,
      paymentMethod,
      user_id,
    });

    const itemsInsert = cart.map((cart) => {
      return {
        title: cart.title,
        quantity: cart.quantity,
        dish_id: cart.id,
        order_id,
      };
    });

    await knex(`ordersItems`).insert(itemsInsert);

    return response.json("Order created successfully", 201);
  }

  async index(request, response) {
    const user_id = request.user.id

    const user = await knex('users').where({id: user_id}).first();

    if(!user.isAdmin){
      const orders = await knex('ordersItems').where({user_id})
      .select([
        'orders.id',
        'orders.user_id',
        'orders.orderStatus',
        'orders.totalPrice',
        'orders.paymentMethod',
        'orders.created_at'
      ])
      .innerJoin('orders', 'orders.id', 'ordersItems.order_id')
      .groupBy('orders.id')

      const ordersItems = await knex('ordersItems')
      const ordersWithItems = orders.map(order => {
        const orderItem = ordersItems.filter(item => item.order_id === order.id)

        return {
          ...order,
          items: orderItem
        }
      })

      return response.json(ordersWithItems, 200)
    } else {
      const orders = await knex('ordersItems')
        .select([
          'orders.id',
          'orders.user_id',
          'orders.orderStatus',
          'orders.totalPrice',
          'orders.paymentMethod',
          'orders.created_at'
        ])

        .innerJoin('orders', 'orders.id', 'ordersItems.order_id')
        .groupBy('orders.id')

        const ordersItems = await knex('ordersItems')
        const ordersWithItems = orders.map(order => {
          const orderItem = ordersItems.filter(item => item.order_id === order.id)

          return {
            ...order,
            items: orderItem
          }
        })

        return response.json(ordersWithItems, 200)
    }
  }

  async update(request, response) {
    const { orderStatus } = request.body;
    const { id } = request.params; // Correto: Extraindo o ID diretamente como string

    // Verificando se o pedido existe
    const order = await knex("orders").where({ id }).first();
    if (!order) {
        return response.status(404).json({ error: "Order does not exist" });
    }

    // Atualizando o status do pedido
    await knex("orders").where({ id }).update({ orderStatus });

    return response.status(200).json({ message: "Order status updated successfully" });
}

}

module.exports = OrderController;