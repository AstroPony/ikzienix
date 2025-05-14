"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match.',
  path: ['confirmPassword'],
})
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  if (status === "loading") return null;
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const onFormSubmit = async (data: PasswordFormData) => {
    setSuccess(false);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to change password");
      setSuccess(true);
      reset();
    } catch (err) {
      // error handled by react-hook-form
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-lg-6 mx-auto">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="display-5 mb-4">Change Password</h1>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                    id="currentPassword"
                    {...register('currentPassword')}
                  />
                  {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword.message}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                    id="newPassword"
                    {...register('newPassword')}
                  />
                  {errors.newPassword && <div className="invalid-feedback">{errors.newPassword.message}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>
                {success && <div className="alert alert-success">Password changed successfully!</div>}
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 