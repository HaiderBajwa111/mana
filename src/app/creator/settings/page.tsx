"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  User,
  Shield,
  Palette,
  Globe,
  Save,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    orderUpdates: true,
    newFeatures: true,
    marketing: false,
    quotes: true,
    progressUpdates: true,
    completion: true,
  });

  const [dashboard, setDashboard] = useState({
    defaultView: "overview",
    autoRefresh: true,
    refreshInterval: "5",
    showQuickActions: true,
    showRecentActivity: true,
    showStats: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowQuotes: true,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC",
    currency: "USD",
    units: "metric",
    theme: "system",
  });

  const router = useRouter();

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleDashboardChange = (key: string, value: string | boolean) => {
    setDashboard((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving settings...", {
      notifications,
      dashboard,
      privacy,
      preferences,
    });
  };

  const handleReset = () => {
    // TODO: Implement reset functionality
    console.log("Resetting settings...");
  };

  return (
    <div className="min-h-[600px] px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and notifications
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50 border-blue-200">
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600"
          >
            <Palette className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600"
          >
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600"
          >
            <Globe className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Channels
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("email", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("push", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("sms", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>
                Choose which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Status changes
                    </p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("orderUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="quotes">New Quotes</Label>
                    <p className="text-sm text-muted-foreground">From makers</p>
                  </div>
                  <Switch
                    id="quotes"
                    checked={notifications.quotes}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("quotes", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="progress-updates">Progress Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Print progress
                    </p>
                  </div>
                  <Switch
                    id="progress-updates"
                    checked={notifications.progressUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("progressUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="completion">Print Completion</Label>
                    <p className="text-sm text-muted-foreground">When ready</p>
                  </div>
                  <Switch
                    id="completion"
                    checked={notifications.completion}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("completion", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-features">New Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Platform updates
                    </p>
                  </div>
                  <Switch
                    id="new-features"
                    checked={notifications.newFeatures}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("newFeatures", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Promotions & offers
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={notifications.marketing}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("marketing", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Dashboard Preferences
              </CardTitle>
              <CardDescription>
                Customize your dashboard experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-view">Default Dashboard View</Label>
                <Select
                  value={dashboard.defaultView}
                  onValueChange={(value) =>
                    handleDashboardChange("defaultView", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="prints">My Prints</SelectItem>
                    <SelectItem value="activity">Recent Activity</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data
                  </p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={dashboard.autoRefresh}
                  onCheckedChange={(checked) =>
                    handleDashboardChange("autoRefresh", checked)
                  }
                />
              </div>

              {dashboard.autoRefresh && (
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Refresh Interval</Label>
                  <Select
                    value={dashboard.refreshInterval}
                    onValueChange={(value) =>
                      handleDashboardChange("refreshInterval", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every minute</SelectItem>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Dashboard Widgets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="quick-actions">Quick Actions</Label>
                      <p className="text-sm text-muted-foreground">
                        Upload, create, etc.
                      </p>
                    </div>
                    <Switch
                      id="quick-actions"
                      checked={dashboard.showQuickActions}
                      onCheckedChange={(checked) =>
                        handleDashboardChange("showQuickActions", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="recent-activity">Recent Activity</Label>
                      <p className="text-sm text-muted-foreground">
                        Latest updates
                      </p>
                    </div>
                    <Switch
                      id="recent-activity"
                      checked={dashboard.showRecentActivity}
                      onCheckedChange={(checked) =>
                        handleDashboardChange("showRecentActivity", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="stats">Statistics</Label>
                      <p className="text-sm text-muted-foreground">
                        Print counts, etc.
                      </p>
                    </div>
                    <Switch
                      id="stats"
                      checked={dashboard.showStats}
                      onCheckedChange={(checked) =>
                        handleDashboardChange("showStats", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(value) =>
                    handlePrivacyChange("profileVisibility", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      Public - Anyone can see
                    </SelectItem>
                    <SelectItem value="makers">Makers only</SelectItem>
                    <SelectItem value="private">Private - Only you</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-email">Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow makers to see your email
                      </p>
                    </div>
                    <Switch
                      id="show-email"
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("showEmail", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-phone">Show Phone Number</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow makers to see your phone
                      </p>
                    </div>
                    <Switch
                      id="show-phone"
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("showPhone", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Communication</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-messages">
                        Allow Direct Messages
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Makers can message you directly
                      </p>
                    </div>
                    <Switch
                      id="allow-messages"
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("allowMessages", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-quotes">Allow Quote Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Makers can send you quotes
                      </p>
                    </div>
                    <Switch
                      id="allow-quotes"
                      checked={privacy.allowQuotes}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("allowQuotes", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Preferences
              </CardTitle>
              <CardDescription>
                Set your language, timezone, and other preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      handlePreferenceChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) =>
                      handlePreferenceChange("timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="CST">Central Time</SelectItem>
                      <SelectItem value="MST">Mountain Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      handlePreferenceChange("currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Select
                    value={preferences.units}
                    onValueChange={(value) =>
                      handlePreferenceChange("units", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (mm, cm, m)</SelectItem>
                      <SelectItem value="imperial">
                        Imperial (in, ft, yd)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) =>
                      handlePreferenceChange("theme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role</CardTitle>
              <CardDescription>Switch between Creator and Maker</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => router.push("/maker/dashboard")}
              >
                Switch to Maker
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Unsaved changes</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
