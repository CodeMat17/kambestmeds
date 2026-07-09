"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminAccessDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  function handleTriggerClick() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setOpen(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (code !== process.env.NEXT_PUBLIC_ADMIN_CODE) {
      toast.error("Incorrect admin code.");
      return;
    }

    setOpen(false);
    setCode("");
    router.push("/dashboard");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setCode("");
      }}
    >
      <DialogTrigger
        render={<span onClick={handleTriggerClick}>{children}</span>}
      />
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogDescription>
              Enter the admin code to continue to the dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5 py-4">
            <Label htmlFor="admin-code">Admin code</Label>
            <Input
              id="admin-code"
              type="password"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
