"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileForm from "../complete-profile/complete-profile-form";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (session?.user?.id) {
      fetch("/api/account")
        .then((res) => res.json())
        .then((data) => {
          setInitialValues({
            phone: data.phone || "",
            shippingAddress: data.shippingAddress || {
              line1: "",
              line2: "",
              city: "",
              postalCode: "",
              country: "NL",
            },
            billingAddress: data.billingAddress || {
              line1: "",
              line2: "",
              city: "",
              postalCode: "",
              country: "NL",
            },
            sameAsShipping:
              JSON.stringify(data.shippingAddress) === JSON.stringify(data.billingAddress),
          });
          setLoading(false);
        });
    }
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!initialValues) return null;

  return (
    <ProfileForm
      userId={session.user.id}
      initialValues={initialValues}
      title="Edit Profile"
      submitLabel="Save Changes"
    />
  );
} 