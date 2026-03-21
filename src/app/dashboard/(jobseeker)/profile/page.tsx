'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Camera, MapPin, Briefcase, Plus, X } from 'lucide-react';
import { useForm } from 'react-form'; // Assuming standard handling, let's use plain state for speed or react-hook-form
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function JobSeekerProfile() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    headline: '',
    location: '',
    bio: '',
    skills: [] as string[]
  });
  
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await api.patch(`/users/${(user as any)._id || user.id}`, formData);
      toast.success('Profile updated! ✓');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <ProtectedRoute allowedRoles={['jobseeker']}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Profile Preview */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-primary/5" />
            
            <div className="relative mt-8 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center text-4xl font-black text-primary shadow-xl overflow-hidden">
                {user?.name?.[0].toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-2 border-background">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-black text-foreground">{formData.name || user?.name}</h2>
            <p className="text-muted-foreground font-medium mt-1">{formData.headline || 'Add a professional headline'}</p>
            
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {formData.location || 'Location not set'}
            </div>

            <div className="mt-6 w-full pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-2xl bg-muted/40 border border-border/50">
                <h4 className="text-xl font-bold text-foreground">12</h4>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Applications</p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-muted/40 border border-border/50">
                <h4 className="text-xl font-bold text-foreground">5</h4>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Saved Jobs</p>
              </div>
            </div>

            <div className="mt-6 w-full flex items-center justify-between text-xs font-bold text-muted-foreground px-2">
               <span>Member since</span>
               <span>{joinedDate}</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Edit Profile Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-3xl p-8 shadow-sm"
          >
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> Edit Profile
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="h-12 rounded-xl bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Professional Headline</label>
                  <Input 
                    placeholder="e.g. Senior React Developer" 
                    value={formData.headline} 
                    onChange={e => setFormData({...formData, headline: e.target.value})}
                    className="h-12 rounded-xl bg-muted/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Location</label>
                <Input 
                  placeholder="e.g. San Francisco, CA" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="h-12 rounded-xl bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Bio</label>
                <textarea 
                  rows={4}
                  placeholder="Tell employers about yourself..."
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full rounded-xl border border-input bg-muted/30 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  Skills 
                  <span className="text-xs font-normal text-muted-foreground">(Press Enter to add)</span>
                </label>
                <div className="p-3 bg-muted/30 border border-input rounded-xl min-h-[50px] flex flex-wrap gap-2 items-center focus-within:ring-1 focus-within:ring-ring transition-all">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-200">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder="Type a skill..."
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 bg-transparent border-none outline-none min-w-[120px] text-sm font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button type="submit" isLoading={isSaving} className="h-12 px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
        
      </div>
    </ProtectedRoute>
  );
}
