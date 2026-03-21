'use client';

import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const CATEGORIES = [
  'Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 
  'Education', 'Sales', 'Engineering', 'HR', 'Legal'
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const LOCATION_TYPES = ['Remote', 'On-site', 'Hybrid'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('searchTerm') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.get('category')?.split(',') || []);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(searchParams.get('type')?.split(',') || []);
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>(searchParams.get('locationType')?.split(',') || []);
  const [selectedExperience, setSelectedExperience] = useState<string[]>(searchParams.get('experience')?.split(',') || []);
  const [salaryRange, setSalaryRange] = useState({
    min: Number(searchParams.get('minSalary')) || 0,
    max: Number(searchParams.get('maxSalary')) || 300000
  });

  const updateFilters = (newFilters: Record<string, string | string[] | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        } else {
          params.delete(key);
        }
      } else if (value !== undefined && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    router.push(`/jobs?${params.toString()}`);
  };

  const handleCheckboxChange = (
    value: string, 
    selected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    key: string
  ) => {
    const updated = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    
    setSelected(updated);
    updateFilters({ [key]: updated });
  };

  const clearAll = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedJobTypes([]);
    setSelectedLocationTypes([]);
    setSelectedExperience([]);
    setSalaryRange({ min: 0, max: 300000 });
    router.push('/jobs');
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateFilters({ searchTerm: search });
    }
  };

  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Filters</h3>
        <button 
          onClick={clearAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Title, skills..."
            className="pl-9 h-10"
          />
        </div>
      </div>

      <FilterGroup 
        title="Category" 
        options={CATEGORIES} 
        selected={selectedCategories}
        onChange={(val: string) => handleCheckboxChange(val, selectedCategories, setSelectedCategories, 'category')}
      />

      <FilterGroup 
        title="Job Type" 
        options={JOB_TYPES} 
        selected={selectedJobTypes}
        onChange={(val: string) => handleCheckboxChange(val, selectedJobTypes, setSelectedJobTypes, 'type')}
      />

      <FilterGroup 
        title="Location" 
        options={LOCATION_TYPES} 
        selected={selectedLocationTypes}
        onChange={(val: string) => handleCheckboxChange(val, selectedLocationTypes, setSelectedLocationTypes, 'locationType')}
      />

      <FilterGroup 
        title="Experience" 
        options={EXPERIENCE_LEVELS} 
        selected={selectedExperience}
        onChange={(val: string) => handleCheckboxChange(val, selectedExperience, setSelectedExperience, 'experience')}
      />

      {/* Salary Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground/80">Salary Range</label>
          <span className="text-xs font-mono text-muted-foreground">
            ${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <Input 
            type="number" 
            placeholder="Min"
            value={salaryRange.min}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSalaryRange({ ...salaryRange, min: Number(e.target.value) })}
            onBlur={() => updateFilters({ minSalary: salaryRange.min })}
            className="h-9 text-xs"
          />
          <Input 
            type="number" 
            placeholder="Max"
            value={salaryRange.max}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSalaryRange({ ...salaryRange, max: Number(e.target.value) })}
            onBlur={() => updateFilters({ maxSalary: salaryRange.max })}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (val: string) => void;
}

function FilterGroup({ title, options, selected, onChange }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-t border-border/50 pt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground/80 mb-3"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="space-y-2.5">
          {options.map((option: string) => (
            <label key={option} className="flex items-center gap-2.5 group cursor-pointer">
              <div className="relative flex items-center">
                <input 
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onChange(option)}
                  className="peer appearance-none w-4 h-4 rounded border border-input checked:bg-primary checked:border-primary transition-all pointer-events-none"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-white transition-opacity">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2.5 h-2.5">
                      <polyline points="20 6 9 17 4 12" />
                   </svg>
                </div>
              </div>
              <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
