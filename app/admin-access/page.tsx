"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminAccessPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (code !== process.env.NEXT_PUBLIC_ADMIN_CODE) {
      toast.error("Incorrect admin code.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className='mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-10'>
      <h1 className='text-lg font-semibold'>Admin Access</h1>
      <p className='mt-1 text-sm text-muted-foreground'>
        Enter the admin code to continue to the dashboard.
      </p>

      <form onSubmit={handleSubmit} className='mt-6 grid gap-4'>
        <div className='grid gap-1.5'>
          <Label htmlFor='admin-code'>Admin code</Label>
          <Input
            id='admin-code'
            type='password'
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <Button type='submit'>Submit</Button>
      </form>
    </div>
  );
}
