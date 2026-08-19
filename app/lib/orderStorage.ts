import {
  CheckoutData,
  CheckoutProduct,
  DeliveryAddress,
} from "../context/CheckoutContext";

export type Order = {
  orderId: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;

  product: {
    id: string;
    name: string;
    brand: string;
    image: string;
    storage?: string;
    color?: string;
    condition?: string;
    price: number;
    quantity?: number;
  };

  quantity: number;
  subtotal: number;
  deliveryFee: number;
  total: number;

  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  expectedDelivery?: string;
};

type OrdersPageOrder = {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  image: string;
  storage: string;
  color: string;
  price: number;
  paymentMethod: string;
  orderDate: string;
  deliveryDate: string;
  status:
    | "Processing"
    | "Confirmed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
};

type OrderSuccessData = {
  orderId: string;
  productName: string;
  productImage: string;
  brand: string;
  storage: string;
  color: string;
  price: number;
  paymentMethod: string;
  deliveryDate: string;
};

const ORDER_STORAGE_KEY = "PhoneBhai-order";
const ORDERS_STORAGE_KEY = "PhoneBhai-orders";
const SUCCESS_STORAGE_KEY = "PhoneBhai-order";

/*
 * Generate unique order ID
 */
export function generateOrderId(): string {
  const random = Math.floor(
    10000000 + Math.random() * 90000000
  );

  return `SB-${random}`;
}

/*
 * Convert checkout product into order product
 */
function createOrderProduct(
  product: CheckoutProduct,
  storage: string,
  color: string
) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image: product.image,
    storage,
    color,
    condition: product.condition,
    price: product.price,
    quantity: 1,
  };
}

/*
 * Convert checkout address into order address
 */
function createOrderAddress(
  address: DeliveryAddress
) {
  const completeAddress = address.area
    ? `${address.address}, ${address.area}`
    : address.address;

  return {
    name: address.fullName,
    phone: address.phone,
    address: completeAddress,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };
}

/*
 * Create order from checkout
 */
export function createOrder(
  checkout: CheckoutData
): Order | null {
  if (!checkout.product || !checkout.address) {
    return null;
  }

  const product = checkout.product;

  const orderId = generateOrderId();

  const subtotal = product.price;
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  return {
    orderId,

    createdAt: new Date().toISOString(),

    status: "Confirmed",

    paymentMethod: checkout.paymentMethod,

    paymentStatus: "Confirmed",

    product: createOrderProduct(
      product,
      checkout.selectedStorage || product.storage,
      checkout.selectedColor || product.color
    ),

    quantity: 1,

    subtotal,

    deliveryFee,

    total,

    address: createOrderAddress(checkout.address),

    expectedDelivery: "3–5 business days",
  };
}

/*
 * Convert main Order structure
 * into the structure expected by /orders
 */
function createOrdersPageOrder(
  order: Order
): OrdersPageOrder {
  return {
    id: order.orderId,

    productId: order.product.id,

    productName: order.product.name,

    brand: order.product.brand,

    image: order.product.image,

    storage: order.product.storage || "",

    color: order.product.color || "",

    price: order.total,

    paymentMethod: order.paymentMethod,

    orderDate: new Date(
      order.createdAt
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    deliveryDate:
      order.expectedDelivery || "3–5 business days",

    status: "Confirmed",
  };
}

/*
 * Save order
 */
export function saveOrder(order: Order): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    /*
     * Main order.
     *
     * Used by:
     * /orders/[orderId]
     * /track-order/[orderId]
     */
    localStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify(order)
    );

    /*
     * Orders listing.
     *
     * Used by:
     * /orders
     */
    const existingOrdersRaw =
      localStorage.getItem(ORDERS_STORAGE_KEY);

    let existingOrders: OrdersPageOrder[] = [];

    if (existingOrdersRaw) {
      try {
        existingOrders =
          JSON.parse(existingOrdersRaw);
      } catch {
        existingOrders = [];
      }
    }

    const ordersPageOrder =
      createOrdersPageOrder(order);

    /*
     * Prevent duplicate order
     */
    const alreadyExists = existingOrders.some(
      (existingOrder) =>
        existingOrder.id === order.orderId
    );

    if (!alreadyExists) {
      existingOrders.unshift(ordersPageOrder);
    }

    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(existingOrders)
    );

    /*
     * Order success page
     */
    const successOrder: OrderSuccessData = {
      orderId: order.orderId,

      productName: order.product.name,

      productImage: order.product.image,

      brand: order.product.brand,

      storage: order.product.storage || "",

      color: order.product.color || "",

      price: order.product.price,

      paymentMethod: order.paymentMethod,

      deliveryDate:
        order.expectedDelivery ||
        "3–5 business days",
    };

    sessionStorage.setItem(
      SUCCESS_STORAGE_KEY,
      JSON.stringify(successOrder)
    );
  } catch (error) {
    console.error(
      "Failed to save order:",
      error
    );
  }
}

/*
 * Create and save order
 */
export function createAndSaveOrder(
  checkout: CheckoutData
): Order | null {
  const order = createOrder(checkout);

  if (!order) {
    return null;
  }

  saveOrder(order);

  return order;
}

/*
 * Get currently stored order
 */
export function getStoredOrder(): Order | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedOrder =
      localStorage.getItem(ORDER_STORAGE_KEY);

    if (!savedOrder) {
      return null;
    }

    return JSON.parse(savedOrder) as Order;
  } catch (error) {
    console.error(
      "Failed to read stored order:",
      error
    );

    return null;
  }
}

/*
 * Get order by ID
 */
export function getOrderById(
  orderId: string
): Order | null {
  const order = getStoredOrder();

  if (!order) {
    return null;
  }

  return order.orderId === orderId
    ? order
    : null;
}

/*
 * Clear current stored order
 */
export function clearStoredOrder(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    ORDER_STORAGE_KEY
  );

  localStorage.removeItem(
    ORDERS_STORAGE_KEY
  );

  sessionStorage.removeItem(
    SUCCESS_STORAGE_KEY
  );
}