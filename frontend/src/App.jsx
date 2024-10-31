import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://task-manager-3pye.onrender.com'
  : 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    nome_da_tarefa: '',
    custo: '',
    data_limite: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const method = currentTask ? 'PUT' : 'POST';
    const url = currentTask 
      ? `${API_URL}/tasks/${currentTask.id}`
      : `${API_URL}/tasks`;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setIsModalOpen(false);
      setCurrentTask(null);
      setFormData({ nome_da_tarefa: '', custo: '', data_limite: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setFormData(task);
    setIsModalOpen(true);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
  
    const oldIndex = result.source.index;
    const newIndex = result.destination.index;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, reorderedItem);
  
    const updatedItems = items.map((item, index) => ({
      ...item,
      ordem: index + 1
    }));
  
    setTasks(updatedItems);
  
    try {
      await fetch(`${API_URL}/tasks/${reorderedItem.id}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newOrdem: newIndex + 1,
          oldOrdem: oldIndex + 1
        })
      });
    } catch (error) {
      console.error('Error:', error);
      fetchTasks();
    }
  };

  return (
    <div className="container mx-auto p-4 text-slate-800">
      <h1 className="text-2xl font-bold mb-4 text-center">Gerenciador De Tarefas</h1>
      <h3 className="text-base font-bold mb-8 text-center text-slate-700">Crie e organize suas Tarefas</h3>
      
      <TaskList
        tasks={tasks}
        onDragEnd={onDragEnd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <button
        onClick={() => {
          setCurrentTask(null);
          setFormData({ nome_da_tarefa: '', custo: '', data_limite: '' });
          setIsModalOpen(true);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:animate-bounce"
      >
        Nova Tarefa
      </button>

      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!currentTask}
      />

    <footer className="fixed bottom-0 right-4 left-4 bg-transparent text-center p-4  text-black text-sm">
      <p>&copy; {new Date().getFullYear()} Carlos Cauan.</p>
    </footer>
    </div>
  );
}

export default App;