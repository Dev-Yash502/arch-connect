import React, { useState } from 'react';
import { X, Calculator, Check, ArrowRight, Building, Sparkles } from 'lucide-react';
import { CostEstimateInput } from '../types';

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostRequirementWithEstimate: (estimate: CostEstimateInput, total: number) => void;
}

export const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({
  isOpen,
  onClose,
  onPostRequirementWithEstimate
}) => {
  const [inputs, setInputs] = useState<CostEstimateInput>({
    areaSqFt: 3500,
    category: 'Complete Villa',
    qualityLevel: 'Premium',
    locationTier: 'Dehradun',
    numberOfFloors: 2
  });

  if (!isOpen) return null;

  // Base rate per sq ft calculation matrix (in INR)
  const getBaseRate = () => {
    let base = 2200; // Base ₹ per sq ft
    if (inputs.category === 'Architectural Blueprint') base = 120;
    if (inputs.category === 'Turnkey Interior') base = 1200;
    if (inputs.category === 'Civil Construction') base = 1450;
    if (inputs.category === 'Material Package') base = 850;
    if (inputs.category === 'Complete Villa') base = 2200;

    // Quality multiplier
    let qualityMult = 1.0;
    if (inputs.qualityLevel === 'Premium') qualityMult = 1.4;
    if (inputs.qualityLevel === 'Luxury') qualityMult = 2.0;

    // Location multiplier
    let locationMult = 1.0; // Roorkee
    if (inputs.locationTier === 'Delhi NCR') locationMult = 1.25;
    if (inputs.locationTier === 'Dehradun') locationMult = 1.1;

    // Floor multiplier
    let floorMult = 1.0 + (inputs.numberOfFloors - 1) * 0.08;

    return Math.round(base * qualityMult * locationMult * floorMult);
  };

  const ratePerSqFt = getBaseRate();
  const totalCost = ratePerSqFt * inputs.areaSqFt;

  // Breakdown percentages
  const archCost = Math.round(totalCost * 0.10);
  const civilCost = Math.round(totalCost * 0.48);
  const interiorCost = Math.round(totalCost * 0.24);
  const materialsCost = Math.round(totalCost * 0.18);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FDF8F0] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-[#4A3728] text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Calculator className="w-6 h-6 text-[#C4A882]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                Arch-Connect Cost Estimator
              </h2>
              <p className="text-xs text-slate-300">
                Precision construction & architectural budget calculator (India)
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

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Built-up Area Slider */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Built-up Area (Sq. Ft)
                </label>
                <span className="font-display font-extrabold text-lg text-[#4A3728]">
                  {inputs.areaSqFt.toLocaleString('en-IN')} sq.ft
                </span>
              </div>
              <input
                type="range"
                min="800"
                max="10000"
                step="100"
                value={inputs.areaSqFt}
                onChange={(e) => setInputs({ ...inputs, areaSqFt: Number(e.target.value) })}
                className="w-full accent-[#4A3728] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>800 sq ft</span>
                <span>5,000 sq ft</span>
                <span>10,000 sq ft</span>
              </div>
            </div>

            {/* Scope Category */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Scope Category
              </label>
              <select
                value={inputs.category}
                onChange={(e) => setInputs({ ...inputs, category: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
              >
                <option value="Complete Villa">Complete Villa (Turnkey Architecture + Build)</option>
                <option value="Architectural Blueprint">Architectural Blueprint & Permits Only</option>
                <option value="Civil Construction">Civil Superstructure & Foundation</option>
                <option value="Turnkey Interior">Interior Design & Fitouts</option>
                <option value="Material Package">Exterior Slate, Glazing & Teak Material Package</option>
              </select>
            </div>

            {/* Quality Grade */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Quality Finish Grade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Standard', 'Premium', 'Luxury'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setInputs({ ...inputs, qualityLevel: grade })}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      inputs.qualityLevel === grade
                        ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Floors */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Location City
                  </label>
                  <select
                    value={inputs.locationTier}
                    onChange={(e) => setInputs({ ...inputs, locationTier: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <option value="Delhi NCR">Delhi NCR, India</option>
                    <option value="Dehradun">Dehradun, Uttarakhand</option>
                    <option value="Roorkee">Roorkee, Uttarakhand</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Number of Floors
                  </label>
                  <select
                    value={inputs.numberOfFloors}
                    onChange={(e) => setInputs({ ...inputs, numberOfFloors: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <option value={1}>1 Floor (Single Story)</option>
                    <option value={2}>2 Floors (Duplex)</option>
                    <option value={3}>3 Floors (Modern Villa)</option>
                    <option value={4}>4 Floors (Multi-Tier)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-6 bg-gradient-to-br from-[#4A3728] to-[#6B5040] text-white rounded-2xl shadow-lg border border-[#4A3728]/20 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C4A882]">
                  Estimated Investment Total
                </span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
                  ₹{totalCost.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-300 font-sans font-normal">
                    (~₹{ratePerSqFt.toLocaleString('en-IN')}/sq.ft)
                  </span>
                </div>
              </div>

              <div className="text-right sm:text-right text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="block font-semibold text-white">Estimated Timeline</span>
                <span>6 - 9 Months Execution</span>
              </div>
            </div>

            {/* Cost Breakdown Bars */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Cost Allocation Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-slate-300 font-medium">Architecture & Permits</span>
                  <span className="font-bold text-white text-sm">₹{archCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-slate-300 font-medium">Civil & Structure</span>
                  <span className="font-bold text-white text-sm">₹{civilCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-slate-300 font-medium">Interiors & Lighting</span>
                  <span className="font-bold text-white text-sm">₹{interiorCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-slate-300 font-medium">Slate, Teak & Glass</span>
                  <span className="font-bold text-white text-sm">₹{materialsCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 py-4 bg-slate-100 border-t border-slate-200 gap-3">
          <span className="text-xs text-slate-500 font-medium">
            *Estimates are calculated based on Indian market averages for premium architectural construction.
          </span>

          <button
            onClick={() => {
              onPostRequirementWithEstimate(inputs, totalCost);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>Request Bids with this Estimate</span>
            <ArrowRight className="w-4 h-4 text-amber-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
