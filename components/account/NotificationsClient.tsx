'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getNotificationsApi, markAllReadApi, markAsReadApi, Notification } from '@/lib/api/notifications';

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  // 載入通知資料
  const loadNotifications = async () => {
    try {
      setLoading(true);
      console.log('🚀 [Notifications] 開始載入通知資料');
      const response = await getNotificationsApi();
      if (response.status && response.data) {
        setNotifications(response.data);
        const unreadCount = response.data.filter(n => !n.isRead).length;
        console.log('✅ [Notifications] 成功載入通知資料:', response.data.length, '條，未讀:', unreadCount);
      } else {
        console.log('❌ [Notifications] 載入通知資料失敗');
      }
    } catch (error) {
      console.error('💥 [Notifications] 載入通知失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 標記全部已讀
  const handleMarkAllRead = async () => {
    try {
      setMarkingAllRead(true);
      console.log('🚀 [Notifications] 開始標記全部已讀');
      const response = await markAllReadApi();
      if (response.status) {
        // 更新本地狀態
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        // 觸發通知數量更新事件
        window.dispatchEvent(new CustomEvent('notificationsChanged'));
        console.log('✅ [Notifications] 成功標記全部已讀');
      } else {
        console.log('❌ [Notifications] 標記全部已讀失敗');
      }
    } catch (error) {
      console.error('💥 [Notifications] 標記全部已讀失敗:', error);
    } finally {
      setMarkingAllRead(false);
    }
  };

  // 標記單個通知為已讀
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarkingRead(notificationId);
      console.log('🚀 [Notifications] 開始標記單個通知已讀:', notificationId);
      const response = await markAsReadApi(notificationId);
      if (response.status) {
        // 更新本地狀態
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        // 觸發通知數量更新事件
        window.dispatchEvent(new CustomEvent('notificationsChanged'));
        console.log('✅ [Notifications] 成功標記單個通知已讀');
      } else {
        console.log('❌ [Notifications] 標記單個通知已讀失敗');
      }
    } catch (error) {
      console.error('💥 [Notifications] 標記單個通知已讀失敗:', error);
    } finally {
      setMarkingRead(null);
    }
  };

  // 篩選通知
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'read') return notification.isRead;
    if (activeFilter === 'unread') return !notification.isRead;
    return true;
  });

  // 未讀通知數量
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 格式化時間
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '剛剛';
    if (diffInHours < 24) return `${diffInHours} 小時前`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)} 天前`;
    if (diffInHours < 24 * 30) return `${Math.floor(diffInHours / (24 * 7))} 週前`;
    if (diffInHours < 24 * 365) return `${Math.floor(diffInHours / (24 * 30))} 個月前`;
    return `${Math.floor(diffInHours / (24 * 365))} 年前`;
  };

  // 取得通知類型圖示
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'event':
        return '🎉';
      case 'system':
        return '🔧';
      default:
        return '📢';
    }
  };

  // 取得通知類型文字
  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'order':
        return '訂單通知';
      case 'event':
        return '促銷折扣';
      case 'system':
        return '系統訊息';
      default:
        return '新書到貨';
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5 px-4">
      {/* 標題區域 */}
      <h2 className="text-xl font-bold text-gray-800 mb-6 font-noto-sans-tc">我的通知</h2>

      {/* 篩選標籤和全部已讀按鈕 */}
      <div className="flex items-center justify-between mb-6">
        {/* 左側：篩選標籤 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#E8652B] text-white'
                : 'bg-white text-gray-600 hover:bg-[#FEF5EE] border border-gray-200'
            }`}
          >
            全部通知
          </button>
          <button
            onClick={() => setActiveFilter('read')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'read'
                ? 'bg-[#E8652B] text-white'
                : 'bg-white text-gray-600 hover:bg-[#FEF5EE] border border-gray-200'
            }`}
          >
            已讀通知
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
              activeFilter === 'unread'
                ? 'bg-[#E8652B] text-white'
                : 'bg-white text-gray-600 hover:bg-[#FEF5EE] border border-gray-200'
            }`}
          >
            未讀通知
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* 右側：全部標示為已讀按鈕 */}
        <div>
          {unreadCount > 0 && (
            <motion.button
              onClick={handleMarkAllRead}
              disabled={markingAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#E8652B] text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {markingAllRead ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  處理中...
                </>
              ) : (
                <>
                  ✓ 全部標示為已讀
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* 通知列表 */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-lg">
              {activeFilter === 'unread' ? '沒有未讀通知' : 
               activeFilter === 'read' ? '沒有已讀通知' : '暫無通知'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                notification.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                {/* 通知圖示 */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  notification.type === 'order' ? 'bg-blue-100' :
                  notification.type === 'event' ? 'bg-purple-100' :
                  notification.type === 'system' ? 'bg-green-100' : 'bg-green-100'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* 通知內容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notification.type === 'order' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'event' ? 'bg-purple-100 text-purple-800' :
                      notification.type === 'system' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {getNotificationTypeText(notification.type)}
                    </span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {notification.content}
                  </p>
                </div>

                {/* 時間和已讀按鈕 */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>🕐</span>
                      <span>{formatTime(notification.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* 單獨已讀按鈕 */}
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markingRead === notification.id}
                      className="px-3 py-1 text-xs bg-[#E8652B] text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {markingRead === notification.id ? '處理中...' : '標為已讀'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
