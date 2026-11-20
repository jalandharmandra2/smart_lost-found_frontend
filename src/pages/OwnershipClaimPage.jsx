import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Inbox,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  FileText,
  MessageSquare
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const OwnershipClaimPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const prefillFoundId = searchParams.get('found_item_id');
  const prefillLostId = searchParams.get('lost_item_id');

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State for new claim submission
  const [formData, setFormData] = useState({
    found_item: prefillFoundId || '',
    lost_item: prefillLostId || '',
    claim_description: '',
    secret_identifying_answers: '',
  });
  const [supportingFile, setSupportingFile] = useState(null);

  // Status update modal / action state
  const [activeClaimForReview, setActiveClaimForReview] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await api.get('/claims/');
      setClaims(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load claims:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('found_item', formData.found_item);
      if (formData.lost_item) data.append('lost_item', formData.lost_item);
      data.append('claim_description', formData.claim_description);
      data.append('secret_identifying_answers', formData.secret_identifying_answers);

      if (supportingFile) {
        data.append('supporting_document', supportingFile);
      }

      await api.post('/claims/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Ownership claim submitted securely. The finder has been notified.');
      setFormData({
        found_item: '',
        lost_item: '',
        claim_description: '',
        secret_identifying_answers: '',
      });
      setSupportingFile(null);
      await fetchClaims();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit claim. Ensure found item ID is valid.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecision = async (claimId, newStatus) => {
    try {
      setReviewLoading(true);
      await api.patch(`/claims/${claimId}/status/`, {
        status: newStatus,
        response_notes: decisionNotes,
      });
      setActiveClaimForReview(null);
      setDecisionNotes('');
      await fetchClaims();
    } catch (err) {
      console.error(err);
      alert('Failed to update claim status.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Inbox className="w-8 h-8 text-brand-600" />
          <span>Ownership Verification & Claims</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Secure, verified ownership claim workflow. Private answers and serial identifiers are strictly confidential.
        </p>
      </div>

      {/* New Claim Submission Form (Visible if prefill or requested) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {prefillFoundId ? `Submit Ownership Claim for Item #${prefillFoundId}` : 'Submit a New Ownership Claim'}
          </h2>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Found Item ID *</label>
              <input
                type="number"
                value={formData.found_item}
                onChange={(e) => setFormData({ ...formData, found_item: e.target.value })}
                required
                placeholder="e.g. 1"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Associated Lost Item ID (Optional)</label>
              <input
                type="number"
                value={formData.lost_item}
                onChange={(e) => setFormData({ ...formData, lost_item: e.target.value })}
                placeholder="e.g. 1"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Claim Statement *</label>
            <textarea
              rows="2"
              value={formData.claim_description}
              onChange={(e) => setFormData({ ...formData, claim_description: e.target.value })}
              required
              placeholder="Explain how, when, and where you misplaced the belonging."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Private Verification Answers (Never Publicly Displayed)</span>
            </div>
            <textarea
              rows="2"
              value={formData.secret_identifying_answers}
              onChange={(e) => setFormData({ ...formData, secret_identifying_answers: e.target.value })}
              required
              placeholder="List exact identifying proofs: serial number, unique scratches, contents of inner pocket, lockscreen wallpaper, or passwords."
              className="w-full px-3 py-2 text-xs border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optional Supporting Proof Document (Receipt / Warranty / Invoice)
            </label>
            <input
              type="file"
              onChange={(e) => setSupportingFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="py-3 px-6 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting Verification...' : 'Submit Claim for Review'}
          </button>
        </form>
      </div>

      {/* Claims Tracking Table / Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your Claims Records & Inquiries</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : claims.length > 0 ? (
          <div className="space-y-4">
            {claims.map((claim) => {
              const isClaimant = claim.claimant?.id === user?.id;
              const isFinder = claim.found_item_details?.user?.id === user?.id;

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Claim #{claim.id}</span>
                      <span className="text-slate-300">•</span>
                      <h3 className="text-base font-bold text-slate-900">
                        {claim.found_item_details?.item_name || `Found Item #${claim.found_item}`}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide self-start sm:self-auto ${
                        claim.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : claim.status === 'DISPUTED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500">Claimant Statement:</span>
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        {claim.claim_description}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Confidential Verification Details:</span>
                      </span>
                      <p className="text-slate-700 font-mono text-[11px] bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                        {claim.secret_identifying_answers}
                      </p>
                    </div>
                  </div>

                  {claim.finder_response && (
                    <div className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <strong>Finder Response:</strong> {claim.finder_response}
                    </div>
                  )}

                  {/* Actions for Finder or Admin */}
                  {(isFinder || user?.role === 'ADMINISTRATOR' || user?.is_staff) && claim.status === 'PENDING' && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        You have permission to review this ownership claim:
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const notes = prompt('Enter confirmation notes for genuine owner (e.g. Details verified. Handover at security gate.):');
                            if (notes !== null) {
                              setDecisionNotes(notes);
                              handleDecision(claim.id, 'APPROVED');
                            }
                          }}
                          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                          ✓ Accept & Verify
                        </button>

                        <button
                          onClick={() => {
                            const notes = prompt('Enter reason for rejecting claim (e.g. Serial numbers do not match.):');
                            if (notes !== null) {
                              setDecisionNotes(notes);
                              handleDecision(claim.id, 'REJECTED');
                            }
                          }}
                          className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                        >
                          ✕ Reject Claim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 text-xs text-slate-400">
            No ownership claims currently recorded for your account.
          </div>
        )}
      </div>

    </div>
  );
};

export default OwnershipClaimPage;
