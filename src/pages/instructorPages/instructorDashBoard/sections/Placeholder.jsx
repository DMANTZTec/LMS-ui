import { Construction } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Placeholder({ item, onBack }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed bg-white/50 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
        <Construction className="h-7 w-7 text-[#155DFC]" />
      </div>

      <h2 className="mt-4 text-lg font-semibold">{item}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        This section is under construction. Dummy data will be connected to the
        backend APIs once available.
      </p>

      <Button size="sm" variant="outline" className="mt-5" onClick={onBack}>
        Back to Dashboard
      </Button>
    </div>
  );
}
