"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileForm from "../complete-profile/complete-profile-form";

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FormData {
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
}

const defaultFormData: FormData = {
  phone: "",
  shippingAddress: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  },
  billingAddress: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  },
  sameAsShipping: true
};

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<FormData>(defaultFormData);

  useEffect(() => {
    if (!session?.user?.email) {
      router.push("/auth/signin");
      return;
    }

    fetch("/api/account")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch account data");
        return res.json();
      })
      .then((data) => {
        setInitialValues({
          phone: data.phone || defaultFormData.phone,
          shippingAddress: data.shippingAddress || defaultFormData.shippingAddress,
          billingAddress: data.billingAddress || defaultFormData.billingAddress,
          sameAsShipping: data.sameAsShipping ?? defaultFormData.sameAsShipping
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching account data:", error);
        setLoading(false);
      });
  }, [session, router]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session?.user?.email) {
    return null;
  }

  return (
    <ProfileForm
      userId={session.user.id}
      initialValues={initialValues}
      title="Edit Profile"
      submitLabel="Save Changes"
    />
  );
} 