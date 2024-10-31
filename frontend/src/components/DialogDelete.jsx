import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

function DeleteConfirmationDialog({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      transition
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-sm space-y-4 bg-white border rounded-lg p-6 shadow-lg">
          <DialogTitle className="text-lg font-bold">Confirmação de Exclusão</DialogTitle>
          <p className="text-gray-700">
            Tem certeza de que deseja excluir esta tarefa?
          </p>

          <div className="flex justify-around space-x-4 pt-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Excluir
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
