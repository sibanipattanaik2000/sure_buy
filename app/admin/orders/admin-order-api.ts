import { apiRequest } from "@/app/lib/api";

export type AdminOrderRefund = {
  id: string;
  amount: number;
  status: string;
  providerRefundId?: string | null;
  reason?: string | null;
  createdAt: string;
  processedAt?: string | null;
};

export type AdminOrderPayment = {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  providerPaymentId?: string | null;
  referenceNote?: string | null;
  recordedByUserId?: string | null;
  createdAt: string;
  refunds?: AdminOrderRefund[];
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;

  subtotal: number;
  deliveryAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;

  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  items: Array<{
    id: string;
    productName: string;
    brand: string;
    storage?: string | null;
    color?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    imageUrl?: string | null;
  }>;
  shiprocket: {
    orderId: string | null;
    shipmentId: string | null;
    awbCode: string | null;
    courierName: string | null;
    trackingUrl: string | null;
    status: string | null;
    statusCode: string | null;
    lastEventAt: string | null;
    pickupScheduledAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
  payments: AdminOrderPayment[];
  createdAt: string;
  updatedAt: string;
};

export type AdminOrdersResult = {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getAdminOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const query = new URLSearchParams();

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 20));

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  return apiRequest<AdminOrdersResult>(
    `/admin/orders?${query.toString()}`,
    {
      method: "GET",
    },
  );
}

export async function confirmAdminCashRefund(
  orderId: string,
  refundId: string,
) {
  return apiRequest<unknown>(
    `/admin/orders/${encodeURIComponent(orderId)}/cash-refunds/${encodeURIComponent(refundId)}/confirm`,
    {
      method: "POST",
      body: JSON.stringify({ confirmed: true }),
    },
  );
}

export async function reconcileAdminRazorpayRefund(
  orderId: string,
  refundId: string,
) {
  return apiRequest<{
    status: string;
    providerRefundId?: string | null;
    message?: string;
  }>(
    `/admin/orders/${encodeURIComponent(orderId)}/refunds/${encodeURIComponent(refundId)}/reconcile`,
    {
      method: "POST",
    },
  );
}

export async function retryAdminRazorpayRefund(
  orderId: string,
  refundId: string,
  idempotencyKey: string,
) {
  return apiRequest<unknown>(
    `/admin/orders/${encodeURIComponent(orderId)}/refunds/${encodeURIComponent(refundId)}/retry`,
    {
      method: "POST",
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    },
  );
}

export async function recordAdminCashCollection(
  orderId: string,
  payload: {
    amount: number;
    referenceNote?: string;
    idempotencyKey: string;
  },
) {
  return apiRequest<{
    alreadyRecorded: boolean;
    paymentId?: string;
    orderId: string;
    orderNumber: string;
    paidAmount: number;
    remainingAmount: number;
    paymentStatus: string;
  }>(
    `/admin/orders/${encodeURIComponent(orderId)}/cash-collection`,
    {
      method: "POST",
      headers: {
        "Idempotency-Key": payload.idempotencyKey,
      },
      body: JSON.stringify({
        amount: payload.amount,
        referenceNote: payload.referenceNote,
      }),
    },
  );
}
export async function createAdminShiprocketShipment(orderId: string) {
  return apiRequest<{
    success: boolean;
    shipmentId: string;
    shiprocketOrderId: string;
    status: string;
    codAmount: number;
  }>(`/admin/orders/${encodeURIComponent(orderId)}/shiprocket`, {
    method: "POST",
  });
}

export async function assignAdminShiprocketAwb(orderId: string) {
  return apiRequest<{
    alreadyAssigned: boolean;
    awbCode: string | null;
    courierName: string | null;
    shipmentId?: string;
  }>(`/admin/orders/${encodeURIComponent(orderId)}/shiprocket/awb`, {
    method: "POST",
  });
}

export async function scheduleAdminShiprocketPickup(orderId: string) {
  return apiRequest<{
    alreadyScheduled: boolean;
    pickupScheduledAt: string | null;
    status: string;
  }>(`/admin/orders/${encodeURIComponent(orderId)}/shiprocket/pickup`, {
    method: "POST",
  });
}

export async function generateAdminShiprocketManifest(orderId: string) {
  return apiRequest<{
    status?: number;
    manifest_url?: string;
    message?: string;
  }>(`/admin/orders/${encodeURIComponent(orderId)}/shiprocket/manifest`, {
    method: "POST",
  });
}