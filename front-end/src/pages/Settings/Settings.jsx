import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const Settings = () => {
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState({
    // General Settings
    username: 'Max Defrance',
    email: 'max.defrance@email.com',
    timezone: 'America/New_York',
    language: 'English',
    
    // Reading Preferences
    defaultView: 'grid',
    booksPerPage: 20,
    autoMarkAsRead: true,
    trackReadingTime: true,
    showProgressInSidebar: true,
    
    // Notifications
    dailyReminder: true,
    goalReminders: true,
    newBookAlerts: false,
    emailNotifications: true,
    
    // Privacy
    profileVisibility: 'public',
    showReadingActivity: true,
    allowRecommendations: true,
    
    // Reading Goals
    yearlyGoal: 50,
    dailyPageGoal: 50,
    reminderTime: '19:00',
    
    // Display
    theme: 'light',
    fontSize: 'medium',
    fontFamily: 'Inter',
    compactMode: false
  })

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'reading', label: 'Reading Preferences', icon: '📚' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'goals', label: 'Reading Goals', icon: '🎯' },
    { id: 'display', label: 'Display', icon: '🎨' }
  ]

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const SettingItem = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
      <div className="flex-1">
        <h4 
          className="text-sm font-medium"
          style={{ color: isDark ? 'white' : '#1f2937' }}
        >
          {label}
        </h4>
        {description && (
          <p 
            className="text-xs mt-1"
            style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
          >
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  )

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 dark:bg-slate-800 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: isDark ? 'white' : '#1f2937' }}
        >
          Settings
        </h1>
        <p 
          className="text-sm"
          style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}
        >
          Customize your reading experience
        </p>
      </div>

      <div className="flex gap-8">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 transition-colors">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
            
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={settings.username}
                        onChange={(e) => updateSetting('username', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">GMT</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Español</option>
                        <option value="French">Français</option>
                        <option value="German">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reading Preferences */}
            {activeSection === 'reading' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Reading Preferences</h2>
                
                <div className="space-y-4">
                  <SettingItem 
                    label="Default Library View" 
                    description="Choose how books are displayed by default"
                  >
                    <select
                      value={settings.defaultView}
                      onChange={(e) => updateSetting('defaultView', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="grid">Grid View</option>
                      <option value="list">List View</option>
                    </select>
                  </SettingItem>

                  <SettingItem 
                    label="Books Per Page" 
                    description="Number of books to show per page"
                  >
                    <select
                      value={settings.booksPerPage}
                      onChange={(e) => updateSetting('booksPerPage', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </SettingItem>

                  <SettingItem 
                    label="Auto-mark as Read" 
                    description="Automatically mark books as finished when you reach 100% progress"
                  >
                    <ToggleSwitch 
                      enabled={settings.autoMarkAsRead}
                      onChange={(value) => updateSetting('autoMarkAsRead', value)}
                    />
                  </SettingItem>

                  <SettingItem 
                    label="Track Reading Time" 
                    description="Keep track of how long you spend reading"
                  >
                    <ToggleSwitch 
                      enabled={settings.trackReadingTime}
                      onChange={(value) => updateSetting('trackReadingTime', value)}
                    />
                  </SettingItem>

                  <SettingItem 
                    label="Show Progress in Sidebar" 
                    description="Display currently reading progress in the sidebar"
                  >
                    <ToggleSwitch 
                      enabled={settings.showProgressInSidebar}
                      onChange={(value) => updateSetting('showProgressInSidebar', value)}
                    />
                  </SettingItem>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
                
                <div className="space-y-4">
                  <SettingItem 
                    label="Daily Reading Reminder" 
                    description="Get a daily reminder to read"
                  >
                    <ToggleSwitch 
                      enabled={settings.dailyReminder}
                      onChange={(value) => updateSetting('dailyReminder', value)}
                    />
                  </SettingItem>

                  <SettingItem 
                    label="Goal Reminders" 
                    description="Notifications about your reading goals progress"
                  >
                    <ToggleSwitch 
                      enabled={settings.goalReminders}
                      onChange={(value) => updateSetting('goalReminders', value)}
                    />
                  </SettingItem>

                  <SettingItem 
                    label="New Book Alerts" 
                    description="Get notified about new book releases from your favorite authors"
                  >
                    <ToggleSwitch 
                      enabled={settings.newBookAlerts}
                      onChange={(value) => updateSetting('newBookAlerts', value)}
                    />
                  </SettingItem>

                  <SettingItem 
                    label="Email Notifications" 
                    description="Receive notifications via email"
                  >
                    <ToggleSwitch 
                      enabled={settings.emailNotifications}
                      onChange={(value) => updateSetting('emailNotifications', value)}
                    />
                  </SettingItem>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeSection === 'privacy' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <SettingItem 
                    label="Profile Visibility" 
                    description="Control who can see your reading profile"
                  >
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </SettingItem>

                  <SettingItem 
                    label="Show Reading Activity" 
                    description="Allow others to see what you're currently reading"
                  >
                    <ToggleSwitch 
                      enabled={settings.showReadingActivity}
                      onChange={(value) => updateSetting('showReadingActivity', value)}
                    />
                  </SettingItem>

                  <SettingItem 
                    label="Allow Recommendations" 
                    description="Use your reading history to provide personalized recommendations"
                  >
                    <ToggleSwitch 
                      enabled={settings.allowRecommendations}
                      onChange={(value) => updateSetting('allowRecommendations', value)}
                    />
                  </SettingItem>
                </div>
              </div>
            )}

            {/* Reading Goals */}
            {activeSection === 'goals' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Reading Goals</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Book Goal</label>
                      <input
                        type="number"
                        value={settings.yearlyGoal}
                        onChange={(e) => updateSetting('yearlyGoal', parseInt(e.target.value))}
                        min="1"
                        max="365"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Number of books to read this year</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Page Goal</label>
                      <input
                        type="number"
                        value={settings.dailyPageGoal}
                        onChange={(e) => updateSetting('dailyPageGoal', parseInt(e.target.value))}
                        min="1"
                        max="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Pages to read each day</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Reminder Time</label>
                    <input
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => updateSetting('reminderTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">When to send daily reading reminders</p>
                  </div>
                </div>
              </div>
            )}

            {/* Display */}
            {activeSection === 'display' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Display Settings</h2>
                
                <div className="space-y-4">
                  <SettingItem 
                    label="Theme" 
                    description="Choose your preferred color theme"
                  >
                    <select
                      value={settings.theme}
                      onChange={(e) => updateSetting('theme', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </SettingItem>

                  <SettingItem 
                    label="Font Size" 
                    description="Adjust text size throughout the application"
                  >
                    <select
                      value={settings.fontSize}
                      onChange={(e) => updateSetting('fontSize', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </SettingItem>

                  <SettingItem 
                    label="Font Family" 
                    description="Choose your preferred font"
                  >
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => updateSetting('fontFamily', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </SettingItem>

                  <SettingItem 
                    label="Compact Mode" 
                    description="Use a more compact layout to fit more content"
                  >
                    <ToggleSwitch 
                      enabled={settings.compactMode}
                      onChange={(value) => updateSetting('compactMode', value)}
                    />
                  </SettingItem>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Settings are automatically saved</p>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    Export Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings