"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useAction, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ensureJimpDecodable } from "@/lib/image";

const MAX_ITEMS = 4;

export default function TeamDashboardPage() {
  const items = useQuery(api.team.list);
  const generateUploadUrl = useMutation(api.team.generateUploadUrl);
  const optimizeUpload = useAction(api.images.optimizeUpload);
  const createItem = useMutation(api.team.create);
  const removeItem = useMutation(api.team.remove);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Id<"teamMembers"> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const atCap = (items?.length ?? 0) >= MAX_ITEMS;

  function resetForm() {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openAddSheet() {
    resetForm();
    setSheetOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please choose a photo.");
      return;
    }
    if (atCap) {
      toast.error(`Maximum of ${MAX_ITEMS} team members reached — delete one to add another.`);
      return;
    }

    setSubmitting(true);
    try {
      const decodable = await ensureJimpDecodable(file);
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": decodable.type },
        body: decodable,
      });
      if (!res.ok) throw new Error("Upload failed.");
      const { storageId } = await res.json();
      const optimizedId = await optimizeUpload({ storageId });
      await createItem({ storageId: optimizedId });
      toast.success("Team member added.");
      resetForm();
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeItem({ id: deleteTarget });
      toast.success("Team member deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Our Team</h1>
          <p className="text-sm text-muted-foreground">
            {items?.length ?? 0} / {MAX_ITEMS} members
          </p>
        </div>
        <Button onClick={openAddSheet} disabled={atCap}>
          Add member
        </Button>
      </div>
      {atCap && (
        <p className="mb-4 text-sm text-muted-foreground">
          Maximum of {MAX_ITEMS} members reached — delete one to add another.
        </p>
      )}

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) resetForm();
        }}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add team member</SheetTitle>
            <SheetDescription>Upload a photo.</SheetDescription>
          </SheetHeader>
          <form
            id="team-member-form"
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4"
          >
            <div className="grid gap-1.5">
              <Label htmlFor="tm-file">Photo</Label>
              {preview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border/60 bg-muted">
                  <Image src={preview} alt="Preview" fill sizes="320px" className="object-cover" unoptimized />
                </div>
              )}
              <Input
                id="tm-file"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <p className="text-xs text-muted-foreground">Images are automatically optimized.</p>
            </div>
          </form>
          <SheetFooter className="flex-row justify-end">
            <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="team-member-form" disabled={submitting}>
              {submitting ? "Saving…" : "Add"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items === undefined && <p className="text-muted-foreground">Loading…</p>}
        {items?.length === 0 && <p className="text-muted-foreground">No team members yet.</p>}
        {items?.map((item) => (
          <Card key={item._id} className="overflow-hidden p-0">
            <div className="relative aspect-video rounded-md bg-muted">
              {item.photoUrl && (
                <Image src={item.photoUrl} alt="" fill sizes="300px" className="object-cover" />
              )}
            </div>
            <div className="flex gap-2 border-t border-border/60 p-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => setDeleteTarget(item._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The team member will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
