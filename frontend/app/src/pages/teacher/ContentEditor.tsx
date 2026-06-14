import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  Video, 
  FileText, 
  HelpCircle, 
  ChevronDown,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  duration: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function ContentEditor() {
  useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('content');
  const [expandedModules, setExpandedModules] = useState<string[]>(['1']);
  const [courseData, setCourseData] = useState({
    title: 'Complete Web Design Bootcamp',
    description: 'Master modern web design with HTML, CSS, JavaScript, and responsive design principles.',
    category: 'Design',
    level: 'beginner',
    price: 99,
    isPublished: true,
  });

  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction',
      lessons: [
        { id: '1', title: 'Welcome to the Course', type: 'video', duration: 300 },
        { id: '2', title: 'Course Overview', type: 'video', duration: 420 },
        { id: '3', title: 'Getting Started Guide', type: 'document', duration: 0 },
      ]
    },
    {
      id: '2',
      title: 'Fundamentals',
      lessons: [
        { id: '4', title: 'Core Concepts', type: 'video', duration: 900 },
        { id: '5', title: 'Basic Principles', type: 'video', duration: 720 },
        { id: '6', title: 'Practice Quiz', type: 'quiz', duration: 0 },
      ]
    },
  ]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSave = () => {
    toast.success('Course saved successfully!');
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: 'New Module',
      lessons: [],
    };
    setModules([...modules, newModule]);
    setExpandedModules([...expandedModules, newModule.id]);
  };

  const handleAddLesson = (moduleId: string, type: 'video' | 'document' | 'quiz') => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: type === 'quiz' ? 'New Quiz' : 'New Lesson',
      type,
      duration: 0,
    };
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, lessons: [...m.lessons, newLesson] }
        : m
    ));
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
        : m
    ));
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Edit Course</h1>
          <p className="text-[#718096]">Manage your course content and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-[#0056D1]" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-white mb-6">
          <TabsTrigger value="content" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Content
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Course Details
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Curriculum Builder */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1A202C]">Curriculum</h3>
                <Button onClick={handleAddModule} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="space-y-4">
                {modules.map((module) => (
                  <Card key={module.id} className="border border-[#E6F0FF]">
                    <CardContent className="p-4">
                      {/* Module Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <GripVertical className="w-5 h-5 text-[#718096] cursor-move" />
                        <button 
                          onClick={() => toggleModule(module.id)}
                          className="flex items-center gap-2 flex-1"
                        >
                          {expandedModules.includes(module.id) ? (
                            <ChevronDown className="w-5 h-5 text-[#718096]" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-[#718096]" />
                          )}
                          <Input 
                            value={module.title}
                            onChange={(e) => {
                              setModules(modules.map(m => 
                                m.id === module.id ? { ...m, title: e.target.value } : m
                              ));
                            }}
                            className="font-semibold border-none focus-visible:ring-0 px-0"
                          />
                        </button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteModule(module.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>

                      {/* Lessons */}
                      {expandedModules.includes(module.id) && (
                        <div className="space-y-2 ml-8">
                          {module.lessons.map((lesson) => (
                            <div 
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg group"
                            >
                              <GripVertical className="w-4 h-4 text-[#718096] cursor-move" />
                              {lesson.type === 'video' && <Video className="w-4 h-4 text-[#0056D1]" />}
                              {lesson.type === 'document' && <FileText className="w-4 h-4 text-green-500" />}
                              {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4 text-purple-500" />}
                              <Input 
                                value={lesson.title}
                                onChange={(e) => {
                                  setModules(modules.map(m => 
                                    m.id === module.id 
                                      ? { 
                                          ...m, 
                                          lessons: m.lessons.map(l => 
                                            l.id === lesson.id ? { ...l, title: e.target.value } : l
                                          )
                                        }
                                      : m
                                  ));
                                }}
                                className="flex-1 text-sm border-none focus-visible:ring-0 px-0 bg-transparent"
                              />
                              <span className="text-xs text-[#718096]">
                                {lesson.duration > 0 ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, '0')}` : '-'}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ))}

                          {/* Add Lesson Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddLesson(module.id, 'video')}
                            >
                              <Video className="w-4 h-4 mr-1" />
                              Video
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddLesson(module.id, 'document')}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Document
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddLesson(module.id, 'quiz')}
                            >
                              <HelpCircle className="w-4 h-4 mr-1" />
                              Quiz
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#1A202C] mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Upload Videos
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Import from URL
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Add Resources
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#1A202C] mb-4">Course Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#718096]">Total Modules</span>
                      <span className="font-medium">{modules.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#718096]">Total Lessons</span>
                      <span className="font-medium">{modules.reduce((acc, m) => acc + m.lessons.length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#718096]">Total Duration</span>
                      <span className="font-medium">
                        {Math.floor(modules.flatMap(m => m.lessons).reduce((acc, l) => acc + l.duration, 0) / 60)}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="mt-0">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input 
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={courseData.description}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={courseData.category} onChange={(e) => setCourseData({ ...courseData, category: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Input value={courseData.level} onChange={(e) => setCourseData({ ...courseData, level: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input 
                    type="number" 
                    value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Course Thumbnail</Label>
                <div className="border-2 border-dashed border-[#E6F0FF] rounded-xl p-8 text-center hover:border-[#0056D1] transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-[#718096] mx-auto mb-3" />
                  <p className="text-[#718096]">Drag and drop or click to upload</p>
                  <p className="text-sm text-[#718096]">Recommended: 1280x720px</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-0">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1A202C]">Published</p>
                  <p className="text-sm text-[#718096]">Make this course visible to students</p>
                </div>
                <Switch 
                  checked={courseData.isPublished}
                  onCheckedChange={(checked) => setCourseData({ ...courseData, isPublished: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1A202C]">Allow Comments</p>
                  <p className="text-sm text-[#718096]">Students can comment on lessons</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1A202C]">Certificate</p>
                  <p className="text-sm text-[#718096]">Issue certificate on completion</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1A202C]">Prerequisites</p>
                  <p className="text-sm text-[#718096]">Require completion of previous courses</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
