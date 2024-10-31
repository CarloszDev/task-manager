import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
function TaskForm({ isOpen, onClose, onSubmit, formData, setFormData, isEditing }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      transition
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
        />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
      <DialogPanel  transition className="max-w-lg space-y-4 border bg-white p-12">

        <div className="bg-white rounded-lg p-6 z-20">
        <DialogTitle className="text-lg font-bold mb-4">
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Nome da Tarefa</label>
              <input
                type="text"
                value={formData.nome_da_tarefa}
                onChange={(e) => setFormData({
                  ...formData,
                  nome_da_tarefa: e.target.value
                })}
                required
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.custo}
                onChange={(e) => setFormData({
                  ...formData,
                  custo: e.target.value
                })}
                required
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Data Limite</label>
              <input
                type="date"
                value={formData.data_limite}
                onChange={(e) => setFormData({
                  ...formData,
                  data_limite: e.target.value
                })}
                required
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex justify-around space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-900 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default TaskForm;