import { faker } from "@faker-js/faker";
import { ORDER_PRIORITY, ORDER_STATUS, ROLES } from "../domain.js";
import { AppError } from "../errors/AppError.js";
import { errorDictionary } from "../errors/errorDictionary.js";

const validateCount = (count, entity) => {
  if (!Number.isInteger(count) || count <= 0) {
    throw new AppError({
      ...errorDictionary.INVALID_INPUT,
      message: `El número de ${entity} debe ser un entero positivo.`,
      details: { count, entity },
    });
  }
};

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
  if (!Array.isArray(users) || !Array.isArray(products)) {
    throw new AppError({
      ...errorDictionary.INVALID_INPUT,
      message: "Los usuarios y productos deben ser arreglos válidos.",
      details: { users, products },
    });
  }

  if (users.length === 0 || products.length === 0) {
    throw new AppError({
      ...errorDictionary.MOCK_GENERATION_FAILED,
      message: "No hay suficientes usuarios o productos para generar pedidos.",
      details: {
        usersCount: users.length,
        productsCount: products.length,
      },
    });
  }

  const randomUser = faker.helpers.arrayElement(users);
  const randomDelivery =
    deliveryPersonnel && deliveryPersonnel.length > 0
      ? faker.helpers.arrayElement(deliveryPersonnel)
      : null;
  const randomProducts = faker.helpers.arrayElements(
    products,
    faker.number.int({ min: 1, max: Math.min(5, products.length) }),
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
  validateCount(count, "usuarios");
  return Array.from({ length: count }, generateUser);
};

export const generateOrders = (
  count = 20,
  users,
  deliveryPersonnel,
  products,
) => {
  validateCount(count, "pedidos");
  return Array.from({ length: count }, () =>
    generateOrder(users, deliveryPersonnel, products),
  );
};
