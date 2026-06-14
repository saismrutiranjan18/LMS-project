import { useState } from 'react';
import { 
  Bell, 
  BookOpen, 
  CheckCircle, 
  MessageSquare, 
  Trophy, 
  AlertCircle,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationStore } from '@/store';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  course: BookOpen,
  quiz: CheckCircle,
  achievement: Trophy,
  system: Bell,
  deadline: AlertCircle,
  comment: MessageSquare,
};

const colorMap: Record<string, string> = {
  course: 'bg-blue-100 text-blue-600',
  quiz: 'bg-green-100 text-green-600',
  achievement: 'bg-yellow-100 text-yellow-600',
  system: 'bg-gray-100 text-gray-600',
  deadline: 'bg-red-100 text-red-600',
  comment: 'bg-purple-100 text-purple-600',
};

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    toast.success('All notifications cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Notifications</h1>
          <p className="text-[#718096]">
            You have <span className="font-semibold text-[#0056D1]">{unreadCount}</span> unread notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={handleClearAll} className="text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full justify-start bg-white flex-wrap h-auto gap-2">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            All
            <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Unread
            <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="course" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Courses
          </TabsTrigger>
          <TabsTrigger value="quiz" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="achievement" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-[#E6F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-10 h-10 text-[#718096]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A202C] mb-2">No notifications</h3>
                  <p className="text-[#718096]">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = iconMap[notification.type] || Bell;
                const colorClass = colorMap[notification.type] || 'bg-gray-100 text-gray-600';
                
                return (
                  <Card 
                    key={notification.id} 
                    className={`border-none shadow-sm hover:shadow-md transition-shadow ${
                      !notification.isRead ? 'bg-[#E6F0FF]/30' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-[#1A202C]">{notification.title}</h4>
                              <p className="text-sm text-[#718096] mt-1">{notification.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-3 h-3 text-[#718096]" />
                                <span className="text-xs text-[#718096]">
                                  {new Date(notification.createdAt).toRelativeTimeString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-[#0056D1]"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Mark read
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="text-[#718096]">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}
