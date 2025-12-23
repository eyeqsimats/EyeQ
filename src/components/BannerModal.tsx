import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const BannerModal = ({ isOpen, onClose, title, description }: BannerModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-primary/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary mb-4">
            {title}
          </DialogTitle>
          <DialogDescription className="text-lg text-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BannerModal;
