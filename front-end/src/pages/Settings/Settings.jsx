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

  const exportSettings = () => {
    // Create settings object with metadata
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      settings: settings,
      appInfo: {
        name: 'Booksy Library',
        platform: 'Web'
      }
    }

    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2)
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `booksy-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Show success message (you can replace this with a toast notification)
    alert('Settings exported successfully!')
  }

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setSettings({
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
      alert('Settings reset to defaults!')
    }
  }

  const importSettings = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result)
          
          // Validate the imported data
          if (!importedData.settings) {
            alert('Invalid settings file format!')
            return
          }

          // Confirm before importing
          if (window.confirm('Are you sure you want to import these settings? Your current settings will be overwritten.')) {
            setSettings(importedData.settings)
            alert('Settings imported successfully!')
          }
        } catch (error) {
          alert('Error reading settings file. Please make sure it\'s a valid JSON file.')
          console.error('Import error:', error)
        }
      }
      
      reader.readAsText(file)
    }
    
    input.click()
  }

  const sections = [
    { id: 'general', label: 'General',},
    { id: 'reading', label: 'Reading Preferences',},
    { id: 'notifications', label: 'Notifications',},
    { id: 'privacy', label: 'Privacy',},
    { id: 'goals', label: 'Reading Goals',},
    { id: 'display', label: 'Display',}
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
      <div className="flex-1 min-w-0">
        <h4 
          className="text-xs sm:text-sm font-medium truncate"
          style={{ color: isDark ? 'white' : '#1f2937' }}
        >
          {label}
        </h4>
        {description && (
          <p 
            className="text-xs mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-1"
            style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 dark:bg-slate-800 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 
          className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2"
          style={{ color: isDark ? 'white' : '#1f2937' }}
        >
          Settings
        </h1>
        <p 
          className="text-xs sm:text-sm"
          style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}
        >
          Customize your reading experience
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-3 sm:p-4 transition-colors">
            {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-shrink-0 lg:flex-shrink lg:w-full flex items-center space-x-2 sm:space-x-3 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <span className="text-base sm:text-lg">{section.icon}</span>
                  <span className="text-xs sm:text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
            
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6">General Settings</h2>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Username</label>
                      <input
                        type="text"
                        value={settings.username}
                        onChange={(e) => updateSetting('username', e.target.value)}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting('email', e.target.value)}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">GMT</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6">Reading Preferences</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <SettingItem 
                    label="Default Library View" 
                    description="Choose how books are displayed by default"
                  >
                    <select
                      value={settings.defaultView}
                      onChange={(e) => updateSetting('defaultView', e.target.value)}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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
                      className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
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

            {/* Action Buttons */}
            <div className="border-t border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-4 transition-colors">
              <div className="flex flex-col gap-3 sm:gap-4">
                <p 
                  className="text-xs sm:text-sm"
                  style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                >
                  Settings are automatically saved
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                  <button 
                    onClick={resetToDefaults}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                    style={{
                      color: isDark ? '#cbd5e1' : '#4b5563',
                      backgroundColor: isDark ? '#334155' : '#f3f4f6'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#475569' : '#e5e7eb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'
                    }}
                  >
                    Reset to Defaults
                  </button>
                  <button 
                    onClick={importSettings}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                    style={{
                      color: isDark ? '#cbd5e1' : '#4b5563',
                      backgroundColor: isDark ? '#334155' : '#f3f4f6',
                      border: isDark ? '1px solid #475569' : '1px solid #d1d5db'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#475569' : '#e5e7eb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f3f4f6'
                    }}
                  >
                    📥 Import Settings
                  </button>
                  <button 
                    onClick={exportSettings}
                    className="bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors w-full sm:w-auto shadow-sm"
                  >
                    📤 Export Settings
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