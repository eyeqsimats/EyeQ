import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import api from '@/api/axios';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FolderPlus, Activity, User, MessageSquare, LogOut, Code, ExternalLink, Camera, Loader2, Megaphone, X, Trophy, Linkedin } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import QueriesTab from './QueriesTab';
import AchievementsTab from './AchievementsTab';

const MemberDashboard = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [profile, setProfile] = useState<any>(null);
    const [projects, setProjects] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [contributionText, setContributionText] = useState('');

    // Project Form State
    const [newProject, setNewProject] = useState({ title: '', description: '', repoLink: '', demoLink: '', linkedInPostLink: '' });

    // Feedback State
    const [feedback, setFeedback] = useState({ type: 'general', message: '', rating: 5 });

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editProfileData, setEditProfileData] = useState({ name: '', bio: '', skills: '', github: '', linkedin: '', portfolio: '', registerNumber: '', mobileNumber: '' });

    // Streak Details State
    const [showStreakDetails, setShowStreakDetails] = useState(false);
    const [showLongestStreakDetails, setShowLongestStreakDetails] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Announcement State
    const [announcement, setAnnouncement] = useState<any>(null);

    // Photo Upload State
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) fetchProfile();
        fetchProjects();
        fetchContributions();
        fetchAnnouncement();
    }, [user]);

    useEffect(() => {
        if (profile) {
            setEditProfileData({
                name: profile.name || '',
                bio: profile.bio || '',
                skills: profile.skills ? profile.skills.join(', ') : '',
                github: profile.socialLinks?.github || '',
                linkedin: profile.socialLinks?.linkedin || '',
                portfolio: profile.socialLinks?.portfolio || '',
                registerNumber: profile.registerNumber || '',
                mobileNumber: profile.mobileNumber || ''
            });
        }
    }, [profile]);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get(`/users/profile/${user?.uid}`);
            setProfile(data);
        } catch (error) {
            console.error("Failed to fetch profile");
        }
    };

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects/myprojects');
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects");
        }
    };

    const fetchContributions = async () => {
        try {
            const { data } = await api.get('/contributions/my');
            setContributions(data);
        } catch (error) {
            console.error("Failed to fetch contributions");
        }
    };

    const fetchAnnouncement = async () => {
        try {
            const { data } = await api.get('/announcements/latest');
            if (data.message) setAnnouncement(data);
        } catch (error) {
            console.error("Failed to fetch announcement");
        }
    };

    const handleContributionSubmit = async () => {
        try {
            await api.post('/contributions', { description: contributionText });
            toast({ title: "Contribution Logged", description: "Keep the streak alive!" });
            setContributionText('');
            fetchContributions();
        } catch (error) {
            toast({ title: "Error", description: "Failed to log contribution", variant: "destructive" });
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projects', newProject);
            toast({ title: "Project Submitted", description: "Waiting for admin approval." });
            setNewProject({ title: '', description: '', repoLink: '', demoLink: '', linkedInPostLink: '' });
            fetchProjects();
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit project", variant: "destructive" });
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/feedback', feedback);
            toast({ title: "Feedback Sent", description: "Thank you for your input!" });
            setFeedback({ type: 'general', message: '', rating: 5 });
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let photoURL = profile?.photoURL;

            if (photoFile) {
                setUploadingPhoto(true);
                const storageRef = ref(storage, `profile-photos/${user?.uid}`);
                await uploadBytes(storageRef, photoFile);
                photoURL = await getDownloadURL(storageRef);
                setUploadingPhoto(false);
            }

            const updatedData = {
                name: editProfileData.name,
                bio: editProfileData.bio,
                skills: editProfileData.skills.split(',').map(s => s.trim()),
                socialLinks: {
                    github: editProfileData.github,
                    linkedin: editProfileData.linkedin,
                    portfolio: editProfileData.portfolio
                },
                registerNumber: editProfileData.registerNumber,
                mobileNumber: editProfileData.mobileNumber,
                photoURL
            };

            await api.put('/users/profile', updatedData);
            toast({ title: "Profile Updated", description: "Your changes have been saved." });
            setIsEditingProfile(false);
            setPhotoFile(null); // Reset file input
            fetchProfile();
        } catch (error) {
            console.error(error);
            setUploadingPhoto(false);
            toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="container mx-auto p-6 space-y-8 max-w-7xl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Announcement Banner */}
            <AnimatePresence>
                {announcement && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl shadow-lg flex justify-between items-center relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 z-10">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Megaphone className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm uppercase tracking-wider opacity-80 mb-0.5">Announcement</p>
                                <p className="font-medium text-lg">{announcement.message}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white z-10" onClick={() => setAnnouncement(null)}>
                            <X className="w-5 h-5" />
                        </Button>
                        {/* Decorative Circle */}
                        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-2 border-border">
                            {profile?.photoURL ? (
                                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile?.name?.charAt(0) || user?.displayName?.charAt(0) || 'M'
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome, {profile?.name || user?.displayName || 'Member'}! 👋</h1>
                        <p className="text-muted-foreground flex items-center gap-2"><Code className="w-4 h-4" /> Level up your skills and contributions today.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive transition-colors gap-2 border-border text-foreground"><LogOut className="w-4 h-4" /> Logout</Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div variants={itemVariants}>
                    <Card
                        className="bg-card border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] duration-300 cursor-pointer relative overflow-hidden group border-border"
                        onClick={() => setShowStreakDetails(!showStreakDetails)}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                {showStreakDetails ? "Streak Details" : "Current Streak"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                {!showStreakDetails ? (
                                    <motion.div
                                        key="main"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="text-4xl font-bold text-foreground">
                                            🔥 {profile?.stats?.currentStreak || 0} <span className="text-sm font-normal text-muted-foreground">days</span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-2"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Streak Started:</span>
                                            <span className="text-sm font-semibold text-foreground">
                                                {profile?.stats?.currentStreakStartDate ? new Date(profile.stats.currentStreakStartDate).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Contribution:</span>
                                            <span className="text-sm font-semibold text-foreground">
                                                {profile?.stats?.lastContribution ? new Date(profile.stats.lastContribution).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card
                        className="bg-card border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow hover:scale-[1.02] duration-300 cursor-pointer border-border"
                        onClick={() => setActiveTab("projects")}
                    >
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground">Total Projects</CardTitle></CardHeader>
                        <CardContent className="text-4xl font-bold text-foreground">{profile?.stats?.totalProjects || 0}</CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card
                        className="bg-card border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow hover:scale-[1.02] duration-300 cursor-pointer border-border"
                        onClick={() => setActiveTab("projects")}
                    >
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground">Approved</CardTitle></CardHeader>
                        <CardContent className="text-4xl font-bold text-green-500">{profile?.stats?.approvedProjects || 0}</CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card
                        className="bg-card border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow hover:scale-[1.02] duration-300 cursor-pointer relative overflow-hidden group border-border"
                        onClick={() => setShowLongestStreakDetails(!showLongestStreakDetails)}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                {showLongestStreakDetails ? "Longest Streak Details" : "Longest Streak"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                {!showLongestStreakDetails ? (
                                    <motion.div
                                        key="main-longest"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="text-4xl font-bold text-foreground">🏆 {profile?.stats?.longestStreak || 0}</div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="details-longest"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-2"
                                    >
                                        {profile?.stats?.longestStreak > 0 && profile?.stats?.longestStreakStartDate ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration:</span>
                                                <span className="text-sm font-semibold text-foreground">
                                                    {new Date(profile.stats.longestStreakStartDate).toLocaleDateString()}
                                                    {profile?.stats?.longestStreakEndDate && ` - ${new Date(profile.stats.longestStreakEndDate).toLocaleDateString()}`}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">No streak data available.</span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-12 p-0 space-x-6 overflow-x-auto">
                    <TabsTrigger value="overview" className="flex gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"><Home className="w-4 h-4" /> Overview</TabsTrigger>
                    <TabsTrigger value="projects" className="flex gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"><FolderPlus className="w-4 h-4" /> Projects</TabsTrigger>
                    <TabsTrigger value="contributions" className="flex gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"><Activity className="w-4 h-4" /> Contributions</TabsTrigger>
                    <TabsTrigger value="profile" className="flex gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"><User className="w-4 h-4" /> Profile</TabsTrigger>
                    <TabsTrigger value="feedback" className="flex gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"><MessageSquare className="w-4 h-4" /> Feedback</TabsTrigger>
                    <TabsTrigger value="achievements" className="flex gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"><Trophy className="w-4 h-4" /> Achievements</TabsTrigger>
                    <TabsTrigger value="queries" className="flex gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"><Code className="w-4 h-4" /> Support & Queries</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Chart */}
                        <Card className="md:col-span-2">
                            <CardHeader><CardTitle>Contribution Activity</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                {contributions.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={contributions.slice(0, 14).reverse().map((c: any) => ({ date: new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), count: 1 }))}>
                                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : <div className="flex h-full items-center justify-center text-muted-foreground">No contributions yet. Start logging!</div>}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {contributions.slice(0, 5).map((c: any) => (
                                    <div key={c.id} className="flex flex-col gap-1 border-b last:border-0 pb-2 last:pb-0">
                                        <span className="font-medium text-sm">{c.description}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString()}</span>
                                    </div>
                                ))}
                                {contributions.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* New Project Form */}
                        <motion.div variants={itemVariants} className="md:col-span-1 h-fit sticky top-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upload Project</CardTitle>
                                    <CardDescription>Share your latest work.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                                        <Input placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} required className="bg-secondary border-border focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-muted-foreground text-foreground" />
                                        <Textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} required className="bg-secondary border-border focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-muted-foreground text-foreground min-h-[100px]" />
                                        <Input placeholder="GitHub Repo URL" value={newProject.repoLink} onChange={e => setNewProject({ ...newProject, repoLink: e.target.value })} required className="bg-secondary border-border focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-muted-foreground text-foreground" />
                                        <Input placeholder="Live Demo URL" value={newProject.demoLink} onChange={e => setNewProject({ ...newProject, demoLink: e.target.value })} required className="bg-secondary border-border focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-muted-foreground text-foreground" />
                                        <Input placeholder="LinkedIn Post Link (Optional)" value={newProject.linkedInPostLink} onChange={e => setNewProject({ ...newProject, linkedInPostLink: e.target.value })} className="bg-secondary border-border focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-muted-foreground text-foreground" />
                                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">Submit Project</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Project List */}
                        <div className="md:col-span-2 space-y-4">
                            <h2 className="text-xl font-semibold mb-4">My Projects</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map((project: any, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="overflow-hidden transition-all hover:shadow-md border border-gray-100 group">
                                            <div className={`h-2 w-full ${project.status === 'approved' ? 'bg-green-500' : project.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${project.status === 'approved' ? 'bg-green-100 text-green-700' : project.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {project.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                                                <div className="flex gap-4 text-sm">
                                                    <a href={project.repoLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline"><ExternalLink className="w-3 h-3" /> GitHub Repo</a>
                                                    <a href={project.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline"><ExternalLink className="w-3 h-3" /> Live Demo</a>
                                                    {project.linkedInPostLink && (
                                                        <a href={project.linkedInPostLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline"><Linkedin className="w-3 h-3" /> Post</a>
                                                    )}
                                                </div>
                                                {project.adminFeedback && (
                                                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                                                        <p className="text-sm text-red-700"><span className="font-semibold">Feedback:</span> {project.adminFeedback}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                                {projects.length === 0 && <p className="text-muted-foreground text-center py-8">No projects uploaded yet.</p>}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Contributions Tab */}
                <TabsContent value="contributions" className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader><CardTitle>Log Contribution</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input
                                        placeholder="What did you learn or build today?"
                                        value={contributionText}
                                        onChange={e => setContributionText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleContributionSubmit()}
                                        className="flex-1 bg-secondary border-border focus-visible:ring-1 focus-visible:ring-blue-500 placeholder:text-muted-foreground text-foreground font-mono"
                                    />
                                    <Button onClick={handleContributionSubmit} className="bg-green-600 hover:bg-green-700 text-white min-w-[120px] shadow-md hover:shadow-lg">Log</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold px-1">History</h3>
                        {contributions.map((c: any, index) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-2 hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-gray-800 font-medium">{c.description}</span>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(c.date).toLocaleString()}</span>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <CardTitle className="text-foreground">Profile Details</CardTitle>
                                <Button variant="outline" onClick={() => setIsEditingProfile(!isEditingProfile)} className="border-border text-foreground hover:bg-secondary">
                                    {isEditingProfile ? "Cancel" : "Edit Profile"}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isEditingProfile ? (
                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div className="flex flex-row items-center gap-6 mb-8">
                                            <div className="relative group cursor-pointer w-24 h-24 shrink-0">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-secondary flex items-center justify-center">
                                                    {photoPreview ? (
                                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : profile?.photoURL ? (
                                                        <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-10 h-10 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <label htmlFor="photo-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </label>
                                                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-lg font-semibold text-foreground">Profile Photo</h3>
                                                <p className="text-sm text-muted-foreground">Click the image to upload a new one.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Full Name</label>
                                                <Input value={editProfileData.name} onChange={e => setEditProfileData({ ...editProfileData, name: e.target.value })} className="bg-secondary border-border text-foreground" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Register Number</label>
                                                <Input value={editProfileData.registerNumber} onChange={e => setEditProfileData({ ...editProfileData, registerNumber: e.target.value })} className="bg-secondary border-border text-foreground" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Mobile Number</label>
                                                <Input value={editProfileData.mobileNumber} onChange={e => setEditProfileData({ ...editProfileData, mobileNumber: e.target.value })} className="bg-secondary border-border text-foreground" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium text-foreground">Bio</label>
                                                <Input value={editProfileData.bio} onChange={e => setEditProfileData({ ...editProfileData, bio: e.target.value })} className="bg-secondary border-border text-foreground" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium text-foreground">Skills (comma separated)</label>
                                                <Input value={editProfileData.skills} onChange={e => setEditProfileData({ ...editProfileData, skills: e.target.value })} placeholder="React, Node.js, Design..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">GitHub URL</label>
                                                <Input value={editProfileData.github} onChange={e => setEditProfileData({ ...editProfileData, github: e.target.value })} className="bg-secondary border-border text-foreground" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                                                <Input value={editProfileData.linkedin} onChange={e => setEditProfileData({ ...editProfileData, linkedin: e.target.value })} className="bg-secondary border-border text-foreground" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium text-foreground">Portfolio URL</label>
                                                <Input value={editProfileData.portfolio} onChange={e => setEditProfileData({ ...editProfileData, portfolio: e.target.value })} className="bg-secondary border-border text-foreground" />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={uploadingPhoto} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            {uploadingPhoto ? "Uploading & Saving..." : "Save Changes"}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="shrink-0">
                                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-border bg-secondary shadow-sm flex items-center justify-center">
                                                {profile?.photoURL ? (
                                                    <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-12 h-12 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-foreground">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Full Name</p>
                                                <p className="font-medium text-lg">{profile?.name || user?.displayName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="font-medium text-lg">{profile?.email || user?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Register Number</p>
                                                <p className="font-medium text-lg">{profile?.registerNumber || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Mobile Number</p>
                                                <p className="font-medium text-lg">{profile?.mobileNumber || '-'}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-muted-foreground">Bio</p>
                                                <p className="font-medium text-foreground">{profile?.bio || 'No bio provided.'}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-muted-foreground mb-1">Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile?.skills && profile.skills.length > 0 ? (
                                                        profile.skills.map((skill: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-sm">{skill}</span>
                                                        ))
                                                    ) : <span className="text-sm text-muted-foreground">No skills listed.</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">GitHub</p>
                                                <a href={profile?.socialLinks?.github} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{profile?.socialLinks?.github || '-'}</a>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">LinkedIn</p>
                                                <a href={profile?.socialLinks?.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{profile?.socialLinks?.linkedin || '-'}</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Feedback Tab */}
                <TabsContent value="feedback" className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Submit Feedback</CardTitle>
                                <CardDescription>Tell us about a bug, feature request, or general experience.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-lg">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <select
                                            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={feedback.type}
                                            onChange={e => setFeedback({ ...feedback, type: e.target.value })}
                                        >
                                            <option value="general">General</option>
                                            <option value="bug">Bug Report</option>
                                            <option value="suggestion">Suggestion</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea
                                            value={feedback.message}
                                            onChange={e => setFeedback({ ...feedback, message: e.target.value })}
                                            placeholder="Your thoughts..."
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Rating (1-5)</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={feedback.rating}
                                            onChange={e => setFeedback({ ...feedback, rating: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="shadow-md hover:shadow-lg">Send Feedback</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
                {/* Achievements Tab */}
                <TabsContent value="achievements" className="space-y-6">
                    <AchievementsTab />
                </TabsContent>

                {/* Queries Tab */}
                <TabsContent value="queries" className="space-y-6">
                    <QueriesTab />
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

export default MemberDashboard;
