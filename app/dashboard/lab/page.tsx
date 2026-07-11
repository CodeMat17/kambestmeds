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

const MAX_ITEMS = 10;
const MAX_VIDEO_BYTES = 18 * 1024 * 1024;

export default function LabDashboardPage() {
  const items = useQuery(api.labMedia.list);
  const generateUploadUrl = useMutation(api.labMedia.generateUploadUrl);
  const optimizeUpload = useAction(api.images.optimizeUpload);
  const createItem = useMutation(api.labMedia.create);
  const removeItem = useMutation(api.labMedia.remove);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: Id<"labMedia">; caption: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const atCap = (items?.length ?? 0) >= MAX_ITEMS;

  function resetForm() {
    setCaption("");
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
    const type = file.type.startsWith("video/") ? "video" : "image";
    if (type === "video" && file.size > MAX_VIDEO_BYTES) {
      toast.error("Video must be under 18MB.");
      e.target.value = "";
      return;
    }
    setPreview({ url: URL.createObjectURL(file), type });
  }

  async function uploadFile(file: File, type: "image" | "video") {
    if (type === "video") {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed.");
      const { storageId } = await res.json();
      return storageId;
    }

    const decodable = await ensureJimpDecodable(file);
    const uploadUrl = await generateUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": decodable.type },
      body: decodable,
    });
    if (!res.ok) throw new Error("Upload failed.");
    const { storageId } = await res.json();
    return await optimizeUpload({ storageId });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please choose a photo or video.");
      return;
    }
    if (atCap) {
      toast.error(`Maximum of ${MAX_ITEMS} items reached — delete one to add another.`);
      return;
    }

    const type = file.type.startsWith("video/") ? "video" : "image";
    setSubmitting(true);
    try {
      const storageId = await uploadFile(file, type);
      await createItem({ storageId, type, caption: caption.trim() || undefined });
      toast.success("Added to lab gallery.");
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
      await removeItem({ id: deleteTarget.id });
      toast.success("Item deleted.");
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
          <h1 className="text-xl font-bold">Lab Gallery</h1>
          <p className="text-sm text-muted-foreground">
            {items?.length ?? 0} / {MAX_ITEMS} items
          </p>
        </div>
        <Button onClick={openAddSheet} disabled={atCap}>
          Add media
        </Button>
      </div>
      {atCap && (
        <p className="mb-4 text-sm text-muted-foreground">
          Maximum of {MAX_ITEMS} items reached — delete one to add another.
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
            <SheetTitle>Add lab media</SheetTitle>
            <SheetDescription>
              Upload a photo or short video of a lab machine.
            </SheetDescription>
          </SheetHeader>
          <form
            id="lab-media-form"
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4"
          >
            <div className="grid gap-1.5">
              <Label htmlFor="lm-file">Photo or video</Label>
              {preview && preview.type === "image" && (
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-md border border-border/60 bg-muted">
                  <Image
                    src={preview.url}
                    alt="Preview"
                    fill
                    sizes="360px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              {preview && preview.type === "video" && (
                <video
                  src={preview.url}
                  muted
                  playsInline
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  className="aspect-4/3 w-full rounded-md border border-border/60 bg-muted object-cover"
                />
              )}
              <Input
                id="lm-file"
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Images are automatically optimized. Videos must be under 18MB.
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lm-caption">Caption (optional)</Label>
              <Input id="lm-caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
          </form>
          <SheetFooter className="flex-row justify-end">
            <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="lab-media-form" disabled={submitting}>
              {submitting ? "Saving…" : "Add"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items === undefined && <p className="text-muted-foreground">Loading…</p>}
        {items?.length === 0 && <p className="text-muted-foreground">No lab media yet.</p>}
        {items?.map((item) => (
          <Card key={item._id} className="overflow-hidden p-0">
            <div className="relative aspect-4/3 bg-muted">
              {item.mediaUrl && item.type === "image" && (
                <Image
                  src={item.mediaUrl}
                  alt={item.caption ?? "Lab machine"}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              )}
              {item.mediaUrl && item.type === "video" && (
                <video
                  src={item.mediaUrl}
                  muted
                  playsInline
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  className="size-full object-cover"
                />
              )}
            </div>
            {item.caption && (
              <p className="line-clamp-2 px-4 text-xs text-muted-foreground">{item.caption}</p>
            )}
            <div className="flex gap-2 border-t border-border/60 p-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => setDeleteTarget({ id: item._id, caption: item.caption ?? "this item" })}
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
            <AlertDialogTitle>Delete “{deleteTarget?.caption}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The media will be permanently removed.
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
