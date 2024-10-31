import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DeleteConfirmationDialog from './DialogDelete.jsx';

function TaskItem({ task, onEdit, onDelete }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedCost = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(task.custo);

  const handleDelete = () => {
    onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`p-4 mb-2 border rounded-lg flex justify-between items-center shadow-xl text-black
          ${Number(task.custo) >= 1000 ? 'bg-yellow-300/90' : 'bg-white'}`}
      >
        <div 
          className="flex-1 cursor-move" 
          {...attributes} 
          {...listeners}
        >
          <h3 className="font-bold">{task.nome_da_tarefa}</h3>
          <p>ID: {task.id}</p>
          <p>Custo: {formattedCost}</p>
          <p>Data Limite: {new Date(task.data_limite).toLocaleDateString()}</p>
        </div>

        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:animate-pulse"
          >
            <FaEdit className='text-xl' />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:animate-pulse"
          >
            <FaTrashAlt className='text-xl' />
          </button>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default TaskItem;
