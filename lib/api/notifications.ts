import apiClient, { ApiResponse } from '@/lib/apiClient';

// 通知資料介面
export interface Notification {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  type: 'system' | 'order' | 'event' | 'book';
  createdAt: string;
}

// 分頁資訊介面
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 通知列表回應介面
export interface NotificationsResponse {
  status: boolean;
  data: Notification[];
  pagination: Pagination;
}

// 獲取通知列表
export async function getNotificationsApi(): Promise<NotificationsResponse> {
  return apiClient.get('/api/notifications');
}

// 標記全部已讀
export async function markAllReadApi(): Promise<ApiResponse> {
  return apiClient.put('/api/notifications/markAllRead', { confirm: true });
}

// 標記單個通知為已讀
export async function markAsReadApi(notificationId: string): Promise<ApiResponse> {
  return apiClient.post(`/api/notifications/${notificationId}/mark-read`);
} 