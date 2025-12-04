import React, { useState } from 'react';
import { X, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ReviewTaskModal = ({ isOpen, onClose, task, onUpdate }) => {
    const [rating, setRating] = useState(5);
    const [errorStatus, setErrorStatus] = useState('None');
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !task) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/tasks/${task.task_id}/review`, {
                rating,
                error_status: errorStatus,
                remarks
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to review task", error);
            const msg = error.response?.data?.detail || error.message || "Failed to submit review";
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Review Task</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-6">
                    {/* Rating Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Quality Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                >
                                    <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {rating === 5 ? "Excellent - No issues" :
                                rating === 4 ? "Good - Minor suggestions" :
                                    rating === 3 ? "Average - Needs improvement" :
                                        rating === 2 ? "Poor - Significant issues" : "Critical - Unacceptable"}
                        </p>
                    </div>

                    {/* Error Status Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Error / Query Status</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setErrorStatus('None')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${errorStatus === 'None' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <CheckCircle size={20} className="mb-1" />
                                <span className="text-xs font-medium">None</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setErrorStatus('Internal Error')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${errorStatus === 'Internal Error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <AlertTriangle size={20} className="mb-1" />
                                <span className="text-xs font-medium">Internal Error</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setErrorStatus('Client Query')}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${errorStatus === 'Client Query' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <AlertTriangle size={20} className="mb-1" />
                                <span className="text-xs font-medium">Client Query</span>
                            </button>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (Optional)</label>
                        <textarea
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                            placeholder="Add any specific feedback or details about the error..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewTaskModal;
