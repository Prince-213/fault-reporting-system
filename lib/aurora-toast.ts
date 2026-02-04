import { toast } from "sonner";
import { AuroraBackgroundToast } from "@/components/AuroraBackgroundToast";

export const showAuroraToast = (title: string, description?: string) => {
  toast.custom((t) => (
    <AuroraBackgroundToast
      t={t}
      title={title}
      description={description}
      onDismiss={() => toast.dismiss(t)}
    />
  ));
};
