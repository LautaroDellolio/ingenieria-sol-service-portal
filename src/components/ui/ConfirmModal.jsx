import Modal from './Modal'

export default function ConfirmModal({ open, title, children, confirmLabel = 'Confirmar', danger = false, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      actions={[
        { label: 'Cancelar', variant: 'secondary-outline', onClick: onCancel },
        { label: confirmLabel, variant: danger ? 'destructive-outline' : 'primary', onClick: onConfirm },
      ]}
    >
      <p className="font-body-md text-body-md text-on-surface-variant">{children}</p>
    </Modal>
  )
}
