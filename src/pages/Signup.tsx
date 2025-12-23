import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            toast({
                title: "Signup Successful",
                description: "Welcome to EyeQ!",
            });
            navigate('/dashboard');
        } catch (error: any) {
            toast({
                title: "Signup Failed",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Join EyeQ Vision Vibe</CardTitle>
                    <CardDescription>Create your account today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">Sign Up</Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>Login</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
