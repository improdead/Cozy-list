import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, LineChart, Calendar, Settings2, User, Bell, Palette, Shield } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const Settings = () => {
  const location = useLocation();
  
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
              to="/" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/" ? "bg-secondary/50" : "text-muted-foreground"
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

            <Tabs defaultValue="account" className="space-y-4">
              <TabsList className="bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Palette className="w-4 h-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your account information and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself" />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what notifications you want to receive.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Task Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize how Cozy Task looks.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Make the interface more compact</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your security preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
