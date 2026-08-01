import { faker } from "@faker-js/faker";
import { ORDER_PRIORITY, ORDER_STATUS, ROLES } from "../constants/index.js";

const generateUser = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement([ROLES.USER, ROLES.DELIVERY]),
  };
};

const generateOrder = (users, deliveryPersonnel, products) => {
  if (users.length === 0 || products.length === 0) {
    throw new Error("Cannot generate order without users and products.");
  }

  const randomUser = faker.helpers.arrayElement(users);
  const randomDelivery =
    deliveryPersonnel.length > 0
      ? faker.helpers.arrayElement(deliveryPersonnel)
      : null;
  const randomProducts = faker.helpers.arrayElements(
    products,
    faker.number.int({ min: 1, max: 5 }),
  );

  const total = randomProducts.reduce((acc, product) => acc + product.price, 0);

  return {
    user: randomUser._id,
    delivery: randomDelivery ? randomDelivery._id : undefined,
    products: randomProducts.map((p) => p._id),
    total: parseFloat(total.toFixed(2)),
    status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
    priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
  };
};

export const generateUsers = (count = 50) => {
  return Array.from({ length: count }, generateUser);
};

export const generateOrders = (
  count = 20,
  users,
  deliveryPersonnel,
  products,
) => {
  return Array.from({ length: count }, () =>
    generateOrder(users, deliveryPersonnel, products),
  );
};
