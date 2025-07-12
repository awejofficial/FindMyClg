
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Trash2, Settings, AlertCircle, TrendingDown, Calendar, GraduationCap } from "lucide-react";
import {
  createUserAlert,
  fetchUserAlerts,
  updateUserAlert,
  fetchAllCollegeNames,
  fetchAvailableBranches,
  fetchAvailableCategories,
  type UserAlert
} from "@/services/databaseService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const NotificationsPage = () => {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [availableColleges, setAvailableColleges] = useState<string[]>([]);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const [newAlert, setNewAlert] = useState({
    college_name: '',
    branch_name: '',
    category: '',
    alert_type: 'cutoff_drop',
    threshold_value: ''
  });

  useEffect(() => {
    loadAlerts();
    loadFormData();
  }, []);

  const loadAlerts = async () => {
    try {
      const userAlerts = await fetchUserAlerts();
      setAlerts(userAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load your alerts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [colleges, branches, categories] = await Promise.all([
        fetchAllCollegeNames(),
        fetchAvailableBranches(),
        fetchAvailableCategories()
      ]);
      
      setAvailableColleges(colleges);
      setAvailableBranches(branches);
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Failed to load form data:', error);
    }
  };

  const handleCreateAlert = async () => {
    if (!newAlert.college_name || !newAlert.alert_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const alertData = {
        college_name: newAlert.college_name,
        branch_name: newAlert.branch_name || undefined,
        category: newAlert.category || undefined,
        alert_type: newAlert.alert_type,
        threshold_value: newAlert.threshold_value ? parseFloat(newAlert.threshold_value) : undefined,
        is_active: true
      };

      const createdAlert = await createUserAlert(alertData);
      
      if (createdAlert) {
        setAlerts([createdAlert, ...alerts]);
        setNewAlert({
          college_name: '',
          branch_name: '',
          category: '',
          alert_type: 'cutoff_drop',
          threshold_value: ''
        });
        setShowCreateForm(false);
        
        toast({
          title: "Alert Created",
          description: "Your notification alert has been set up successfully"
        });
      }
    } catch (error) {
      console.error('Failed to create alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive"
      });
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const success = await updateUserAlert(alertId, { is_active: isActive });
      
      if (success) {
        setAlerts(alerts.map(alert => 
          alert.id === alertId ? { ...alert, is_active: isActive } : alert
        ));
        
        toast({
          title: isActive ? "Alert Activated" : "Alert Deactivated",
          description: `Your alert has been ${isActive ? 'activated' : 'deactivated'}`
        });
      }
    } catch (error) {
      console.error('Failed to update alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive"
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const success = await updateUserAlert(alertId, { is_active: false });
      
      if (success) {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
        
        toast({
          title: "Alert Deleted",
          description: "Your alert has been removed"
        });
      }
    } catch (error) {
      console.error('Failed to delete alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive"
      });
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'cutoff_drop':
        return <TrendingDown className="h-4 w-4" />;
      case 'deadline_reminder':
        return <Calendar className="h-4 w-4" />;
      case 'new_college':
        return <GraduationCap className="h-4 w-4" />;
      case 'fee_change':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertTypeLabel = (alertType: string) => {
    switch (alertType) {
      case 'cutoff_drop':
        return 'Cutoff Drop Alert';
      case 'deadline_reminder':
        return 'Deadline Reminder';
      case 'new_college':
        return 'New College Alert';
      case 'fee_change':
        return 'Fee Change Alert';
      default:
        return alertType;
    }
  };

  const getAlertTypeColor = (alertType: string) => {
    switch (alertType) {
      case 'cutoff_drop':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'deadline_reminder':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'new_college':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fee_change':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Smart Notifications & Alerts</h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with cutoff changes, deadlines, and important college information
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Create Alert Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <Button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Alert
                </Button>
              </div>
            </CardHeader>
            
            {showCreateForm && (
              <CardContent className="border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="college">College *</Label>
                    <Select 
                      value={newAlert.college_name} 
                      onValueChange={(value) => setNewAlert({...newAlert, college_name: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a college" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColleges.map((college) => (
                          <SelectItem key={college} value={college}>
                            {college}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="alertType">Alert Type *</Label>
                    <Select 
                      value={newAlert.alert_type} 
                      onValueChange={(value) => setNewAlert({...newAlert, alert_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cutoff_drop">Cutoff Drop Alert</SelectItem>
                        <SelectItem value="deadline_reminder">Deadline Reminder</SelectItem>
                        <SelectItem value="new_college">New College Alert</SelectItem>
                        <SelectItem value="fee_change">Fee Change Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="branch">Branch (Optional)</Label>
                    <Select 
                      value={newAlert.branch_name} 
                      onValueChange={(value) => setNewAlert({...newAlert, branch_name: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBranches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category (Optional)</Label>
                    <Select 
                      value={newAlert.category} 
                      onValueChange={(value) => setNewAlert({...newAlert, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newAlert.alert_type === 'cutoff_drop' && (
                    <div>
                      <Label htmlFor="threshold">Threshold Score (Optional)</Label>
                      <Input
                        id="threshold"
                        type="number"
                        placeholder="e.g., 85"
                        value={newAlert.threshold_value}
                        onChange={(e) => setNewAlert({...newAlert, threshold_value: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button onClick={handleCreateAlert}>
                    Create Alert
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Your Active Alerts ({alerts.filter(a => a.is_active).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Alerts Set</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first alert to stay updated with college information
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create Your First Alert
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-4 border rounded-lg ${alert.is_active ? 'bg-background' : 'bg-muted/50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getAlertIcon(alert.alert_type || 'cutoff_drop')}
                            <h3 className="font-medium">{alert.college_name}</h3>
                            <Badge className={getAlertTypeColor(alert.alert_type || 'cutoff_drop')}>
                              {getAlertTypeLabel(alert.alert_type || 'cutoff_drop')}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            {alert.branch_name && (
                              <p><strong>Branch:</strong> {alert.branch_name}</p>
                            )}
                            {alert.category && (
                              <p><strong>Category:</strong> {alert.category}</p>
                            )}
                            {alert.threshold_value && (
                              <p><strong>Threshold:</strong> {alert.threshold_value}</p>
                            )}
                            <p><strong>Created:</strong> {new Date(alert.created_at || '').toLocaleDateString()}</p>
                            {alert.last_triggered && (
                              <p><strong>Last Triggered:</strong> {new Date(alert.last_triggered).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={alert.is_active || false}
                              onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                            />
                            <span className="text-sm">
                              {alert.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>How Alerts Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    Cutoff Drop Alerts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when cutoff scores decrease for your preferred college and branch combinations.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    Deadline Reminders
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders for important application deadlines and counseling dates.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    New College Alerts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Be the first to know when new colleges are added to the DSE system.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                    Fee Change Alerts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Stay updated with any changes in fee structures for your shortlisted colleges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
