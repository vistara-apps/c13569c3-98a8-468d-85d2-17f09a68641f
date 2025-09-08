'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ArrowLeft, Bell, Clock, Tag, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NotificationPreferences } from '@/lib/types';
import { getUser, updateUser } from '@/lib/database';

export default function SettingsPage() {
  const { user, authenticated } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    morningReminder: true,
    eveningReminder: true,
    customTimes: ['06:00', '18:00'],
    duaTypes: ['daily', 'morning', 'evening'],
  });

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
      return;
    }

    loadUserPreferences();
  }, [authenticated, user]);

  const loadUserPreferences = async () => {
    if (!user?.id) return;

    try {
      const userData = await getUser(user.id);
      if (userData?.notificationPreferences) {
        setPreferences(userData.notificationPreferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await updateUser(user.id, {
        notificationPreferences: preferences,
      });
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addCustomTime = () => {
    const time = prompt('Enter time (HH:MM format):');
    if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      setPreferences(prev => ({
        ...prev,
        customTimes: [...prev.customTimes, time],
      }));
    }
  };

  const removeCustomTime = (timeToRemove: string) => {
    setPreferences(prev => ({
      ...prev,
      customTimes: prev.customTimes.filter(time => time !== timeToRemove),
    }));
  };

  const toggleDuaType = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      duaTypes: prev.duaTypes.includes(type)
        ? prev.duaTypes.filter(t => t !== type)
        : [...prev.duaTypes, type],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-md md:max-w-lg mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md md:max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="glass-card p-6 rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-islamic-green" />
            <h2 className="text-lg font-semibold text-text">Profile</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Email
              </label>
              <p className="text-text">{user?.email?.address || 'Not connected'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Wallet
              </label>
              <p className="text-text font-mono text-sm">
                {user?.wallet?.address ? 
                  `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                  'Not connected'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6 rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-islamic-green" />
            <h2 className="text-lg font-semibold text-text">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text">Enable Notifications</span>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.enabled ? 'bg-islamic-green' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text">Morning Reminders</span>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, morningReminder: !prev.morningReminder }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.morningReminder ? 'bg-islamic-green' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.morningReminder ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text">Evening Reminders</span>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, eveningReminder: !prev.eveningReminder }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.eveningReminder ? 'bg-islamic-green' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.eveningReminder ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Times */}
        <div className="glass-card p-6 rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-islamic-green" />
            <h2 className="text-lg font-semibold text-text">Custom Times</h2>
          </div>

          <div className="space-y-3">
            {preferences.customTimes.map((time, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-text font-medium">{time}</span>
                <button
                  onClick={() => removeCustomTime(time)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              onClick={addCustomTime}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-muted hover:border-islamic-green hover:text-islamic-green transition-colors"
            >
              + Add Custom Time
            </button>
          </div>
        </div>

        {/* Dua Types */}
        <div className="glass-card p-6 rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-islamic-green" />
            <h2 className="text-lg font-semibold text-text">Dua Categories</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {['daily', 'morning', 'evening', 'travel', 'food', 'sleep', 'protection'].map(type => (
              <button
                key={type}
                onClick={() => toggleDuaType(type)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  preferences.duaTypes.includes(type)
                    ? 'bg-islamic-green text-white'
                    : 'bg-gray-100 text-muted hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-card p-6 rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-islamic-green" />
            <h2 className="text-lg font-semibold text-text">Privacy</h2>
          </div>

          <div className="space-y-3 text-sm text-muted">
            <p>
              Your spiritual content is stored securely and can optionally be saved to IPFS for decentralized access.
            </p>
            <p>
              We never share your personal information or spiritual practices with third parties.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={savePreferences}
          disabled={saving}
          className="w-full btn-primary py-3 font-semibold"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
