import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/api/axios';
import { useToast } from '@/components/ui/use-toast';
import { MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QueriesTab = () => {
    const { toast } = useToast();
    const [queries, setQueries] = useState([]);
    const [newQuery, setNewQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const { data } = await api.get('/feedback/my');
            setQueries(data.filter((q: any) => q.type === 'query'));
        } catch (error) {
            console.error("Failed to fetch queries");
        }
    };

    const handleSubmit = async () => {
        if (!newQuery.trim()) return;
        setLoading(true);
        try {
            await api.post('/feedback', {
                type: 'query',
                message: newQuery,
                rating: 5 // Default for query
            });
            toast({ title: "Query Sent", description: "An admin will respond shortly." });
            setNewQuery('');
            fetchQueries();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><div className="bg-blue-500/10 p-2 rounded-full"><MessageSquare className="w-5 h-5 text-blue-500" /></div> Ask a Question</CardTitle>
                        <CardDescription>Need help? Send a direct message to the admin team.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Type your question here... e.g. How do I improve my streak?"
                            value={newQuery}
                            onChange={(e) => setNewQuery(e.target.value)}
                            className="bg-secondary min-h-[150px] resize-none border-border"
                        />
                        <Button onClick={handleSubmit} disabled={loading || !newQuery.trim()} className="w-full">
                            {loading ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Query</>}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">My Recent Queries</h3>
                <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {queries.length > 0 ? queries.map((q: any) => (
                        <Card key={q.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <Badge variant={q.resolved ? "secondary" : "outline"} className={q.resolved ? "bg-green-500/10 text-green-500 border-green-500/20" : "text-yellow-500 border-yellow-500/20"}>
                                        {q.resolved ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Replied</> : <><Clock className="w-3 h-3 mr-1" /> Pending</>}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="font-medium text-sm text-foreground">{q.message}</p>
                                {q.reply && (
                                    <div className="bg-secondary/50 p-3 rounded-lg border-l-2 border-primary mt-2">
                                        <p className="text-xs font-semibold text-primary mb-1">Admin Reply:</p>
                                        <p className="text-sm text-muted-foreground">{q.reply}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="text-center py-10 text-muted-foreground">
                            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            No queries yet.
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default QueriesTab;
