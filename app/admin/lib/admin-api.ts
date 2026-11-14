import { apiRequest } from "@/app/lib/api";

export type AnalyticsOverview = {
  periodDays: number;
  pageViews: number;
  uniqueVisitors: number;
  averageSessionPageSeconds: number;
  orders: number;
  newCustomers: number;
  successfulPaymentVolume: number;
  popularPages: Array<{
    path: string;
    views: number;
    totalSeconds: number;
    averageSeconds: number;
  }>;
};

export async function getAdminAnalytics(days = 7) {
  return apiRequest<AnalyticsOverview>(
    `/admin/analytics?days=${days}`,
  );
}

export async function getAdminPayments(search = "") {
  return apiRequest<any[]>(
    `/admin/payments?search=${encodeURIComponent(search)}`,
  );
}

export async function searchAdminRecords(q: string) {
  return apiRequest<{
    orders: any[];
    customers: any[];
  }>(`/admin/lookup?q=${encodeURIComponent(q)}`);
}

export async function updateOrderItemImei(
  orderId: string,
  itemId: string,
  imei: string,
) {
  return apiRequest(
    `/admin/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(itemId)}/imei`,
    {
      method: "PATCH",
      body: JSON.stringify({ imei }),
    },
  );
}