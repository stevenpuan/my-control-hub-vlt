import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseCrudOptions {
  table: string;
  queryKey: string | string[];
  labelName?: string;
}

export function useCrud<T extends { id: string | number }>({ table, queryKey, labelName }: UseCrudOptions) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  const name = labelName ?? "資料";

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (row: T) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const submit = async (values: Record<string, any>, transform?: (v: Record<string, any>) => Record<string, any>) => {
    const payload = transform ? transform(values) : values;
    try {
      if (editing) {
        const { error } = await (supabase as any).from(table).update(payload).eq("id", (editing as any).id);
        if (error) throw error;
        toast.success("已更新");
      } else {
        const { error } = await (supabase as any).from(table).insert(payload);
        if (error) throw error;
        toast.success("新增成功");
      }
      queryClient.invalidateQueries({ queryKey: key });
      setDialogOpen(false);
    } catch (e) {
      toast.error(`${name}操作失敗`, { description: (e as Error).message });
    }
  };

  const remove = async (row: T) => {
    const { error } = await (supabase as any).from(table).delete().eq("id", row.id);
    if (error) {
      toast.error(`${name}刪除失敗`, { description: error.message });
      return;
    }
    toast.success("已刪除");
    queryClient.invalidateQueries({ queryKey: key });
  };

  return { dialogOpen, setDialogOpen, editing, openCreate, openEdit, submit, remove };
}
