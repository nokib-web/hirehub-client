'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DataWrapper from '@/components/dashboard/DataWrapper';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Camera, MapPin, Briefcase, X, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function JobSeekerProfile() {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    bio: '',
    skills: [] as string[]
  });
  
  const [skillInput, setSkillInput] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!authUser?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/users/${authUser.id}`);
      if (response.data.success) {
        const data = response.data.data;
        setProfileData(data);
        setFormData({
          name: data.name || '',
          headline: data.headline || '',
          location: data.location || '',
          bio: data.bio || '',
          skills: data.skills || []
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
    if (!authUser?.id) return;
    setIsSaving(true);
    try {
      await api.patch(`/users/${authUser.id}`, formData);
      toast.success('Profile updated successfully! ✨');
      setProfileData({ ...profileData, ...formData });
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const joinedDate = profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';

  return (
    <ProtectedRoute allowedRoles={['jobseeker']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={fetchProfile}
        loadingMessage="Retrieving your profile data..."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Preview */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-[2rem] p-8 shadow-xl shadow-primary/5 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
              
              <div className="relative mt-8 mb-6">
                <div className="w-40 h-40 rounded-full border-8 border-card bg-muted/50 flex items-center justify-center text-5xl font-black text-primary shadow-2xl overflow-hidden ring-1 ring-primary/10">
                  {profileData?.avatar ? (
                    <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                  ) : (
                    profileData?.name?.[0].toUpperCase()
                  )}
                </div>
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl border-4 border-card group">
                  <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl font-black text-foreground tracking-tight">{profileData?.name}</h2>
                <p className="text-primary font-bold text-sm uppercase tracking-widest">{profileData?.headline || 'Freelance Professional'}</p>
              </div>
              
              <div className="flex flex-col items-center gap-3 mt-6 w-full">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl w-full justify-center border border-border/40">
                   <Mail className="w-4 h-4 text-primary/60" />
                   {profileData?.email}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl w-full justify-center border border-border/40">
                  <MapPin className="w-4 h-4 text-primary/60" />
                  {profileData?.location || 'Not Specified'}
                </div>
              </div>

              <div className="mt-8 w-full pt-8 border-t border-border/60">
                <h4 className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] mb-4">Core Expertise</h4>
                <div className="flex flex-wrap justify-center gap-2">
                   {profileData?.skills?.length > 0 ? (
                     profileData.skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/10">
                          {skill}
                        </span>
                     ))
                   ) : (
                     <p className="text-xs text-muted-foreground italic">No skills added yet</p>
                   )}
                </div>
              </div>

              <div className="mt-8 w-full flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-muted-foreground bg-muted/20 p-4 rounded-2xl border border-border/40">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    <span>Member Since</span>
                 </div>
                 <span className="text-foreground">{joinedDate}</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Edit Profile Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-[2rem] p-10 shadow-xl shadow-primary/5"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
                      <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  Profile Details
                </h3>
                <div className="px-4 py-1.5 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-500/20">
                  Profile Active
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <Input 
                      placeholder="Your full name"
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="h-14 rounded-2xl bg-muted/20 border-border/40 transition-all focus:bg-background focus:ring-4 focus:ring-primary/10 px-6 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Professional Headline</label>
                    <Input 
                      placeholder="e.g. Senior Product Designer" 
                      value={formData.headline} 
                      onChange={e => setFormData({...formData, headline: e.target.value})}
                      className="h-14 rounded-2xl bg-muted/20 border-border/40 transition-all focus:bg-background focus:ring-4 focus:ring-primary/10 px-6 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Location</label>
                  <Input 
                    placeholder="e.g. San Francisco, CA (Remote)" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="h-14 rounded-2xl bg-muted/20 border-border/40 transition-all focus:bg-background focus:ring-4 focus:ring-primary/10 px-6 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Professional Bio</label>
                  <textarea 
                    rows={5}
                    placeholder="Share your story, achievements, and what you're looking for..."
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    className="w-full rounded-[1.5rem] border border-border/40 bg-muted/20 px-6 py-4 text-sm font-medium shadow-sm transition-all placeholder:text-muted-foreground/60 focus:bg-background focus:ring-4 focus:ring-primary/10 focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    Technical Skills 
                    <span className="text-[9px] font-normal text-muted-foreground lowercase opacity-60 tracking-normal ml-2">(Press Enter to add new)</span>
                  </label>
                  <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl min-h-[60px] flex flex-wrap gap-3 items-center transition-all focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10">
                    {formData.skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase rounded-xl shadow-lg shadow-foreground/5 group">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-red-500 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      placeholder="Add a skill..."
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="flex-1 bg-transparent border-none outline-none min-w-[150px] text-sm font-bold placeholder:font-bold placeholder:text-muted-foreground/40 px-2"
                    />
                  </div>
                </div>

                <div className="pt-10 border-t border-border/60 flex justify-end">
                  <Button 
                    type="submit" 
                    isLoading={isSaving} 
                    className="h-16 px-12 rounded-2xl font-black text-sm shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white border-none"
                  >
                    {isSaving ? 'Updating Profile...' : 'Save Profile Changes'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}
