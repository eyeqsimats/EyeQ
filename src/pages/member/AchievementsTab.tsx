import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/api/axios';
import { Trophy, Medal, Star, Award, Scroll } from 'lucide-react';
import { motion } from 'framer-motion';

const AchievementsTab = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const { data } = await api.get('/achievements/my');
            setAchievements(data);
        } catch (error) {
            console.error("Failed to fetch achievements");
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'trophy': return <Trophy className="w-8 h-8 text-yellow-500" />;
            case 'star': return <Star className="w-8 h-8 text-yellow-400" />;
            case 'medal': return <Medal className="w-8 h-8 text-orange-500" />;
            case 'ribbon': return <Award className="w-8 h-8 text-red-500" />;
            default: return <Trophy className="w-8 h-8 text-primary" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-600">Total Awards</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold flex items-center gap-2">{achievements.length} <Trophy className="w-5 h-5 text-yellow-500" /></div></CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {achievements.length > 0 ? achievements.map((a: any, i: number) => (
                    <motion.div
                        key={a.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className={`text-center h-full hover:shadow-lg transition-all border-l-4 ${a.type === 'certificate' ? 'border-l-blue-500' : 'border-l-yellow-500'}`}>
                            <CardContent className="pt-6 flex flex-col items-center gap-3">
                                <div className={`p-4 rounded-full ${a.type === 'certificate' ? 'bg-blue-500/10' : 'bg-yellow-500/10'}`}>
                                    {a.type === 'certificate' ? <Scroll className="w-8 h-8 text-blue-500" /> : getIcon(a.icon)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{a.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                                </div>
                                <Badge variant="secondary" className="mt-auto">{new Date(a.awardedAt).toLocaleDateString()}</Badge>
                            </CardContent>
                        </Card>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground space-y-4">
                        <div className="bg-secondary/50 p-6 rounded-full w-fit mx-auto"><Trophy className="w-12 h-12 opacity-20" /></div>
                        <p>No achievements yet. Keep contributing to earn badges!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsTab;
