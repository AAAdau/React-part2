import React, { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from './api';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    // 获取任务列表
    useEffect(() => {
        getTasks().then(data => setTasks(data));
    }, []);

    // 添加任务
    const handleAddTask = () => {
        const newTask = { title: '新任务', completed: false };
        addTask(newTask).then(task => setTasks([...tasks, task]));
    };

    // 更新任务
    const handleUpdateTask = (id) => {
        const updatedTask = { ...tasks.find(task => task.id === id), completed: true };
        updateTask(id, updatedTask).then(() => {
            setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
        });
    };

    // 删除任务
    const handleDeleteTask = (id) => {
        deleteTask(id).then(() => {
            setTasks(tasks.filter(task => task.id !== id));
        });
    };

    return (
        <div>
            <h1>任务列表</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title} - {task.completed ? '完成' : '未完成'}
                        <button onClick={() => handleUpdateTask(task.id)}>完成</button>
                        <button onClick={() => handleDeleteTask(task.id)}>删除</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleAddTask}>添加任务</button>
        </div>
    );
};

export default TaskList;
