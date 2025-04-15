import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export default function ConfirmDialog({ open, onClose, onConfirm, userName }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
      >
        <Typography id="alert-dialog-modal-title" level="h2">
          Confirmación
        </Typography>
        <Typography id="alert-dialog-modal-description" sx={{ mt: 2 }}>
          ¿Estás seguro que quieres eliminar a {userName}?
          <br />
          <strong>Esta acción no se puede deshacer.</strong>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button variant="plain" color="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="solid" color="danger" onClick={onConfirm}>
            Confirmar
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}