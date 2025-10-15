import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickInvoice() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
  });

  const { data: timeEntries } = useQuery({
    queryKey: ["/api/time-entries"],
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const response = await apiRequest("POST", "/api/invoices", invoiceData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice generated", description: "Invoice has been created successfully" });
    },
  });

  const calculateInvoicePreview = () => {
    if (!selectedClient || !fromDate || !toDate) {
      return { totalHours: 0, hourlyRate: 0, subtotal: 0, tax: 0, total: 0 };
    }

    const client = clients?.find((c: any) => c.id === selectedClient);
    const hourlyRate = parseFloat(client?.hourlyRate || "0");

    const clientProjects = timeEntries?.filter((entry: any) => {
      // This is simplified - in a real app, you'd join with projects table
      const entryDate = new Date(entry.createdAt);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return entryDate >= from && entryDate <= to;
    }) || [];

    const totalMinutes = clientProjects.reduce((sum: number, entry: any) => sum + entry.duration, 0);
    const totalHours = totalMinutes / 60;
    const subtotal = totalHours * hourlyRate;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    return { totalHours, hourlyRate, subtotal, tax, total };
  };

  const preview = calculateInvoicePreview();

  const handleGenerateInvoice = () => {
    if (!selectedClient || !fromDate || !toDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const invoiceData = {
      clientId: selectedClient,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      subtotal: preview.subtotal.toFixed(2),
      tax: preview.tax.toFixed(2),
      total: preview.total.toFixed(2),
    };

    generateInvoiceMutation.mutate(invoiceData);
  };

  return (
    <Card className="glass cosmic-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-stellar-white">
            {t("invoicing.title")}
          </CardTitle>
          <Button
            onClick={handleGenerateInvoice}
            className="px-4 py-2 bg-gradient-to-r from-cosmic-accent to-purple-600 font-medium hover:scale-105 transition-all duration-300"
            disabled={generateInvoiceMutation.isPending}
          >
            <FileText className="w-4 h-4 mr-2" />
            {t("invoicing.generate")}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Client Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-300 mb-2">
            {t("invoicing.client")}
          </Label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-full bg-space-blue text-stellar-white border-neon-blue/30">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client: any) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} - {client.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2">
              {t("invoicing.from")}
            </Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-space-blue text-stellar-white border-neon-blue/30"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-2">
              {t("invoicing.to")}
            </Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-space-blue text-stellar-white border-neon-blue/30"
            />
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-space-blue/50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-stellar-white mb-3">
            {t("invoicing.preview")}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Hours:</span>
              <span className="text-stellar-white font-mono">
                {preview.totalHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hourly Rate:</span>
              <span className="text-stellar-white font-mono">
                ${preview.hourlyRate.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-stellar-white font-mono">
                ${preview.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax (8%):</span>
              <span className="text-stellar-white font-mono">
                ${preview.tax.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-neon-blue/30 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-neon-blue font-semibold">Total:</span>
                <span className="text-neon-blue font-mono font-bold text-lg">
                  ${preview.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
