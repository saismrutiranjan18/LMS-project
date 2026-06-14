import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Flame, TrendingUp, Award, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStore } from '@/store';

export default function Leaderboard() {
  const { leaderboard, fetchDashboardData } = useDashboardStore();
  const [timeFilter, setTimeFilter] = useState('weekly');

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1A202C] mb-4">
          Leaderboard
        </h1>
        <p className="text-[#718096] max-w-xl mx-auto">
          Compete with learners worldwide and climb the ranks. Earn points by completing courses, quizzes, and maintaining your streak!
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <Tabs value={timeFilter} onValueChange={setTimeFilter} className="w-auto">
          <TabsList className="bg-white">
            <TabsTrigger value="daily" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="allTime" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              All Time
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 p-1">
                <Avatar className="w-full h-full">
                  <AvatarImage src={topThree[1].user.avatar} />
                  <AvatarFallback className="text-2xl">{topThree[1].user.firstName[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
            </div>
            <p className="font-semibold text-[#1A202C]">{topThree[1].user.firstName}</p>
            <p className="text-sm text-[#718096]">{topThree[1].points.toLocaleString()} pts</p>
            <Medal className="w-6 h-6 text-gray-400 mt-2" />
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className="flex flex-col items-center -mt-8">
            <Crown className="w-10 h-10 text-yellow-400 mb-2" />
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 p-1.5 shadow-lg shadow-yellow-200">
                <Avatar className="w-full h-full border-4 border-white">
                  <AvatarImage src={topThree[0].user.avatar} />
                  <AvatarFallback className="text-3xl">{topThree[0].user.firstName[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
            </div>
            <p className="font-bold text-xl text-[#1A202C]">{topThree[0].user.firstName}</p>
            <p className="text-[#718096]">{topThree[0].points.toLocaleString()} pts</p>
            <div className="flex items-center gap-1 mt-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-orange-500 font-medium">{topThree[0].streak} day streak</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 p-1">
                <Avatar className="w-full h-full">
                  <AvatarImage src={topThree[2].user.avatar} />
                  <AvatarFallback className="text-2xl">{topThree[2].user.firstName[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
            <p className="font-semibold text-[#1A202C]">{topThree[2].user.firstName}</p>
            <p className="text-sm text-[#718096]">{topThree[2].points.toLocaleString()} pts</p>
            <Medal className="w-6 h-6 text-orange-400 mt-2" />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Learners', value: '12,450', icon: Trophy, color: 'from-yellow-400 to-yellow-500' },
          { label: 'Points Awarded', value: '2.5M', icon: Award, color: 'from-blue-400 to-blue-500' },
          { label: 'Active Streaks', value: '3,890', icon: Flame, color: 'from-orange-400 to-orange-500' },
          { label: 'Courses Completed', value: '45,230', icon: TrendingUp, color: 'from-green-400 to-green-500' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A202C]">{stat.value}</p>
                <p className="text-sm text-[#718096]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#1A202C]">Full Rankings</h3>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-3">
            {rest.map((entry) => (
              <div 
                key={entry.user.id}
                className="flex items-center gap-4 p-4 hover:bg-[#E6F0FF]/50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#E6F0FF] flex items-center justify-center font-bold text-[#718096]">
                  {entry.rank}
                </div>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback>{entry.user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-[#1A202C]">{entry.user.firstName} {entry.user.lastName}</p>
                  <div className="flex items-center gap-4 text-sm text-[#718096]">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {entry.points.toLocaleString()} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {entry.coursesCompleted} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {entry.streak} day streak
                    </span>
                  </div>
                </div>
                <Badge variant={entry.rank <= 10 ? 'default' : 'secondary'} className={entry.rank <= 10 ? 'bg-[#0056D1]' : ''}>
                  {entry.rank <= 10 ? 'Top 10' : 'Rising'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-[#0056D1] to-[#002A6C]">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-white mb-6">How to Earn Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { action: 'Complete a Lesson', points: '+10 pts', icon: TrendingUp },
              { action: 'Finish a Course', points: '+100 pts', icon: Trophy },
              { action: 'Pass a Quiz', points: '+50 pts', icon: Award },
              { action: '7-Day Streak', points: '+25 pts', icon: Flame },
              { action: 'Help in Community', points: '+15 pts', icon: Medal },
              { action: 'Earn a Badge', points: '+75 pts', icon: Crown },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{item.action}</p>
                  <p className="text-white/60 text-sm">{item.points}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
