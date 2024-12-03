const API_URL = 'http://localhost:3001/tasks'; // 使用本地 JSON Server 的 URL

// 获取任务
export const getTasks = () =>
    fetch(API_URL).then(response => response.json());

// 添加任务
export const addTask = (task) =>
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    }).then(response => response.json());

// 更新任务
export const updateTask = (id, updatedTask) =>
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
    }).then(response => response.json());

// 删除任务
export const deleteTask = (id) =>
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
