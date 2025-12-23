import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/api/axios';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchProjects();
        fetchFeedback();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats");
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users");
        }
    };

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/admin/projects');
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects");
        }
    };

    const fetchFeedback = async () => {
        try {
            const { data } = await api.get('/admin/feedback');
            setFeedbacks(data);
        } catch (error) {
            console.error("Failed to fetch feedback");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleProjectStatus = async (projectId: string, status: string) => {
        try {
            await api.put(`/projects/${projectId}/status`, { status });
            toast({ title: "Updated", description: `Project marked as ${status}` });
            fetchProjects();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast({ title: "User Deleted" });
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats?.totalMembers || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats?.totalProjects || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Today</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats?.dailyActiveUsers || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Top Streak</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">
                            {stats?.streakLeaderboard?.[0]?.currentStreak || 0} 🔥
                        </div>
                        <p className="text-xs text-muted-foreground">{stats?.streakLeaderboard?.[0]?.name || 'No Data'}</p>
                    </CardContent>
                </Card>
            </motion.div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader><CardTitle>Recent Activity (Mock)</CardTitle></CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                    Activity Chart Placeholder
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader><CardTitle>Streak Leaderboard</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {stats?.streakLeaderboard?.map((u: any, i: number) => (
                                        <div key={i} className="flex items-center">
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{u.name}</p>
                                                <p className="text-sm text-muted-foreground">Member</p>
                                            </div>
                                            <div className="ml-auto font-medium">
                                                {u.currentStreak} Days
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* User Management */}
                <TabsContent value="users">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader><CardTitle>Manage Users</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u: any) => (
                                            <TableRow key={u.id}>
                                                <TableCell className="font-medium">{u.name}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>{u.role}</TableCell>
                                                <TableCell>{new Date(u.joinedDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Project Approvals */}
                <TabsContent value="projects">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader><CardTitle>Project Approvals</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Link</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects.map((p: any) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium">{p.title}</TableCell>
                                                <TableCell>User ID: {p.authorUid}</TableCell>
                                                <TableCell>
                                                    <Badge variant={p.status === 'approved' ? 'default' : p.status === 'rejected' ? 'destructive' : 'secondary'}>{p.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <a href={p.repoLink} target="_blank" className="text-blue-500 hover:underline">Repo</a>
                                                </TableCell>
                                                <TableCell className="space-x-2">
                                                    {p.status === 'pending' && (
                                                        <>
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleProjectStatus(p.id, 'approved')}>Approve</Button>
                                                            <Button size="sm" variant="destructive" onClick={() => handleProjectStatus(p.id, 'rejected')}>Reject</Button>
                                                        </>
                                                    )}
                                                    {p.status !== 'pending' && (
                                                        <Button size="sm" variant="outline" onClick={() => handleProjectStatus(p.id, 'pending')}>Reset</Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Feedback Management */}
                <TabsContent value="feedback" className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader><CardTitle>User Feedback</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {feedbacks.length > 0 ? feedbacks.map((f: any) => (
                                        <div key={f.id || f._id} className="p-4 border rounded-lg bg-white flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={f.type === 'bug' ? 'destructive' : f.type === 'suggestion' ? 'secondary' : 'default'}>{f.type}</Badge>
                                                    <span className="text-xs text-muted-foreground">{new Date(f.createdAt || Date.now()).toLocaleDateString()}</span>
                                                </div>
                                                <div className="mb-1">
                                                    <span className="text-sm font-bold text-gray-900">{f.userName || 'Anonymous'}</span>
                                                    <span className="text-xs text-muted-foreground ml-2">({f.userEmail || 'No Email'})</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">{f.message}</p>
                                                <div className="flex gap-1 mt-2">
                                                    {[...Array(f.rating || 0)].map((_, i) => <span key={i}>⭐</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    )) : <p className="text-muted-foreground">No feedback yet.</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

export default AdminDashboard;
