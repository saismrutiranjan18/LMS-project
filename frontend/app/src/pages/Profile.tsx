import { useState } from 'react';
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Award, 
  Clock,
  Edit2,
  Save,
  Trophy,
  Flame,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore, useDashboardStore } from '@/store';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const { stats, badges, leaderboard } = useDashboardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate learner exploring new technologies and skills. Always eager to learn and grow!',
  });

  const handleSave = () => {
    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const userRank = leaderboard.find(entry => entry.user.id === user?.id)?.rank || 4;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="border-none shadow-lg overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#0056D1] to-[#002A6C] relative">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="profileGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#profileGrid)" />
            </svg>
          </div>
        </div>
        
        <CardContent className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-4xl bg-[#0056D1] text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#0056D1] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#002A6C] transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#1A202C]">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-[#718096]">{formData.bio}</p>
            </div>
            
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-[#0056D1]'}
            >
              {isEditing ? (
                <><Save className="w-4 h-4 mr-2" /> Save</>
              ) : (
                <><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</>
              )}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Rank', value: `#${userRank}`, icon: Trophy, color: 'text-yellow-500' },
              { label: 'Streak', value: `${stats?.streak || 0} days`, icon: Flame, color: 'text-orange-500' },
              { label: 'Courses', value: stats?.completedCourses || 0, icon: BookOpen, color: 'text-blue-500' },
              { label: 'Badges', value: badges.filter(b => b.isUnlocked).length, icon: Award, color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-xl">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-[#1A202C]">{stat.value}</p>
                  <p className="text-sm text-[#718096]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start bg-white mb-6">
              <TabsTrigger value="about" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
                About
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
                My Courses
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-0">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="h-12 pl-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="h-12 pl-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          disabled={!isEditing}
                          className="h-12 pl-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                        <Input
                          value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                          disabled
                          className="h-12 pl-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      className="w-full min-h-[100px] p-3 rounded-lg border border-[#E6F0FF] focus:border-[#0056D1] focus:ring-1 focus:ring-[#0056D1] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Enrolled Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Complete Web Design Bootcamp', progress: 75, total: 42, completed: 31 },
                      { title: 'Python for Data Science', progress: 30, total: 35, completed: 10 },
                      { title: 'Digital Marketing Mastery', progress: 50, total: 28, completed: 14 },
                    ].map((course, i) => (
                      <div key={i} className="p-4 border border-[#E6F0FF] rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-[#1A202C]">{course.title}</h4>
                          <Badge className="bg-[#0056D1]">{course.progress}%</Badge>
                        </div>
                        <Progress value={course.progress} className="h-2 mb-2" />
                        <p className="text-sm text-[#718096]">
                          {course.completed} of {course.total} lessons completed
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Completed lesson', target: 'CSS Grid Layout', time: '2 hours ago', icon: BookOpen },
                      { action: 'Earned badge', target: 'Fast Learner', time: '1 day ago', icon: Award },
                      { action: 'Scored 95%', target: 'JavaScript Quiz', time: '2 days ago', icon: GraduationCap },
                      { action: 'Started course', target: 'React Native Development', time: '3 days ago', icon: Clock },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 hover:bg-[#F8FAFC] rounded-xl transition-colors">
                        <div className="w-10 h-10 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                          <activity.icon className="w-5 h-5 text-[#0056D1]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#1A202C]">
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-[#718096]"> - {activity.target}</span>
                          </p>
                          <p className="text-sm text-[#718096]">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Stats & Badges */}
        <div className="space-y-6">
          {/* Learning Stats */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Total Learning Time', value: `${Math.floor((stats?.totalLearningTime || 0) / 60)}h ${(stats?.totalLearningTime || 0) % 60}m`, icon: Clock },
                { label: 'Average Score', value: `${stats?.averageScore || 0}%`, icon: GraduationCap },
                { label: 'Certificates', value: stats?.certificatesEarned || 0, icon: Award },
                { label: 'Current Streak', value: `${stats?.streak || 0} days`, icon: Flame },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-5 h-5 text-[#718096]" />
                    <span className="text-sm text-[#718096]">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-[#1A202C]">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Recent Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {badges.filter(b => b.isUnlocked).slice(0, 6).map((badge) => (
                  <div 
                    key={badge.id}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
                    title={badge.name}
                  >
                    <Award className="w-7 h-7 text-white" />
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[#0056D1]">
                View All Badges
              </Button>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Web Design', 'Python', 'JavaScript', 'Data Science', 'UI/UX', 'React'].map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
