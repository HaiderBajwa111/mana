"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PrintersClientProps {
  userId: string;
}

type PrinterRow = {
  id: string;
  name: string;
  notes?: string;
};

export default function PrintersClient({ userId }: PrintersClientProps) {
  const [rows, setRows] = useState<PrinterRow[]>([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const addPrinter = () => {
    if (!name.trim()) return;
    setRows((r) => [{ id: crypto.randomUUID(), name, notes }, ...r]);
    setName("");
    setNotes("");
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Printer Inventory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Printer name (e.g., Bambu X1C)" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Notes (material, nozzle, etc.)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button onClick={addPrinter}>Add</Button>
        </div>
        <Separator />
        <div className="space-y-2">
          {rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No printers added yet.</div>
          ) : (
            rows.map((p) => (
              <div key={p.id} className="p-3 rounded-md border border-border flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  {p.notes && <div className="text-sm text-muted-foreground">{p.notes}</div>}
                </div>
                <Button variant="outline" size="sm" onClick={() => setRows((r) => r.filter((x) => x.id !== p.id))}>Remove</Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}


