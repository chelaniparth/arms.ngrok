import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, Filter, Search, Calendar, User } from 'lucide-react';
import clsx from 'clsx';
import ReviewTaskModal from '../components/ReviewTaskModal';
import { useAuth } from '../context/AuthContext';

const Reviews = () => {
    const { user: currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterAnalyst, setFilterAnalyst] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showReviewed, setShowReviewed] = useState(false); // Toggle between Pending and Reviewed

    // Modal
    const [reviewModalData, setReviewModalData] = useState({ isOpen: false, task: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, usersRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/users/')
            ]);
            setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && !['admin', 'manager'].includes(currentUser.role)) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        fetchData();
    }, []);

    const getUserName = (userId) => {
        if (!userId) return '-';
        const user = users.find(u => u.id === userId);
        return user ? user.full_name : 'Unknown';
    };

    const openReviewModal = (task) => {
        setReviewModalData({ isOpen: true, task });
    };

    // Filter Logic
    const filteredTasks = tasks.filter(task => {
        // 1. Must be Completed
        if (task.status !== 'Completed') return false;

        // 2. Review Status (Pending vs Reviewed)
        const isReviewed = task.rating !== null && task.rating !== undefined;
        if (showReviewed && !isReviewed) return false;
        if (!showReviewed && isReviewed) return false;

        // 3. Analyst Filter
        if (filterAnalyst && String(task.assigned_user_id) !== String(filterAnalyst)) return false;

        // 4. Date Filter (Created At)
        if (filterDate) {
            const taskDate = new Date(task.created_at);
            const filterDateObj = new Date(filterDate);

            // Compare year, month, day in local time
            if (
                taskDate.getFullYear() !== filterDateObj.getFullYear() ||
                taskDate.getMonth() !== filterDateObj.getMonth() ||
                taskDate.getDate() !== filterDateObj.getDate() + 1 // Input date is usually 00:00, need to check if offset is needed or just use string split on local
            ) {
                // Simpler approach: Compare YYYY-MM-DD strings in local time
                const taskDateStr = new Date(task.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD format
                if (taskDateStr !== filterDate) return false;
            }
        }

        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Task Reviews</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review completed tasks and ensure quality.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setShowReviewed(false)}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all",
                            !showReviewed ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Pending Review
                    </button>
                    <button
                        onClick={() => setShowReviewed(true)}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all",
                            showReviewed ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Reviewed History
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Filter size={16} />
                    Filters:
                </div>

                {/* Analyst Filter */}
                <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        value={filterAnalyst}
                        onChange={(e) => setFilterAnalyst(e.target.value)}
                        className="pl-9 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Analysts</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.full_name}</option>
                        ))}
                    </select>
                </div>

                {/* Date Filter */}
                <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                {(filterAnalyst || filterDate) && (
                    <button
                        onClick={() => { setFilterAnalyst(''); setFilterDate(''); }}
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Tasks Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Analyst</th>
                                <th className="px-6 py-4 text-center">Qty</th>
                                <th className="px-6 py-4">Status</th>
                                {showReviewed && <th className="px-6 py-4">Rating</th>}
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
                            ) : filteredTasks.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">No tasks found.</td></tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr key={task.task_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(task.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {task.company_name}
                                            <div className="text-xs text-slate-500 font-normal">{task.document_type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                    {getUserName(task.assigned_user_id).charAt(0)}
                                                </div>
                                                <span>{getUserName(task.assigned_user_id)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {task.achieved_qty} / {task.target_qty}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                                                Completed
                                            </span>
                                        </td>
                                        {showReviewed && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                    <Star size={14} fill="currentColor" />
                                                    {task.rating}/5
                                                </div>
                                                <div className="text-xs text-slate-500">{task.error_status}</div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openReviewModal(task)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm shadow-primary-600/20"
                                            >
                                                <Star size={14} />
                                                {showReviewed ? 'Update Review' : 'Review Task'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ReviewTaskModal
                isOpen={reviewModalData.isOpen}
                onClose={() => setReviewModalData({ ...reviewModalData, isOpen: false })}
                task={reviewModalData.task}
                onUpdate={fetchData}
            />
        </div>
    );
};

export default Reviews;
