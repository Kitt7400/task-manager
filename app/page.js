"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL, ACTIVE, COMPLETED
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const API = "/api/tasks";

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(API);
            if (!res.ok) throw new Error("Failed to fetch tasks");
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add task
    const handleAddTask = async (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError("Task title cannot be empty.");
            return;
        }

        try {
            setError("");
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: trimmedTitle }),
            });
            if (!res.ok) throw new Error("Failed to add task");
            setTitle("");
            fetchTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    // Toggle task
    const handleToggleTask = async (task) => {
        try {
            setError("");
            const res = await fetch(API, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: task.id, completed: !task.completed }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            fetchTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete task
    const handleDeleteTask = async (id) => {
        try {
            setError("");
            const res = await fetch(API, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error("Failed to delete task");
            fetchTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    // Start editing
    const startEditing = (task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
    };

    // Save edit
    const handleSaveEdit = async (id) => {
        const trimmed = editTitle.trim();
        if (!trimmed) {
            setEditingId(null);
            return;
        }
        try {
            setError("");
            const res = await fetch(API, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, title: trimmed }),
            });
            if (!res.ok) throw new Error("Failed to update task");
            setEditingId(null);
            fetchTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    // Keyboard support for editing
    const handleEditKeyDown = (e, id) => {
        if (e.key === "Enter") handleSaveEdit(id);
        if (e.key === "Escape") setEditingId(null);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "ACTIVE") return !task.completed;
        if (filter === "COMPLETED") return task.completed;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans p-4 md:p-12 flex justify-center selection:bg-indigo-500/30">
            <div className="max-w-2xl w-full flex flex-col gap-8 items-center pt-10">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Taskify
                    </h1>
                    <p className="text-neutral-400 font-medium">Manage your day, effortlessly.</p>
                </div>

                <div className="w-full bg-[#141414] border border-white/5 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-xl transition-all">
                    
                    {/* Error State */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-between">
                            <span>{error}</span>
                            <button onClick={() => setError("")} className="hover:text-red-300">
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Input Form */}
                    <form onSubmit={handleAddTask} className="flex gap-3 mb-8 relative">
                        <input
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                        />
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]"
                        >
                            Add Task
                        </button>
                    </form>

                    {/* Filters */}
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
                        <div className="flex gap-2">
                            {["ALL", "ACTIVE", "COMPLETED"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${
                                        filter === f
                                            ? "bg-white/10 text-white shadow-sm"
                                            : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="text-sm text-neutral-500 font-medium">
                            {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="py-10 flex flex-col items-center justify-center gap-4 animate-pulse">
                            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="text-neutral-500 text-sm font-medium">Loading tasks...</p>
                        </div>
                    )}

                    {/* Task List */}
                    {!loading && filteredTasks.length === 0 && (
                        <div className="py-12 text-center text-neutral-500">
                            <div className="text-4xl mb-3 opacity-50">✨</div>
                            <p>No tasks found. You&apos;re all caught up!</p>
                        </div>
                    )}

                    {!loading && (
                        <ul className="space-y-3">
                            {filteredTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-transparent hover:border-white/10 transition-all hover:bg-white/[0.04]"
                                >
                                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                        <button
                                            onClick={() => handleToggleTask(task)}
                                            className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                                                task.completed
                                                    ? "bg-emerald-500 border-emerald-500"
                                                    : "border-neutral-600 hover:border-indigo-400"
                                            }`}
                                        >
                                            {task.completed && (
                                                <svg
                                                    className="w-3.5 h-3.5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>

                                        {editingId === task.id ? (
                                            <input
                                                autoFocus
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onBlur={() => handleSaveEdit(task.id)}
                                                onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                                                className="flex-1 bg-black/30 border border-indigo-500/50 rounded-lg px-3 py-1.5 text-white focus:outline-none"
                                            />
                                        ) : (
                                            <span
                                                onDoubleClick={() => startEditing(task)}
                                                className={`flex-1 truncate text-base transition-all duration-300 ${
                                                    task.completed
                                                        ? "text-neutral-500 line-through decoration-neutral-500/50"
                                                        : "text-neutral-200"
                                                }`}
                                            >
                                                {task.title}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!task.completed && editingId !== task.id && (
                                            <button
                                                onClick={() => startEditing(task)}
                                                className="text-neutral-500 hover:text-indigo-400 p-2"
                                                title="Edit task (Double click title)"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-neutral-500 hover:text-red-400 p-2"
                                            title="Delete task"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="text-center text-xs text-neutral-600 flex gap-4">
                    <span>Double-click a task to edit</span>
                    <span>•</span>
                    <span>Press Enter to save</span>
                </div>
            </div>
        </div>
    );
}