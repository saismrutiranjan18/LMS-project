import { useEffect, useState } from 'react';
import { 
  Zap, 
  Target, 
  Flame, 
  Heart, 
  Trophy, 
  Star, 
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Lock,
  Share2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStore } from '@/store';
import { toast } from 'sonner';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  criteria: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function Achievements() {
  const { fetchDashboardData } = useDashboardStore();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const allBadges: BadgeItem[] = [
    {
      id: '1',
      name: 'Fast Learner',
      description: 'Complete 5 lessons in a single day',
      icon: Zap,
      criteria: 'Complete 5 lessons in 24 hours',
      points: 100,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      progress: 5,
      maxProgress: 5,
      color: 'from-yellow-400 to-orange-500',
      rarity: 'common',
    },
    {
      id: '2',
      name: 'Quiz Master',
      description: 'Score 100% on 3 consecutive quizzes',
      icon: Target,
      criteria: 'Perfect score on 3 quizzes in a row',
      points: 200,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      progress: 3,
      maxProgress: 3,
      color: 'from-green-400 to-green-600',
      rarity: 'rare',
    },
    {
      id: '3',
      name: 'Consistent',
      description: 'Maintain a 7-day learning streak',
      icon: Flame,
      criteria: '7-day streak',
      points: 150,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      progress: 7,
      maxProgress: 7,
      color: 'from-orange-400 to-red-500',
      rarity: 'common',
    },
    {
      id: '4',
      name: 'Helpful',
      description: 'Answer 10 questions in the community',
      icon: Heart,
      criteria: '10 helpful answers',
      points: 100,
      isUnlocked: false,
      progress: 6,
      maxProgress: 10,
      color: 'from-pink-400 to-rose-500',
      rarity: 'common',
    },
    {
      id: '5',
      name: 'Top Performer',
      description: 'Reach top 10 on the leaderboard',
      icon: Trophy,
      criteria: 'Top 10 ranking',
      points: 500,
      isUnlocked: false,
      progress: 15,
      maxProgress: 10,
      color: 'from-purple-400 to-purple-600',
      rarity: 'epic',
    },
    {
      id: '6',
      name: 'Course Collector',
      description: 'Complete 10 courses',
      icon: BookOpen,
      criteria: '10 completed courses',
      points: 300,
      isUnlocked: false,
      progress: 5,
      maxProgress: 10,
      color: 'from-blue-400 to-blue-600',
      rarity: 'rare',
    },
    {
      id: '7',
      name: 'Time Keeper',
      description: 'Spend 100 hours learning',
      icon: Clock,
      criteria: '100 hours total learning time',
      points: 250,
      isUnlocked: false,
      progress: 45,
      maxProgress: 100,
      color: 'from-cyan-400 to-cyan-600',
      rarity: 'rare',
    },
    {
      id: '8',
      name: 'Social Butterfly',
      description: 'Connect with 50 learners',
      icon: Users,
      criteria: '50 connections',
      points: 150,
      isUnlocked: false,
      progress: 12,
      maxProgress: 50,
      color: 'from-indigo-400 to-indigo-600',
      rarity: 'common',
    },
    {
      id: '9',
      name: 'Rising Star',
      description: 'Earn 1000 points in a week',
      icon: TrendingUp,
      criteria: '1000 points in 7 days',
      points: 400,
      isUnlocked: false,
      progress: 650,
      maxProgress: 1000,
      color: 'from-emerald-400 to-emerald-600',
      rarity: 'epic',
    },
    {
      id: '10',
      name: 'Legend',
      description: 'Reach #1 on the leaderboard',
      icon: Star,
      criteria: 'Rank #1',
      points: 1000,
      isUnlocked: false,
      progress: 4,
      maxProgress: 1,
      color: 'from-amber-400 to-yellow-600',
      rarity: 'legendary',
    },
  ];

  const unlockedBadges = allBadges.filter(b => b.isUnlocked);
  const lockedBadges = allBadges.filter(b => !b.isUnlocked);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-600';
      case 'rare': return 'bg-blue-100 text-blue-600';
      case 'epic': return 'bg-purple-100 text-purple-600';
      case 'legendary': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleShare = (badge: BadgeItem) => {
    toast.success(`Shared ${badge.name} badge!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1A202C] mb-4">
          Achievements
        </h1>
        <p className="text-[#718096] max-w-xl mx-auto">
          Collect badges by completing challenges and showcase your learning journey!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-[#1A202C]">{unlockedBadges.length}</p>
            <p className="text-sm text-[#718096]">Badges Earned</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-[#1A202C]">{allBadges.length}</p>
            <p className="text-sm text-[#718096]">Total Badges</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-[#1A202C]">
              {unlockedBadges.reduce((acc, b) => acc + b.points, 0).toLocaleString()}
            </p>
            <p className="text-sm text-[#718096]">Points from Badges</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-[#1A202C]">
              {Math.round((unlockedBadges.length / allBadges.length) * 100)}%
            </p>
            <p className="text-sm text-[#718096]">Completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-[#1A202C] mb-4">Overall Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[#718096]">Badge Collection</span>
                <span className="text-sm font-medium">{unlockedBadges.length}/{allBadges.length}</span>
              </div>
              <Progress value={(unlockedBadges.length / allBadges.length) * 100} className="h-3" />
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { label: 'Common', count: unlockedBadges.filter(b => b.rarity === 'common').length, total: allBadges.filter(b => b.rarity === 'common').length, color: 'bg-gray-400' },
                { label: 'Rare', count: unlockedBadges.filter(b => b.rarity === 'rare').length, total: allBadges.filter(b => b.rarity === 'rare').length, color: 'bg-blue-500' },
                { label: 'Epic', count: unlockedBadges.filter(b => b.rarity === 'epic').length, total: allBadges.filter(b => b.rarity === 'epic').length, color: 'bg-purple-500' },
                { label: 'Legendary', count: unlockedBadges.filter(b => b.rarity === 'legendary').length, total: allBadges.filter(b => b.rarity === 'legendary').length, color: 'bg-yellow-500' },
              ].map((rarity, i) => (
                <div key={i} className="p-3 bg-[#F8FAFC] rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${rarity.color} mx-auto mb-2`} />
                  <p className="font-bold text-[#1A202C]">{rarity.count}/{rarity.total}</p>
                  <p className="text-xs text-[#718096]">{rarity.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start bg-white mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            All Badges
          </TabsTrigger>
          <TabsTrigger value="unlocked" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Unlocked
          </TabsTrigger>
          <TabsTrigger value="locked" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            In Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`group relative cursor-pointer ${
                  badge.isUnlocked ? '' : 'opacity-60'
                }`}
              >
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${badge.color} p-6 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${
                  badge.isUnlocked ? '' : 'grayscale'
                }`}>
                  <badge.icon className="w-12 h-12 text-white mb-3" />
                  <p className="text-white font-semibold text-center text-sm">{badge.name}</p>
                  {!badge.isUnlocked && (
                    <Lock className="absolute top-3 right-3 w-5 h-5 text-white/70" />
                  )}
                </div>
                <Badge className={`absolute -top-2 -right-2 ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="group relative cursor-pointer"
              >
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${badge.color} p-6 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                  <badge.icon className="w-12 h-12 text-white mb-3" />
                  <p className="text-white font-semibold text-center text-sm">{badge.name}</p>
                </div>
                <Badge className={`absolute -top-2 -right-2 ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="group relative cursor-pointer opacity-60"
              >
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${badge.color} p-6 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 grayscale`}>
                  <badge.icon className="w-12 h-12 text-white mb-3" />
                  <p className="text-white font-semibold text-center text-sm">{badge.name}</p>
                  <Lock className="absolute top-3 right-3 w-5 h-5 text-white/70" />
                </div>
                <Badge className={`absolute -top-2 -right-2 ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <Card 
            className="max-w-md w-full border-none shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-8">
              <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${selectedBadge.color} p-6 flex items-center justify-center mb-6 ${
                selectedBadge.isUnlocked ? '' : 'grayscale'
              }`}>
                <selectedBadge.icon className="w-16 h-16 text-white" />
              </div>
              
              <div className="text-center mb-6">
                <Badge className={`mb-3 ${getRarityColor(selectedBadge.rarity)}`}>
                  {selectedBadge.rarity}
                </Badge>
                <h3 className="text-2xl font-bold text-[#1A202C] mb-2">{selectedBadge.name}</h3>
                <p className="text-[#718096]">{selectedBadge.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#718096]">Criteria</span>
                  <span className="font-medium text-[#1A202C]">{selectedBadge.criteria}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#718096]">Points Reward</span>
                  <span className="font-medium text-[#0056D1]">+{selectedBadge.points} pts</span>
                </div>
                {selectedBadge.isUnlocked && selectedBadge.unlockedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#718096]">Unlocked On</span>
                    <span className="font-medium text-[#1A202C]">
                      {selectedBadge.unlockedAt.toLocaleDateString()}
                    </span>
                  </div>
                )}
                {!selectedBadge.isUnlocked && selectedBadge.progress !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#718096]">Progress</span>
                      <span className="font-medium text-[#1A202C]">
                        {selectedBadge.progress}/{selectedBadge.maxProgress}
                      </span>
                    </div>
                    <Progress 
                      value={(selectedBadge.progress / (selectedBadge.maxProgress || 1)) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {selectedBadge.isUnlocked && (
                  <Button 
                    className="flex-1 bg-[#0056D1]"
                    onClick={() => handleShare(selectedBadge)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Badge
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedBadge(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
