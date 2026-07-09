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
import { Textarea } from "@/components/ui/textarea";
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

const DEFAULT_AMOUNT = "5000";

export default function ProductsDashboardPage() {
  const products = useQuery(api.products.list);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const optimizeUpload = useAction(api.images.optimizeUpload);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [name, setName] = useState("");
  const [cures, setCures] = useState("");
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: Id<"products">; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function resetForm() {
    setEditingId(null);
    setName("");
    setCures("");
    setAmount(DEFAULT_AMOUNT);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openAddSheet() {
    resetForm();
    setSheetOpen(true);
  }

  function startEdit(p: NonNullable<typeof products>[number]) {
    setEditingId(p._id);
    setName(p.name);
    setCures(p.cures);
    setAmount(p.amount);
    setImagePreview(p.imageUrl ?? null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSheetOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  async function uploadImage(file: File) {
    file = await ensureJimpDecodable(file);
    const uploadUrl = await generateUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("Upload failed.");
    const { storageId } = await res.json();
    return await optimizeUpload({ storageId });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !cures.trim() || !amount.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (!editingId && !file) {
      toast.error("Please choose a product image.");
      return;
    }

    setSubmitting(true);
    try {
      const imageId = file ? await uploadImage(file) : undefined;

      if (editingId) {
        await updateProduct({ id: editingId, name, cures, amount, imageId });
        toast.success("Product updated.");
      } else {
        await createProduct({ name, cures, amount, imageId: imageId! });
        toast.success("Product added.");
      }
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
      await removeProduct({ id: deleteTarget.id });
      toast.success("Product deleted.");
      if (editingId === deleteTarget.id) {
        resetForm();
        setSheetOpen(false);
      }
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
        <h1 className="text-xl font-bold">Products</h1>
        <Button onClick={openAddSheet}>Add product</Button>
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) resetForm();
        }}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit product" : "Add product"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the product details below."
                : "Fill in the details to add a new product."}
            </SheetDescription>
          </SheetHeader>
          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
          >
            <div className="grid gap-1.5">
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p-cures">What it cures / helps with</Label>
              <Textarea id="p-cures" value={cures} onChange={(e) => setCures(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p-amount">Amount (₦)</Label>
              <Input
                id="p-amount"
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="p-image">
                Image {editingId ? "(leave empty to keep current)" : ""}
              </Label>
              {imagePreview && (
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-md border border-border/60 bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    sizes="360px"
                    className="object-cover"
                    unoptimized={imagePreview.startsWith("blob:")}
                  />
                </div>
              )}
              <Input
                id="p-image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground">
                Automatically optimized to under 150KB on upload.
              </p>
            </div>
          </form>
          <SheetFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSheetOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="product-form" disabled={submitting}>
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add product"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products === undefined && <p className="text-muted-foreground">Loading…</p>}
        {products?.length === 0 && <p className="text-muted-foreground">No products yet.</p>}
        {products?.map((p) => (
          <Card key={p._id} className="overflow-hidden p-0">
            <div className="relative aspect-4/3 bg-muted">
              {p.imageUrl && (
                <Image src={p.imageUrl} alt={p.name} fill sizes="300px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4">
              <h3 className="line-clamp-1 font-bold">{p.name}</h3>
              <p className="text-sm font-semibold text-primary">₦{Number(p.amount).toLocaleString("en-NG")}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{p.cures}</p>
            </div>
            <div className="flex gap-2 border-t border-border/60 p-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => startEdit(p)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => setDeleteTarget({ id: p._id, name: p.name })}
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
            <AlertDialogTitle>Delete “{deleteTarget?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The product will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
