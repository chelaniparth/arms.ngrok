import React from 'react';
import { Clock, User, Edit2, CheckCircle, AlertCircle, ArrowRight, FileText, Shield } from 'lucide-react';
import clsx from 'clsx';

const getActionIcon = (action, fieldName, newValue) => {
    if (fieldName === 'lifecycle') return <FileText size={16} />;
    if (fieldName === 'status') {
        if (newValue === 'Completed') return <CheckCircle size={16} />;
        return <Clock size={16} />;
    }
    if (fieldName === 'priority') return <AlertCircle size={16} />;
    if (fieldName === 'assigned_user_id') return <User size={16} />;
    return <Edit2 size={16} />;
};

const getActionColor = (fieldName, newValue) => {
    switch (fieldName) {
        case 'lifecycle': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
        case 'status':
            if (newValue === 'Completed') return 'bg-green-100 text-green-600 border-green-200';
            return 'bg-blue-100 text-blue-600 border-blue-200';
        case 'priority': return 'bg-orange-100 text-orange-600 border-orange-200';
        case 'assigned_user_id': return 'bg-purple-100 text-purple-600 border-purple-200';
        default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
};

const AuditLog = ({ history, users }) => {
    if (!history || history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <FileText size={48} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">No activity recorded yet</p>
            </div>
        );
    }

    const getUserName = (userId) => {
        if (!userId) return 'Unassigned';
        const user = users?.find(u => String(u.id) === String(userId));
        return user ? user.full_name : userId;
    };

    return (
        <div className="relative pl-4 space-y-8">
            {/* Vertical Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />

            {history.map((item, index) => {
                const isLatest = index === 0;
                const icon = getActionIcon(item.action, item.field_name, item.new_value);
                const colorClass = getActionColor(item.field_name, item.new_value);

                return (
                    <div key={item.history_id} className="relative pl-8 group">
                        {/* Timeline Node */}
                        <div className={clsx(
                            "absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110",
                            colorClass,
                            isLatest ? "ring-2 ring-primary-100 ring-offset-2" : ""
                        )}>
                            {icon}
                        </div>

                        {/* Content Card */}
                        <div className={clsx(
                            "bg-white p-4 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
                            isLatest ? "border-primary-100 shadow-primary-500/5" : "border-slate-100"
                        )}>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5 block">
                                        {item.field_name.replace(/_/g, ' ')}
                                    </span>
                                    <h4 className="text-sm font-semibold text-slate-900">
                                        {item.action || 'Update'}
                                    </h4>
                                </div>
                                <time className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap">
                                    {new Date(item.changed_at).toLocaleString(undefined, {
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </time>
                            </div>

                            <div className="text-sm text-slate-600 mt-2 bg-slate-50/50 rounded-lg p-3 border border-slate-100/50">
                                {item.field_name === 'assigned_user_id' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Assigned to</span>
                                        <span className="font-medium text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                                            {getUserName(item.new_value)}
                                        </span>
                                    </div>
                                ) : item.old_value && item.new_value ? (
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="line-through text-slate-400 decoration-slate-400/50 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                                            {item.old_value}
                                        </span>
                                        <ArrowRight size={14} className="text-slate-400" />
                                        <span className="font-medium text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                                            {item.new_value}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Set to</span>
                                        <span className="font-medium text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                                            {item.new_value}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white shadow-sm">
                                    {(item.user?.full_name || 'S').charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-slate-500">
                                    {item.user ? item.user.full_name : 'System'}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AuditLog;
