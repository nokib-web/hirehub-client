'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, MessageSquare, Briefcase, GraduationCap, Building2, LayoutGrid, Info, ChevronRight, Loader2, User } from 'lucide-react';
import { IJob } from '@/types/job';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-hot-toast';
import { useReviews, useCreateReview, useReviewSummary } from '@/hooks/useReviews';
import { useAuth } from '@/providers/AuthProvider';

interface JobTabsProps {
  job: IJob;
}

const TABS = ['Overview', 'Requirements', 'Company', 'Reviews'];

export default function JobTabs({ job }: JobTabsProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [aiReviewSummary, setAiReviewSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(false);
  
  // Review Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');

  const { user } = useAuth();
  const { data: reviews = [], isLoading: isLoadingReviews } = useReviews(job.company); // Using company name as id if real ID not available
  const createReviewMutation = useCreateReview();
  const summaryMutation = useReviewSummary();

  const handleGenerateSummary = async () => {
    if (reviews.length < 2) return;
    setIsSummarizing(true);
    try {
      const summary = await summaryMutation.mutateAsync(
        reviews.map((r: any) => ({ rating: r.rating, comment: r.comment }))
      );
      setAiReviewSummary(summary);
      toast.success('AI summary generated! ✨');
    } catch (error) {
      toast.error('AI is unavailable, please try again');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || comment.length < 50) {
      toast.error('Title and comment (min 50 chars) are required.');
      return;
    }

    createReviewMutation.mutate({
      companyId: job.company,
      rating,
      title,
      comment,
      pros,
      cons
    }, {
      onSuccess: () => {
        setIsWritingReview(false);
        setTitle('');
        setComment('');
        setPros('');
        setCons('');
        setRating(5);
      }
    });
  };

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-border space-x-8 overflow-x-auto no-scrollbar scroll-smooth">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap px-1 ${
              activeTab === tab 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabOutline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.3)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'Overview' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2.5">
                <Info className="w-5 h-5 text-primary" />
                About the role
              </h3>
              <p className="text-foreground/80 leading-relaxed text-base sm:text-lg">
                {job.description}
              </p>
            </section>

            <section className="space-y-5">
              <h3 className="text-xl font-bold flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-primary" />
                Key Responsibilities
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {job.responsibilities.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-colors group">
                     <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                     <p className="text-foreground/80 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </section>

             <section className="space-y-4">
               <h3 className="text-xl font-bold flex items-center gap-2.5">
                 <Briefcase className="w-5 h-5 text-primary" />
                 Required Skills
               </h3>
               <div className="flex flex-wrap gap-2.5">
                 {job.skills.map(skill => (
                   <Badge key={skill} variant="secondary" className="px-5 py-2 text-sm font-bold bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors pointer-events-none rounded-xl">
                     {skill}
                   </Badge>
                 ))}
               </div>
             </section>

             {job.benefits && job.benefits.length > 0 && (
               <section className="space-y-5">
                 <h3 className="text-xl font-bold flex items-center gap-2.5">
                   <Star className="w-5 h-5 text-primary" />
                   Benefits & Perks
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {job.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-all group">
                         <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-colors group-hover:text-white">
                           <LayoutGrid className="w-4 h-4" />
                         </div>
                         <span className="font-bold text-foreground/80">{benefit}</span>
                      </div>
                    ))}
                 </div>
               </section>
             )}
          </motion.div>
        )}

        {activeTab === 'Requirements' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
             <section className="space-y-5">
              <h3 className="text-xl font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Who are we looking for?
              </h3>
              <div className="space-y-4">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-border/40 last:border-0 group">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-sm shrink-0 mt-1 group-hover:bg-primary group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <p className="text-foreground/80 font-medium pt-2 leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5">
               <h3 className="text-xl font-bold flex items-center gap-2.5">
                 <GraduationCap className="w-5 h-5 text-primary" />
                 Education & Qualifications
               </h3>
               <div className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm">
                  <p className="text-foreground/80 font-medium leading-relaxed">
                    Requirement of {job.experience} minimum. Education in a relevant field or equivalent practical experience.
                  </p>
               </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'Company' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-primary" />
                    Company Profile
                  </h3>
                  <div className="space-y-3 bg-card border border-border p-6 rounded-2xl shadow-sm">
                     <div className="flex justify-between text-sm py-2 border-b border-border/40">
                        <span className="text-muted-foreground font-medium">Company Name</span>
                        <span className="text-foreground font-bold">{job.company}</span>
                     </div>
                     <div className="flex justify-between text-sm py-2 border-b border-border/40">
                        <span className="text-muted-foreground font-medium">Location</span>
                        <span className="text-foreground font-bold">{job.location}</span>
                     </div>
                     <div className="flex justify-between text-sm py-2 border-b border-border/40">
                        <span className="text-muted-foreground font-medium">Industry</span>
                        <span className="text-foreground font-bold">{job.category}</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 pt-1">
                  <h4 className="text-lg font-bold text-foreground/80">About {job.company}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {job.company} is a leading innovator in {job.category}. Join our world-class team as we continue to push boundaries and deliver excellence.
                  </p>
               </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'Reviews' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            {/* Reviews Summary Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-card border border-border rounded-3xl shadow-sm">
               <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-black text-foreground">
                       {(reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-0.5 mt-2 text-amber-500">
                       {[1, 2, 3, 4, 5].map((s) => (
                         <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / (reviews.length || 1)) ? 'fill-current' : 'opacity-30'}`} />
                       ))}
                    </div>
                  </div>
                  <div className="space-y-2 hidden xs:block">
                     <p className="text-sm font-bold text-foreground">{reviews.length > 0 ? (reviews.length >= 2 ? 'Highly Recommended' : 'New Platform') : 'No Reviews Yet'}</p>
                     <p className="text-xs text-muted-foreground font-medium">Based on {reviews.length} reviews</p>
                  </div>
               </div>

               <div className="flex gap-4 w-full sm:w-auto">
                 <Button 
                  onClick={handleGenerateSummary}
                  disabled={isSummarizing || !!aiReviewSummary || reviews.length < 2}
                  className="gap-2.5 h-12 px-6 rounded-2xl font-bold group relative overflow-hidden active:scale-95 transition-all flex-1 sm:flex-initial"
                >
                  {isSummarizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                  {isSummarizing ? 'Generating Summary...' : aiReviewSummary ? 'Summary Ready' : 'AI Summary ✨'}
                </Button>
                {user?.role === 'jobseeker' && (
                  <Button variant="outline" onClick={() => setIsWritingReview(true)} className="h-12 rounded-2xl font-bold px-6 border-primary/20 text-primary hover:bg-primary/5">
                    Write Review
                  </Button>
                )}
               </div>
            </div>

            {/* AI Review Summary Card */}
            <AnimatePresence>
               {aiReviewSummary && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-8 bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-3xl border border-primary/20 shadow-xl relative group overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Sparkles className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white scale-90 text-sm font-bold">✨</div>
                       <h4 className="text-lg font-black text-primary uppercase tracking-wider">AI Insights</h4>
                    </div>
                    <p className="text-foreground/90 font-medium text-lg leading-relaxed">
                      {aiReviewSummary}
                    </p>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Review Form Drawer */}
            <AnimatePresence>
               {isWritingReview && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                 >
                    <form onSubmit={handleSubmitReview} className="p-8 bg-muted/40 border border-border rounded-3xl space-y-6">
                       <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold">Write Your Review</h4>
                          <div className="flex gap-1.5">
                             {[1, 2, 3, 4, 5].map((star) => (
                               <button 
                                key={star} 
                                type="button" 
                                onClick={() => setRating(star)}
                                className={`w-8 h-8 transition-all ${star <= rating ? 'text-amber-500' : 'text-muted-foreground/30'}`}
                               >
                                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
                               </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-4">
                          <Input 
                            placeholder="Title of your review" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                          />
                          <textarea 
                            className="w-full min-h-[120px] rounded-xl border border-input bg-background p-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="Your detailed review (min 50 characters)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <Input placeholder="Pros (Optional)" value={pros} onChange={(e) => setPros(e.target.value)} />
                             <Input placeholder="Cons (Optional)" value={cons} onChange={(e) => setCons(e.target.value)} />
                          </div>
                       </div>

                       <div className="flex justify-end gap-3">
                          <Button variant="ghost" type="button" onClick={() => setIsWritingReview(false)}>Cancel</Button>
                          <Button type="submit" disabled={createReviewMutation.isPending}>
                            {createReviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
                          </Button>
                       </div>
                    </form>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Review List */}
            <div className="space-y-8">
               <h3 className="text-xl font-black flex items-center gap-2.5 uppercase tracking-tight">
                 <MessageSquare className="w-5 h-5 text-primary" />
                 Latest Reviews
               </h3>

               <div className="space-y-6">
                 {isLoadingReviews ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>
                 ) : reviews.length > 0 ? (
                    reviews.map((review: any) => (
                     <div key={review._id} className="p-8 bg-card border border-border/60 rounded-3xl hover:border-primary/20 transition-all hover:shadow-lg relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-bold text-muted-foreground/80 text-xl uppercase border-2 border-border/40">
                                 {review.user?.name?.[0] || <User />}
                              </div>
                              <div>
                                 <p className="font-black text-foreground">{review.user?.name || 'Anonymous'}</p>
                                 <p className="text-xs text-muted-foreground font-semibold">
                                   Verified Reviewer • {new Date(review.createdAt).toLocaleDateString()}
                                 </p>
                              </div>
                           </div>
                           <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-xs font-black flex items-center gap-1.5 border border-green-500/20 shadow-sm">
                              <Star className="w-3 h-3 fill-current" /> {review.rating}
                           </div>
                        </div>

                        <h4 className="text-lg font-black text-foreground mb-3 leading-tight leading-tight">&quot;{review.title}&quot;</h4>
                        <p className="text-foreground/70 font-medium leading-relaxed mb-6">
                          {review.comment}
                        </p>

                        {(review.pros || review.cons) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {review.pros && (
                               <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                                  <p className="text-xs font-black text-green-700 uppercase mb-2">Pros</p>
                                  <p className="text-sm font-medium text-foreground/80 italic">{review.pros}</p>
                               </div>
                             )}
                             {review.cons && (
                               <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                                  <p className="text-xs font-black text-red-700 uppercase mb-2">Cons</p>
                                  <p className="text-sm font-medium text-foreground/80 italic">{review.cons}</p>
                               </div>
                             )}
                          </div>
                        )}
                     </div>
                    ))
                 ) : (
                    <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
                       <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                       <p className="text-muted-foreground font-medium">No reviews yet for this company.</p>
                    </div>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
