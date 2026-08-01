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
  const getDetailedEstimate = () => {
    let baseRate = 2200; // default base ₹ per sq ft
    
    // City-wise base rates adjustments (material packages & logistics cost variance)
    let cityModifier = 1.0;
    if (inputs.locationTier === 'Delhi NCR') {
      cityModifier = 1.25;
    } else if (inputs.locationTier === 'Dehradun') {
      cityModifier = 1.12;
    } else if (inputs.locationTier === 'Roorkee') {
      cityModifier = 0.98;
    }

    // Category base rates
    if (inputs.category === 'Architectural Blueprint') baseRate = 120;
    else if (inputs.category === 'Turnkey Interior') baseRate = 1350;
    else if (inputs.category === 'Civil Construction') baseRate = 1650;
    else if (inputs.category === 'Material Package') baseRate = 950;
    else if (inputs.category === 'Complete Villa') baseRate = 2400;

    // Quality level additions (Premium materials, high-density wood, imported glaze)
    let qualityMultiplier = 1.0;
    if (inputs.qualityLevel === 'Premium') qualityMultiplier = 1.35;
    else if (inputs.qualityLevel === 'Luxury') qualityMultiplier = 1.85;

    // Floor parameters: cumulative column/beam load complexity
    let floorComplexityMultiplier = 1.0 + (inputs.numberOfFloors - 1) * 0.09;

    // Contractor supervision overhead profit (12%)
    const rawRate = Math.round(baseRate * cityModifier * qualityMultiplier * floorComplexityMultiplier);
    const contractorCharges = Math.round(rawRate * 0.12);
    
    return {
      ratePerSqFt: rawRate + contractorCharges,
      contractorFee: contractorCharges
    };
  };

  const { ratePerSqFt, contractorFee } = getDetailedEstimate();
  const totalCost = ratePerSqFt * inputs.areaSqFt;

  // Breakdown percentages
  const archCost = Math.round(totalCost * 0.10);
  const civilCost = Math.round(totalCost * 0.48);
  const interiorCost = Math.round(totalCost * 0.24);
  const materialsCost = Math.round(totalCost * 0.18);

  const downloadBreakdownPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download the PDF.");
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Arch-Connect Cost Breakdown & Estimate Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #2C1F14; line-height: 1.6; }
            .header { border-bottom: 2px solid #4A3728; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #4A3728; }
            .subtitle { font-size: 14px; color: #777; margin-top: 5px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 16px; font-weight: bold; text-transform: uppercase; color: #4A3728; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .card { background: #FDF8F0; padding: 15px; border-radius: 8px; border: 1px solid #F3EBE1; }
            .card-title { font-size: 12px; text-transform: uppercase; color: #777; font-weight: bold; }
            .card-value { font-size: 18px; font-weight: bold; color: #4A3728; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { text-align: left; background: #4A3728; color: white; padding: 10px; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
            .total-row { font-weight: bold; background: #FDF8F0; }
            .footer { margin-top: 50px; font-size: 11px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ARCH-CONNECT</div>
            <div class="subtitle">Premium Architecture & Construction Estimator Report</div>
          </div>
          
          <div class="section">
            <div class="section-title">Project Specifications</div>
            <div class="grid">
              <div class="card">
                <div class="card-title">Scope Category</div>
                <div class="card-value">${inputs.category}</div>
              </div>
              <div class="card">
                <div class="card-title">Built-up Area</div>
                <div class="card-value">${inputs.areaSqFt.toLocaleString('en-IN')} Sq. Ft</div>
              </div>
              <div class="card">
                <div class="card-title">Quality Finish Grade</div>
                <div class="card-value">${inputs.qualityLevel}</div>
              </div>
              <div class="card">
                <div class="card-title">Location Tier</div>
                <div class="card-value">${inputs.locationTier}</div>
              </div>
              <div class="card">
                <div class="card-title">Number of Floors</div>
                <div class="card-value">${inputs.numberOfFloors} Floor(s)</div>
              </div>
              <div class="card">
                <div class="card-title">Contractor Overhead (Included)</div>
                <div class="card-value">₹${(contractorFee * inputs.areaSqFt).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Detailed Cost Breakdown</div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Allocation %</th>
                  <th>Estimated Cost (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Architectural Blueprint, Design & Permits</td>
                  <td>10%</td>
                  <td>₹${archCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Civil Superstructure, Concrete & Excavation Works</td>
                  <td>48%</td>
                  <td>₹${civilCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Premium Interiors, Wardrobes, Electrical & Lighting</td>
                  <td>24%</td>
                  <td>₹${interiorCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Finishing Material Package (Teakwood, Double-Glazing, Slate)</td>
                  <td>18%</td>
                  <td>₹${materialsCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Estimated Investment</td>
                  <td>100%</td>
                  <td>₹${totalCost.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Execution Estimate</div>
            <p style="font-size: 13px;">Estimated completion time: <strong>6 - 9 Months</strong> depending on local weather conditions, permit acquisition speed, and contractor labor density.</p>
          </div>

          <div class="footer">
            *This report is generated dynamically by the Arch-Connect platform. Final quotes may vary based on exact architectural drafts and supplier bids.
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

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
          <button
            onClick={downloadBreakdownPDF}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-full transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>📄 Download PDF Breakdown</span>
          </button>

          <button
            onClick={() => {
              onPostRequirementWithEstimate(inputs, totalCost);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#9B7B5A] hover:bg-[#7A5C45] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Request Bids with this Estimate</span>
            <ArrowRight className="w-4 h-4 text-amber-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
