import React from 'react';
import { X, CheckCircle2, Clock, Calendar, ShieldCheck, DollarSign, Image as ImageIcon, MapPin, User, FileCheck } from 'lucide-react';
import { ActiveProject } from '../types';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ActiveProject;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, project }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#f9f9f7] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-[#003629] text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FileCheck className="w-6 h-6 text-[#ecc246]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                  {project.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ecc246] text-[#003629] px-2.5 py-0.5 rounded-full">
                  75% Complete
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#ecc246]" />
                <span>{project.location} • Client: {project.clientName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Progress Tracker Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-600">
              <span>Overall Site Completion</span>
              <span className="text-base text-[#003629]">{project.overallProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#003629] via-emerald-600 to-[#755b00] h-full rounded-full transition-all duration-1000"
                style={{ width: `${project.overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>Ground Foundations (100%)</span>
              <span>Framing & Glazing (75%)</span>
              <span>Target: {project.estimatedCompletion}</span>
            </div>
          </div>

          {/* Project Team Cards */}
          <div>
            <h3 className="font-display font-bold text-base text-[#003629] mb-3">
              Assigned Professional Guild
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Architect</span>
                <span className="font-bold text-[#003629] text-sm block mt-0.5">{project.leadArchitect}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Atelier Verma</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Civil Engineer</span>
                <span className="font-bold text-[#003629] text-sm block mt-0.5">{project.leadEngineer}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Malhotra Dynamics</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Interior Designer</span>
                <span className="font-bold text-[#003629] text-sm block mt-0.5">{project.interiorDesigner}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Kapoor Interiors</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Material Supplier</span>
                <span className="font-bold text-[#003629] text-sm block mt-0.5">{project.materialSupplier}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Apex Materials</span>
              </div>
            </div>
          </div>

          {/* Milestone Schedule */}
          <div>
            <h3 className="font-display font-bold text-base text-[#003629] mb-3">
              Construction Milestones & Audit Log
            </h3>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start space-x-3">
                    {m.status === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : m.status === 'In Progress' ? (
                      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-[#003629]">{m.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{m.notes}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block ${
                        m.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.status}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1">{m.targetDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Site Progress Photos */}
          <div>
            <h3 className="font-display font-bold text-base text-[#003629] mb-3">
              On-Site Photo Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.sitePhotos.map((photo, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden group shadow-sm border border-slate-200">
                  <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="font-bold text-xs">{photo.caption}</span>
                    <span className="text-[10px] text-slate-300">{photo.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
