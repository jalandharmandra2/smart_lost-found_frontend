import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Sparkles,
  Inbox,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotification();
  const [filterUnread, setFilterUnread] = useState(false);

  const displayedNotifications = filterUnread
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  const getIcon = (type) => {
    switch (type) {
      case 'MATCH_FOUND':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'CLAIM_SUBMITTED':
        return <Inbox className="w-5 h-5 text-purple-600" />;
      case 'CLAIM_ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'CLAIM_REJECTED':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-brand-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Notifications Center</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time notifications for AI matches, ownership claim submissions, and status updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              filterUnread
                ? 'bg-brand-50 border-brand-300 text-brand-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {filterUnread ? 'Show All' : 'Show Unread Only'}
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : displayedNotifications.length > 0 ? (
          displayedNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                n.is_read
                  ? 'bg-white border-slate-200/80 text-slate-700'
                  : 'bg-brand-50/50 border-brand-200/90 shadow-sm ring-1 ring-brand-500/10'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
                {getIcon(n.notification_type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.created_at).toLocaleDateString()}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                <div className="flex items-center justify-between pt-2">
                  {n.action_url ? (
                    <Link
                      to={n.action_url}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : <span />}

                  {!n.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n.id);
                      }}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Notifications</p>
            <p className="text-xs text-slate-400">
              {filterUnread
                ? 'You have caught up with all unread notifications.'
                : 'You currently have no new notifications.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationsPage;
