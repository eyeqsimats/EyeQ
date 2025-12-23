import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/api/axios';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, CheckCircle, XCircle, LayoutDashboard, Users, MessageSquare, Edit, Signal, Megaphone, Server, Activity, Trophy, Medal, Star, Send, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [profile, setProfile] = useState<any>(null);

    // Reply State
    const [replyingFeedback, setReplyingFeedback] = useState<any>(null);
    const [replyText, setReplyText] = useState('');

    // Achievement State
    const [awardingUser, setAwardingUser] = useState<any>(null);
    const [awardData, setAwardData] = useState({ title: '', description: '', type: 'badge', icon: 'trophy' });

    // Edit States
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [announcementMsg, setAnnouncementMsg] = useState('');

    // Filter States
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (user) {
            checkAdmin();
        }
    }, [user]);

    const checkAdmin = async () => {
        try {
            const { data } = await api.get(`/users/profile/${user?.uid}`);
            setProfile(data);
            if (data.role === 'admin') {
                fetchStats();
                fetchUsers();
                fetchProjects();
                fetchFeedback();
            }
        } catch (error) {
            console.error("Failed to check admin");
        }
    };

    const fetchStats = async () => { try { const { data } = await api.get('/admin/stats'); setStats(data); } catch (e) { } };
    const fetchUsers = async () => { try { const { data } = await api.get('/admin/users'); setUsers(data); } catch (e) { } };
    const fetchProjects = async () => { try { const res = await api.get('/admin/projects'); setProjects(res.data); } catch (e) { } };
    const fetchFeedback = async () => { try { const { data } = await api.get('/admin/feedback'); setFeedbacks(data); } catch (e) { } };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleProjectStatus = async (id: string, status: string) => {
        try {
            await api.put(`/projects/${id}/status`, { status });
            toast({ title: `Project ${status}` });
            fetchProjects();
        } catch (e) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (uid: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${uid}`);
            toast({ title: "User Deleted" });
            fetchUsers();
        } catch (e) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            await api.put(`/admin/users/${editingUser.id}`, {
                name: editingUser.name,
                bio: editingUser.bio,
                skills: editingUser.skills,
                currentStreak: editingUser.stats?.currentStreak,
                longestStreak: editingUser.stats?.longestStreak
            });
            toast({ title: "User Updated" });
            setEditingUser(null);
            fetchUsers();
        } catch (e) {
            toast({ title: "Failed to update", variant: "destructive" });
        }
    };

    const handleUpdateProject = async () => {
        if (!editingProject) return;
        try {
            await api.put(`/admin/projects/${editingProject.id}`, editingProject);
            toast({ title: "Project Updated" });
            setEditingProject(null);
            fetchProjects();
        } catch (e) {
            toast({ title: "Failed to update", variant: "destructive" });
        }
    };

    const handleReply = async () => {
        if (!replyingFeedback || !replyText) return;
        try {
            await api.put(`/feedback/${replyingFeedback.id || replyingFeedback._id}/reply`, { reply: replyText });
            toast({ title: "Reply Sent" });
            setReplyingFeedback(null);
            setReplyText('');
            fetchFeedback();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleBroadcast = async () => {
        if (!announcementMsg) return;
        try {
            await api.post('/announcements', { message: announcementMsg });
            toast({ title: "Announcement Sent", description: "All users will see this message." });
            setAnnouncementMsg('');
        } catch (error) {
            toast({ title: "Error", description: "Failed to send announcement", variant: "destructive" });
        }
    };

    const handleGiveAward = async () => {
        if (!awardingUser || !awardData.title) return;
        try {
            await api.post('/achievements', {
                targetUserId: awardingUser.id,
                ...awardData
            });
            toast({ title: "Award Given", description: `${awardData.title} awarded to ${awardingUser.name}` });
            setAwardingUser(null);
            setAwardData({ title: '', description: '', type: 'badge', icon: 'trophy' });
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    if (user && profile?.role !== 'admin' && profile !== null) return <div className="p-10 text-center text-destructive font-bold text-2xl">Access Denied: Admin Only Area</div>;

    const filteredProjects = projects.filter((p: any) => filterStatus === 'all' || p.status === filterStatus);
    const queries = feedbacks.filter((f: any) => f.type === 'query');
    const generalFeedback = feedbacks.filter((f: any) => f.type !== 'query');

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 space-y-8 font-sans">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        Admin Command Center
                    </h1>
                    <p className="text-zinc-400 mt-1 flex items-center gap-2">
                        <Signal className="w-4 h-4 text-cyan-500" /> System Online & Operational
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right hidden md:block">
                        <p className="font-semibold text-sm text-zinc-200">{profile?.name || 'Administrator'}</p>
                        <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 bg-cyan-500/10">Super Admin</Badge>
                    </div>
                    <Button variant="destructive" onClick={handleLogout} className="gap-2 bg-red-900/50 hover:bg-red-900 border border-red-800">Log Out</Button>
                </div>
            </motion.div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { title: "Total Members", value: stats.totalMembers, icon: Users, color: "text-cyan-400", border: "border-cyan-500" },
                        { title: "Total Projects", value: stats.totalProjects, icon: LayoutDashboard, color: "text-purple-400", border: "border-purple-500" },
                        { title: "Active Today", value: stats.dailyActiveUsers || 0, icon: Activity, color: "text-green-400", border: "border-green-500" },
                        { title: "Pending Review", value: projects.filter((p: any) => p.status === 'pending').length, icon: CheckCircle, color: "text-yellow-400", border: "border-yellow-500" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className={`bg-zinc-900 border-l-4 ${stat.border} border-y-zinc-800 border-r-zinc-800 shadow-lg hover:shadow-xl transition-all`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-zinc-100">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-zinc-900/80 p-1 h-auto overflow-x-auto border border-zinc-800 w-full justify-start rounded-xl">
                    <TabsTrigger value="overview" className="px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Overview</TabsTrigger>
                    <TabsTrigger value="queries" className="px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Member Queries</TabsTrigger>
                    <TabsTrigger value="users" className="px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Users</TabsTrigger>
                    <TabsTrigger value="projects" className="px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Projects</TabsTrigger>
                    <TabsTrigger value="feedback" className="px-6 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Feedback</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader><CardTitle className="flex items-center gap-2 text-zinc-100"><Megaphone className="w-5 h-5 text-cyan-500" /> Make Announcement</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Message</Label>
                                    <Input
                                        placeholder="Enter global announcement..."
                                        value={announcementMsg}
                                        onChange={e => setAnnouncementMsg(e.target.value)}
                                        className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
                                    />
                                </div>
                                <Button onClick={handleBroadcast} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">Broadcast to All Users</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader><CardTitle className="flex items-center gap-2 text-zinc-100"><Server className="w-5 h-5 text-green-500" /> System Status</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                    <span className="text-sm font-medium text-zinc-300">Database Connection</span>
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                    <span className="text-sm font-medium text-zinc-300">Storage Bucket</span>
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-sm font-medium text-zinc-300">API Latency</span>
                                    <span className="text-sm font-mono text-zinc-500">24ms</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Queries Tab (Replaces Analytics) */}
                <TabsContent value="queries">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader><CardTitle className="text-zinc-100 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-cyan-500" /> Member Queries</CardTitle><CardDescription className="text-zinc-500">Answer questions from members.</CardDescription></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {queries.length > 0 ? queries.map((q: any) => (
                                    <div key={q.id || q._id} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs text-zinc-500">{new Date(q.createdAt).toLocaleDateString()}</span>
                                                    {q.resolved ? <Badge variant="secondary" className="bg-green-500/10 text-green-500 ml-2 border-green-500/20">Responded</Badge> : <Badge variant="outline" className="text-yellow-500 border-yellow-500/20">Pending</Badge>}
                                                </div>
                                                <div className="font-semibold text-zinc-200">{q.userName} <span className="text-xs font-normal text-zinc-500">({q.userEmail})</span></div>
                                                <p className="text-sm mt-2 font-medium text-zinc-100 bg-zinc-900/50 p-3 rounded-md border border-zinc-800/50">{q.message}</p>
                                                {q.reply && (
                                                    <div className="mt-2 pl-4 border-l-2 border-cyan-500/50 text-sm text-zinc-400">
                                                        <span className="font-semibold text-cyan-500 text-xs block mb-1">Your Reply:</span>
                                                        {q.reply}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                {!q.resolved && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" onClick={() => setReplyingFeedback(q)} className="bg-cyan-600 hover:bg-cyan-700 text-white border-none">Reply</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
                                                            <DialogHeader><DialogTitle>Reply to {q.userName}</DialogTitle></DialogHeader>
                                                            <div className="py-4">
                                                                <p className="text-sm text-zinc-400 mb-2 italic">"{q.message}"</p>
                                                                <textarea
                                                                    className="w-full p-2 border rounded-md bg-zinc-950 border-zinc-800 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                                    rows={4}
                                                                    placeholder="Type your answer here..."
                                                                    value={replyText}
                                                                    onChange={e => setReplyText(e.target.value)}
                                                                />
                                                            </div>
                                                            <DialogFooter><Button onClick={handleReply} className="bg-cyan-600 hover:bg-cyan-700">Send Response</Button></DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-zinc-500">
                                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                        No pending queries found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader><CardTitle className="text-zinc-100">User Directory</CardTitle><CardDescription className="text-zinc-500">Manage user access and adjust stats manually.</CardDescription></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                        <TableHead className="text-zinc-400">User Details</TableHead>
                                        <TableHead className="text-zinc-400">Role</TableHead>
                                        <TableHead className="text-zinc-400">Streak (Cur/Best)</TableHead>
                                        <TableHead className="text-right text-zinc-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((u: any) => (
                                        <TableRow key={u.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                            <TableCell>
                                                <div className="font-semibold text-zinc-200">{u.name}</div>
                                                <div className="text-xs text-zinc-500">{u.email}</div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline" className="border-zinc-700 text-zinc-400">{u.role}</Badge></TableCell>
                                            <TableCell className="font-mono text-sm text-zinc-300">{u.stats?.currentStreak || 0} / {u.stats?.longestStreak || 0}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800" onClick={() => setEditingUser(u)}><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border-zinc-800">
                                                        <DialogHeader>
                                                            <DialogTitle>Edit User Profile</DialogTitle>
                                                            <DialogDescription className="text-zinc-400">Make changes to user profile and stats here.</DialogDescription>
                                                        </DialogHeader>
                                                        {editingUser && (
                                                            <div className="grid gap-4 py-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-400">Full Name</Label>
                                                                    <Input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-zinc-400">Current Streak</Label>
                                                                        <Input type="number" value={editingUser.stats?.currentStreak || 0} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats, currentStreak: e.target.value } })} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-zinc-400">Longest Streak</Label>
                                                                        <Input type="number" value={editingUser.stats?.longestStreak || 0} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats, longestStreak: e.target.value } })} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-400">Skills (comma separated)</Label>
                                                                    <Input value={editingUser.skills ? (Array.isArray(editingUser.skills) ? editingUser.skills.join(', ') : editingUser.skills) : ''} onChange={e => setEditingUser({ ...editingUser, skills: e.target.value.split(',') })} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <DialogFooter>
                                                            <Button onClick={handleUpdateUser} className="bg-cyan-600 hover:bg-cyan-700">Save changes</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline" className="text-yellow-500 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10" onClick={() => setAwardingUser(u)}>
                                                            <Trophy className="w-3 h-3 mr-1" /> Award
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
                                                        <DialogHeader><DialogTitle>Award Achievement to {u.name}</DialogTitle></DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="space-y-2"><Label className="text-zinc-400">Title</Label><Input placeholder="e.g. Hackathon Winner" value={awardData.title} onChange={e => setAwardData({ ...awardData, title: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                            <div className="space-y-2"><Label className="text-zinc-400">Description</Label><Input placeholder="Reason for award..." value={awardData.description} onChange={e => setAwardData({ ...awardData, description: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-400">Type</Label>
                                                                    <select className="w-full p-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100" value={awardData.type} onChange={e => setAwardData({ ...awardData, type: e.target.value })}>
                                                                        <option value="badge">Badge</option>
                                                                        <option value="certificate">Certificate</option>
                                                                        <option value="medal">Medal</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-400">Icon</Label>
                                                                    <select className="w-full p-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100" value={awardData.icon} onChange={e => setAwardData({ ...awardData, icon: e.target.value })}>
                                                                        <option value="trophy">Trophy 🏆</option>
                                                                        <option value="star">Star ⭐</option>
                                                                        <option value="medal">Medal 🥇</option>
                                                                        <option value="ribbon">Ribbon 🎗️</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <DialogFooter><Button onClick={handleGiveAward} className="bg-yellow-600 hover:bg-yellow-700">Award Achievement</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)} className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50"><Trash2 className="w-3 h-3" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-zinc-100">Project Master List</CardTitle>
                            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                                {['all', 'pending', 'approved', 'rejected'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterStatus === s ? 'bg-cyan-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                    >
                                        {s.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                        <TableHead className="text-zinc-400">Project</TableHead>
                                        <TableHead className="text-zinc-400">Repo / Demo</TableHead>
                                        <TableHead className="text-zinc-400">Status</TableHead>
                                        <TableHead className="text-right text-zinc-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.map((p: any) => (
                                        <TableRow key={p.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                            <TableCell>
                                                <div className="font-semibold text-zinc-200">{p.title}</div>
                                                <div className="text-xs text-zinc-500 line-clamp-1">{p.description}</div>
                                            </TableCell>
                                            <TableCell className="text-xs text-blue-400">
                                                <a href={p.repoLink} className="hover:underline mr-2" target="_blank">Repository</a>
                                                <a href={p.demoLink} className="hover:underline" target="_blank">Live Demo</a>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={p.status === 'approved' ? 'default' : p.status === 'rejected' ? 'destructive' : 'secondary'}
                                                    className={`${p.status === 'pending' ? 'animate-pulse bg-yellow-500/20 text-yellow-500 border-yellow-500/20' : ''} ${p.status === 'approved' ? 'bg-green-500/20 text-green-500 border-green-500/20 hover:bg-green-500/30' : ''} ${p.status === 'rejected' ? 'bg-red-500/20 text-red-500 border-red-500/20 hover:bg-red-500/30' : ''}`}
                                                >
                                                    {p.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" onClick={() => setEditingProject(p)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"><Edit className="w-4 h-4" /></Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border-zinc-800">
                                                        <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
                                                        {editingProject && (
                                                            <div className="grid gap-4 py-4">
                                                                <div className="space-y-2"><Label className="text-zinc-400">Title</Label><Input value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                                <div className="space-y-2"><Label className="text-zinc-400">Description</Label><Input value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                                <div className="space-y-2"><Label className="text-zinc-400">Repo Link</Label><Input value={editingProject.repoLink} onChange={e => setEditingProject({ ...editingProject, repoLink: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                                <div className="space-y-2"><Label className="text-zinc-400">Demo Link</Label><Input value={editingProject.demoLink} onChange={e => setEditingProject({ ...editingProject, demoLink: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                                <div className="space-y-2"><Label className="text-zinc-400">LinkedIn Post</Label><Input value={editingProject.linkedInPostLink} onChange={e => setEditingProject({ ...editingProject, linkedInPostLink: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                            </div>
                                                        )}
                                                        <DialogFooter><Button onClick={handleUpdateProject} className="bg-cyan-600 hover:bg-cyan-700">Save Project</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button size="icon" variant="ghost" className="text-green-500 hover:bg-green-500/10" onClick={() => handleProjectStatus(p.id, 'approved')}><CheckCircle className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => handleProjectStatus(p.id, 'rejected')}><XCircle className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredProjects.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-zinc-500">No projects matching filter.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Feedback Tab (General) */}
                <TabsContent value="feedback">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader><CardTitle className="text-zinc-100">User Feedback</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {generalFeedback.map((f: any) => (
                                    <div key={f.id || f._id} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant={f.type === 'bug' ? 'destructive' : f.type === 'query' ? 'outline' : 'default'} className={f.type === 'query' ? 'border-primary text-primary' : ''}>
                                                        {f.type.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-xs text-zinc-500">{new Date(f.createdAt).toLocaleDateString()}</span>
                                                    {f.resolved && <Badge variant="secondary" className="bg-green-500/10 text-green-500 ml-2 border-green-500/20">Resolved</Badge>}
                                                </div>
                                                <div className="font-semibold text-zinc-200">{f.userName} <span className="text-xs font-normal text-zinc-500">({f.userEmail})</span></div>
                                                <p className="text-sm mt-1 font-medium text-zinc-300">{f.message}</p>
                                                {f.reply && (
                                                    <div className="mt-2 pl-4 border-l-2 border-cyan-500/50 text-sm text-zinc-400">
                                                        <span className="font-semibold text-cyan-500 text-xs block mb-1">Reply:</span>
                                                        {f.reply}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {!f.resolved && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" onClick={() => setReplyingFeedback(f)} className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700">Reply</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
                                                            <DialogHeader><DialogTitle>Reply to {f.userName}</DialogTitle></DialogHeader>
                                                            <div className="py-4">
                                                                <p className="text-sm text-zinc-400 mb-2">"{f.message}"</p>
                                                                <textarea
                                                                    className="w-full p-2 border rounded-md bg-zinc-950 border-zinc-800 text-zinc-100"
                                                                    rows={4}
                                                                    placeholder="Type your reply..."
                                                                    value={replyText}
                                                                    onChange={e => setReplyText(e.target.value)}
                                                                />
                                                            </div>
                                                            <DialogFooter><Button onClick={handleReply} className="bg-cyan-600 hover:bg-cyan-700">Send Reply</Button></DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs >
        </div >
    );
};

export default AdminDashboard;
