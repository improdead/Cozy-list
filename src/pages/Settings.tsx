import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, LineChart, Calendar, Settings2, User, Shield, LogOut, Sparkles } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import SubscriptionManager from "@/components/SubscriptionManager";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // User profile state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [language, setLanguage] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [timeFormat, setTimeFormat] = useState('');
  const [timezone, setTimezone] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setEmail(user.email || '');
          
          // Fetch additional user data from profiles table if available
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('name, bio')
            .eq('id', user.id)
            .single();
            
          if (profileData && !profileError) {
            setName(profileData.name || '');
            setBio(profileData.bio || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Update user profile in the database
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          name,
          bio,
          updated_at: new Date().toISOString()
        });
        
      if (updateError) throw updateError;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating your password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An error occurred while signing out',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleConnectGoogle = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/settings`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An error occurred with Google login',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleConnectApple = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/settings`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'An error occurred with Apple login',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar with logo */}
        <div className="hidden md:flex w-64 flex-col bg-white/90 border-r border-border p-4 h-screen">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="relative w-20 h-20">
              <img 
                src="/lovable-uploads/d8bfce19-2f0d-46f6-9fbe-924f64b656e2.png" 
                alt="Cozy Task Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-patrick text-primary">Cozy Task</span>
          </div>
          <nav className="space-y-2">
            <Link 
              to="/dashboard" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/dashboard" ? "bg-secondary/50" : "text-muted-foreground"
              )}
            >
              <Layout className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              to="/analytics" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/analytics" ? "bg-secondary/50" : "text-muted-foreground"
              )}
            >
              <LineChart className="w-5 h-5" />
              Analytics
            </Link>
            <Link 
              to="/calendar" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/calendar" ? "bg-secondary/50" : "text-muted-foreground"
              )}
            >
              <Calendar className="w-5 h-5" />
              Calendar
            </Link>
            <Link 
              to="/settings"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/settings" ? "bg-secondary/50" : "text-muted-foreground"
              )}
            >
              <Settings2 className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-patrick text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="account" className="space-y-4">
              <TabsList className="bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="subscription" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Premium
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your account information and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          placeholder="Tell us about yourself" 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                      
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-4">
                  <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                    <CardHeader>
                      <CardTitle>Password Settings</CardTitle>
                      <CardDescription>Update your password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                    <CardHeader>
                      <CardTitle>Connected Accounts</CardTitle>
                      <CardDescription>Manage your connected social accounts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-sm text-muted-foreground">Connect your Google account</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleConnectGoogle}
                          disabled={loading}
                        >
                          Connect
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                              <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.92 12.29 4.24 17.2 6 19.9c.89 1.29 1.93 2.74 3.29 2.69s1.82-.89 3.41-.89 2 .89 3.41.85 2.3-1.29 3.15-2.58a11.48 11.48 0 0 0 1.42-2.93 4.4 4.4 0 0 1-2.72-4.4z" fill="currentColor"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Apple</p>
                            <p className="text-sm text-muted-foreground">Connect your Apple account</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleConnectApple}
                          disabled={loading}
                        >
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                    <CardHeader>
                      <CardTitle>Account Management</CardTitle>
                      <CardDescription>Manage your account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Sign Out</p>
                          <p className="text-sm text-muted-foreground">Sign out from all devices</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSignOut}
                          disabled={loading}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-red-600">Delete Account</p>
                          <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="subscription">
                <div className="space-y-4">
                  <SubscriptionManager onSubscriptionChange={() => {
                    // Refresh the page or update UI as needed when subscription changes
                    toast({
                      title: "Subscription Updated",
                      description: "Your subscription status has been updated"
                    });
                  }} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
