import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/dashboard.css";
import Navbar from "./Navbar";
import logo from '../../src/logo2-transparent-png.png';
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({ title: "", description: "" });
    const [page, setPage] = useState(1);
    const limit = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("auth_token");
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = document.getElementById("canvas-club");
        const ctx = canvas.getContext("2d");

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        let clearColor = 'rgba(0, 0, 0, .1)';
        let max = 30;
        let drops = [];

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        class Drop {
            constructor() {
                this.init();
            }

            init() {
                this.x = random(0, w);
                this.y = 0;
                this.color = 'hsl(180, 100%, 50%)';
                this.w = 2;
                this.h = 1;
                this.vy = random(2, 3); // Falling speed
                this.vw = 3;
                this.vh = 1;
                this.size = 2;
                this.hit = random(h * 0.8, h * 0.9);
                this.a = 1;
                this.va = 0.96;
            }

            draw() {
                if (this.y > this.hit) {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y - this.h / 2);
                    ctx.bezierCurveTo(
                        this.x + this.w / 2, this.y - this.h / 2,
                        this.x + this.w / 2, this.y + this.h / 2,
                        this.x, this.y + this.h / 2
                    );
                    ctx.bezierCurveTo(
                        this.x - this.w / 2, this.y + this.h / 2,
                        this.x - this.w / 2, this.y - this.h / 2,
                        this.x, this.y - this.h / 2
                    );
                    ctx.strokeStyle = `hsla(180, 100%, 50%, ${this.a})`;
                    ctx.stroke();
                    ctx.closePath();
                } else {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x, this.y, this.size, this.size * 5);
                }
                this.update();
            }

            update() {
                if (this.y < this.hit) {
                    this.y += this.vy;
                } else {
                    if (this.a > 0.03) {
                        this.w += this.vw;
                        this.h += this.vh;
                        if (this.w > 100) {
                            this.a *= this.va;
                            this.vw *= 0.98;
                            this.vh *= 0.98;
                        }
                    } else {
                        this.init();
                    }
                }
            }
        }

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        function setup() {
            for (let i = 0; i < max; i++) {
                setTimeout(() => {
                    drops.push(new Drop());
                }, i * 200);
            }
        }

        function animate() {
            ctx.fillStyle = clearColor;
            ctx.fillRect(0, 0, w, h);
            drops.forEach(drop => drop.draw());
            requestAnimationFrame(animate);
        }

        window.addEventListener("resize", resize);
        setup();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    // Fetch tasks from API-free.app/tasks/gettasks?page=${page}&limit=${limit}`,
    const fetchTasks = async () => {
        setLoading(true);
        try {
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get(`http://localhost:5500/tasks/gettasks?page=${page}&limit=${limit}`,
            // const response = await axios.get(`https://mern-backend-acet.onrender.com/tasks/gettasks?page=${page}&limit=${limit}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
            setTasks(response.data.tasks);
            setTotalPages(response.data.totalPages);

            console.log("Fetched tasks:", response.data.tasks);
        }
        catch (error) {
            console.error("Error fetching tasks:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks();
        // }, [page, token, navigate]);
    }, [page, !!token]);

    const addTask = async () => {
        if (!newTask.title.trim() || !newTask.description.trim() || !newTask.deadline || !newTask.reminderTime) return;

        if (new Date(newTask.deadline) <= new Date()) {
            alert("Deadline must be in the future.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5500/tasks/posttasks",
                // "https://mern-backend-acet.onrender.com/tasks/posttasks",
                {
                    title: newTask.title.trim(),
                    description: newTask.description.trim(),
                    deadline: newTask.deadline,
                    reminderTime: newTask.reminderTime
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
            console.log("posted data", response.data);
            setTasks([response.data, ...tasks]);
            setNewTask({ title: "", description: "", deadline: "", reminderTime: "" });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };


    const deleteTask = async (taskId) => {
        try {
            // await axios.delete(`http://localhost:5500/tasks/deletetasks/${taskId}`, {
            await axios.delete(`https://mern-backend-acet.onrender.com/tasks/deletetasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditedTask({ title: task.title, description: task.description, reminderTime: task.reminderTime, deadline: task.deadline });
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditedTask({ title: "", description: "", deadline: "", reminderTime: "" });
    };

    const saveTaskUpdate = async (taskId) => {
        try {
            const response = await axios.put(
                `http://localhost:5500/tasks/puttasks/${taskId}`,
                // `https://mern-backend-acet.onrender.com/tasks/puttasks/${taskId}`,
                {
                    title: editedTask.title.trim(),
                    description: editedTask.description.trim(),
                    deadline: editedTask.deadline,
                    reminderTime: editedTask.reminderTime
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(tasks.map((task) => (task._id === taskId ? { ...task, ...response.data } : task)));
            setEditingTaskId(null);
            setEditedTask({ title: "", description: "", deadline: "", reminderTime: "" });
            console.log("Updated task:", editedTask);
        } catch (error) {
            console.error("Error updating task:", error.response?.data || error);
        }
    };

    return (
        <>
            {/* Background Canvas */}
            <canvas id="canvas-club"></canvas>

            {/* Main Content */}
            <div className="dashboard-container">
                <div className="container">
                    <Navbar />

                    {/* Add Task Section */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex flex-row align-items-center justify-content-between">
                                <h4 className="add_task text-warning">Add New Task</h4>
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="login_logo d-flex flex-row "
                                    style={{ pointerEvents: 'auto' }} // Make sure it's clickable
                                />
                            </div>

                            <input
                                type="text"
                                className="task-input-title mt-3"
                                placeholder="Task Title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                            <input
                                type="text"
                                className="task-input-description mt-3"
                                placeholder="Task Description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                            <div className="scheduler">
                                <div className="d-flex flex-row mb-2">
                                    <label className="d-flex align-items-center justify-content-center display-7">deadline</label>
                                    <input type="datetime-local" className="task-input-deadline ms-2" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} />
                                </div>
                                <div className="d-flex flex-row">
                                    <label className="d-flex align-items-center justify-content-center">remind at</label>
                                    <input type="datetime-local" className="task-input-reminder ms-2" value={newTask.reminderTime} onChange={(e) => setNewTask({ ...newTask, reminderTime: e.target.value })} />
                                </div>
                            </div>

                            <div className="d-flex justify-content-center align-items-center">
                                <button className="add_taskbtn btn-primary" onClick={addTask}>Add Task</button>
                            </div>

                        </div>
                    </div>

                    {/* Task List */}
                    <h1 className="mt-5 text-white">Your Tasks</h1>
                    {loading ? (
                        <p className="text-warning">Loading tasks...</p>
                    ) : (
                        <div className="task-list mt-4">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task._id} className="card mt-2">
                                        <div className="card-body">
                                            {editingTaskId === task._id ? (
                                                <div className="updated_fields d-flex flex-column">
                                                    <h4 className="text-warning">Update Task</h4>
                                                    <input
                                                        type="text"
                                                        value={editedTask.title}
                                                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                                        className="task-input-title mt-3"
                                                        placeholder="Task Title"
                                                    />
                                                    <textarea
                                                        value={editedTask.description}
                                                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                                        className="task-input-description mt-3"
                                                        placeholder="Task Description"
                                                    />

                                                    <div className="scheduler">
                                                        <div className="d-flex flex-row mb-2">
                                                            <label className="d-flex align-items-center justify-content-center display-7">deadline</label>
                                                            <input type="datetime-local" className="task-input-deadline ms-2" value={editedTask.deadline} onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })} />
                                                        </div>
                                                        <div className="d-flex flex-row">
                                                            <label className="d-flex align-items-center justify-content-center">remind at</label>
                                                            <input type="datetime-local" className="task-input-reminder ms-2" value={editedTask.reminderTime} onChange={(e) => setEditedTask({ ...editedTask, reminderTime: e.target.value })} />
                                                        </div>
                                                    </div>


                                                    <div className="button-group mt-2">
                                                        <button onClick={() => saveTaskUpdate(task._id)} className="btn btn-success me-2">Save</button>
                                                        <button onClick={cancelEditing} className="btn btn-secondary">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h5 style={{ color: "red" }}>{task.title}</h5>
                                                    <p>{task.description}</p>
                                                    {/* <p><strong>Created:</strong> {formatDate(task.createdAt)}</p> */}
                                                    <p><strong>Created:</strong> {moment(task.createdAt).format("DD/MM/YYYY, hh:mm A")}</p>
                                                    {/* <p><strong>Updated:</strong> {formatDate(task.updatedAt)}</p> */}
                                                    <p><strong>Updated:</strong> {moment(task.updatedAt).format("DD/MM/YYYY, hh:mm A")}</p>
                                                    {/* <p><strong>Deadline:</strong> {formatDate(task.deadline)}</p> */}
                                                    <p><strong>Deadline:</strong> {moment(task.deadline).format("DD/MM/YYYY, hh:mm A")}</p>
                                                    {/* <p><strong>Reminder Time:</strong> {formatDate(task.reminderTime)}</p> */}
                                                    <p><strong>Reminder Time:</strong> {moment(task.reminderTime).format("DD/MM/YYYY, hh:mm A")}</p>
                                                    <div className="button-group">
                                                        <button onClick={() => startEditing(task)} className="btn btn-warning me-2">Edit</button>
                                                        <button onClick={() => deleteTask(task._id)} className="btn btn-danger">Delete</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white">No tasks available.</div>
                            )}
                        </div>
                    )}


                    {/* Pagination Controls */}
                    <div className="pagination mt-4 justify-content-center align-items-center">
                        <button className="btn btn-info" disabled={page === 1} onClick={() => setPage(page - 1)} >Previous</button>
                        <span className="text-light align-align-items-center justify-content-center me-2 ms-2">{page} of {totalPages}</span>
                        {/* <button className="btn btn-info " disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button> */}
                        <button className="btn btn-info" disabled={tasks.length === 0 || page >= totalPages} onClick={() => setPage(page + 1)} >Next</button>
                    </div>
                </div>

            </div>
        </>
    );
};
export default Dashboard;