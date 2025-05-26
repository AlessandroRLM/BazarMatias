import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({ 
  open, 
  title, 
  content, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
      >
        <Typography id="alert-dialog-modal-title" level="h2">
          {title}
        </Typography>
        <Typography id="alert-dialog-modal-description" sx={{ mt: 2 }}>
          {content}
          <br />
          <strong>Esta acción no se puede deshacer.</strong>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button 
            variant="plain" 
            color="neutral" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="solid" 
            color="danger" 
            onClick={onConfirm}
            loading={isLoading}
            startDecorator={isLoading ? <CircularProgress size="sm" /> : null}
          >
            Confirmar
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}