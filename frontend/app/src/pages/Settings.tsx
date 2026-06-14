import { useState } from 'react';
import { 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Moon, 
  Shield, 
  Mail, 
  Smartphone,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    quizReminders: true,
    communityActivity: false,
    leaderboardChanges: true,
    newCourses: true,
    promotions: false,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showProgress: true,
    showCertificates: true,
    allowMentions: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Settings</h1>
        <p className="text-[#718096]">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="w-full justify-start bg-white mb-6 flex-wrap h-auto gap-2">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            <Lock className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            <Moon className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-0 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#0056D1]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A202C]">Email Notifications</p>
                    <p className="text-sm text-[#718096]">Receive updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#0056D1]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A202C]">Push Notifications</p>
                    <p className="text-sm text-[#718096]">Receive push notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>

              <Separator />

              {/* Notification Types */}
              <div className="space-y-4">
                <p className="font-medium text-[#1A202C]">Notification Types</p>
                
                {[
                  { key: 'courseUpdates', label: 'Course Updates', description: 'New lessons and course content' },
                  { key: 'quizReminders', label: 'Quiz Reminders', description: 'Upcoming quiz deadlines' },
                  { key: 'communityActivity', label: 'Community Activity', description: 'Replies and mentions' },
                  { key: 'leaderboardChanges', label: 'Leaderboard Changes', description: 'Rank updates and achievements' },
                  { key: 'newCourses', label: 'New Courses', description: 'Courses you might like' },
                  { key: 'promotions', label: 'Promotions', description: 'Special offers and discounts' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1A202C]">{item.label}</p>
                      <p className="text-xs text-[#718096]">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="mt-0 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your profile visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'publicProfile', label: 'Public Profile', description: 'Allow others to see your profile' },
                { key: 'showProgress', label: 'Show Progress', description: 'Display your learning progress' },
                { key: 'showCertificates', label: 'Show Certificates', description: 'Display earned certificates' },
                { key: 'allowMentions', label: 'Allow Mentions', description: 'Others can mention you in discussions' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-[#0056D1]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1A202C]">{item.label}</p>
                      <p className="text-sm text-[#718096]">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy[item.key as keyof typeof privacy]}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="mt-0 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light', icon: '☀️' },
                    { value: 'dark', label: 'Dark', icon: '🌙' },
                    { value: 'auto', label: 'Auto', icon: '⚡' },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        appearance.theme === theme.value
                          ? 'border-[#0056D1] bg-[#E6F0FF]'
                          : 'border-[#E6F0FF] hover:border-[#0056D1]/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{theme.icon}</div>
                      <p className="font-medium text-sm">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Language */}
              <div className="space-y-3">
                <Label>Language</Label>
                <Select
                  value={appearance.language}
                  onValueChange={(value) => setAppearance({ ...appearance, language: value })}
                >
                  <SelectTrigger className="h-12">
                    <Globe className="w-5 h-5 mr-2 text-[#718096]" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Font Size */}
              <div className="space-y-3">
                <Label>Font Size</Label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setAppearance({ ...appearance, fontSize: size })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 capitalize transition-all ${
                        appearance.fontSize === size
                          ? 'border-[#0056D1] bg-[#E6F0FF] text-[#0056D1]'
                          : 'border-[#E6F0FF] text-[#718096] hover:border-[#0056D1]/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-0 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Protect your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              <div className="space-y-4">
                <p className="font-medium text-[#1A202C]">Change Password</p>
                <div className="space-y-3">
                  <Input type="password" placeholder="Current password" className="h-12" />
                  <Input type="password" placeholder="New password" className="h-12" />
                  <Input type="password" placeholder="Confirm new password" className="h-12" />
                </div>
                <Button className="bg-[#0056D1]">Update Password</Button>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#0056D1]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A202C]">Two-Factor Authentication</p>
                    <p className="text-sm text-[#718096]">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline">Enable</Button>
              </div>

              <Separator />

              {/* Active Sessions */}
              <div className="space-y-4">
                <p className="font-medium text-[#1A202C]">Active Sessions</p>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'San Francisco, CA', current: true },
                    { device: 'Safari on iPhone', location: 'San Francisco, CA', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl">
                      <div>
                        <p className="font-medium text-[#1A202C]">{session.device}</p>
                        <p className="text-sm text-[#718096]">{session.location}</p>
                      </div>
                      {session.current ? (
                        <Badge className="bg-green-500">Current</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-red-500">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-[#0056D1] hover:bg-[#002A6C] h-12 px-8"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
