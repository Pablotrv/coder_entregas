import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export class MockRepository {
  async bulkCreateUsers(users) {
    const createdUsers = await User.insertMany(users, { ordered: false });
    return createdUsers;
  }

  async bulkCreateOrders(orders) {
    const createdOrders = await Order.insertMany(orders, { ordered: false });
    return createdOrders;
  }
}
