export const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  DELIVERY: "delivery",
});

export const ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

export const ORDER_PRIORITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
  DISCONTINUED: "discontinued",
});
