
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ICategory,
  ICreatePropertyPayload,
  IUpdatePropertyPayload,
  landlordService,
} from "@/service/landlordService";

import { propertySchema } from "@/validations/property";
import ImageDropzone from "./ImageDropzone";

export interface PropertyFormInitialData {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  price: string | number;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  images: string[];
  amenities: string[];
  available: boolean;
  availableFrom: string | null;
  categoryId: string;
}

interface FormState {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  images: string;
  amenities: string;
  available: boolean;
  availableFrom: string;
  categoryId: string;
}

const emptyState: FormState = {
  title: "",
  description: "",
  address: "",
  city: "",
  state: "",
  neighborhood: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  images: "",
  amenities: "",
  available: true,
  availableFrom: "",
  categoryId: "",
};

const toFormState = (data: PropertyFormInitialData): FormState => ({
  title: data.title ?? "",
  description: data.description ?? "",
  address: data.address ?? "",
  city: data.city ?? "",
  state: data.state ?? "",
  neighborhood: data.neighborhood ?? "",
  price: data.price != null ? String(data.price) : "",
  bedrooms: data.bedrooms != null ? String(data.bedrooms) : "",
  bathrooms: data.bathrooms != null ? String(data.bathrooms) : "",
  sqft: data.sqft != null ? String(data.sqft) : "",
  images: (data.images ?? []).join(", "),
  amenities: (data.amenities ?? []).join(", "),
  available: data.available ?? true,
  availableFrom: data.availableFrom ? data.availableFrom.slice(0, 10) : "",
  categoryId: data.categoryId ?? "",
});

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: string;
  initialData?: PropertyFormInitialData;
}

const PropertyForm = ({ mode, propertyId, initialData }: PropertyFormProps) => {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(
    initialData ? toFormState(initialData) : emptyState
  );

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [syncedId, setSyncedId] = useState<string | undefined>(
    initialData?.id
  );

  if (initialData && initialData.id !== syncedId) {
    setForm(toFormState(initialData));
    setSyncedId(initialData.id);
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const json = await landlordService.getCategories();

        if (!json) {
          throw new Error("Failed to load categories");
        }

        setCategories(json.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const parseImages = () =>
    form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const parseAmenities = () =>
    form.amenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  // Payload for CREATE
  const buildPayload = (): ICreatePropertyPayload => ({
    title: form.title,
    description: form.description,
    address: form.address,
    city: form.city,
    state: form.state,
    neighborhood: form.neighborhood,
    price: Number(form.price),
    bedrooms: Number(form.bedrooms) || 0,
    bathrooms: Number(form.bathrooms) || 0,
    sqft: Number(form.sqft) || 0,
    images: parseImages(),
    amenities: parseAmenities(),
    available: form.available,
    availableFrom: form.availableFrom || null,
    categoryId: form.categoryId,
  });

  // Payload for UPDATE
  const buildUpdatePayload = (): IUpdatePropertyPayload => ({
    title: form.title,
    description: form.description,
    price: Number(form.price),
    bedrooms: Number(form.bedrooms) || 0,
    bathrooms: Number(form.bathrooms) || 0,
    availableFrom: form.availableFrom || null,
    amenities: parseAmenities(),
    images: parseImages(),
    status: form.available ? "AVAILABLE" : "UNAVAILABLE",
    categoryId: form.categoryId,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = propertySchema.safeParse(buildPayload());

    if (!parsed.success) {
      const fe: Record<string, string> = {};

      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);

        if (!fe[key]) {
          fe[key] = issue.message;
        }
      });

      setFieldErrors(fe);
      setError("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const json =
        mode === "edit" && propertyId
          ? await landlordService.updateProperty(
              propertyId,
              buildUpdatePayload()
            )
          : await landlordService.createProperty(buildPayload());

      if (!json?.success) {
        throw new Error(
          json?.message ??
            `Failed to ${mode === "edit" ? "update" : "create"} property`
        );
      }

      toast.success(
        mode === "edit" ? "Property updated" : "Property created"
      );

      router.push("/dashboard/landlord/properties");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const heading = mode === "edit" ? "Edit Property" : "Add Property";

  const subheading =
    mode === "edit"
      ? "Update the details for this listing."
      : "List a new property for rent.";

  const submitLabel = mode === "edit" ? "Save Changes" : "Create Property";

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/landlord/properties"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>

        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Property Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  aria-invalid={!!fieldErrors.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
                {fieldErrors.title && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={form.description}
                  aria-invalid={!!fieldErrors.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                />
                {fieldErrors.description && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  required
                  value={form.address}
                  aria-invalid={!!fieldErrors.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
                {fieldErrors.address && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  required
                  value={form.neighborhood}
                  aria-invalid={!!fieldErrors.neighborhood}
                  onChange={(e) =>
                    updateField("neighborhood", e.target.value)
                  }
                />
                {fieldErrors.neighborhood && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.neighborhood}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  required
                  value={form.city}
                  aria-invalid={!!fieldErrors.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
                {fieldErrors.city && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.city}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  required
                  value={form.state}
                  aria-invalid={!!fieldErrors.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
                {fieldErrors.state && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.state}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  disabled={loadingCategories}
                  value={form.categoryId || undefined}
                  onValueChange={(value) => {
                    if (value !== null) {
                      updateField("categoryId", value);
                    }
                  }}
                >
                  <SelectTrigger
                    id="categoryId"
                    aria-invalid={!!fieldErrors.categoryId}
                  >
                    <SelectValue
                      placeholder={
                        loadingCategories
                          ? "Loading..."
                          : "Select a category"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldErrors.categoryId && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.categoryId}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($/month)</Label>
                <Input
                  id="price"
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  aria-invalid={!!fieldErrors.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
                {fieldErrors.price && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.price}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  aria-invalid={!!fieldErrors.bedrooms}
                  onChange={(e) => updateField("bedrooms", e.target.value)}
                />
                {fieldErrors.bedrooms && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.bedrooms}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  value={form.bathrooms}
                  aria-invalid={!!fieldErrors.bathrooms}
                  onChange={(e) => updateField("bathrooms", e.target.value)}
                />
                {fieldErrors.bathrooms && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.bathrooms}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sqft">Sqft</Label>
                <Input
                  id="sqft"
                  type="number"
                  min={0}
                  value={form.sqft}
                  aria-invalid={!!fieldErrors.sqft}
                  onChange={(e) => updateField("sqft", e.target.value)}
                />
                {fieldErrors.sqft && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.sqft}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={form.availableFrom}
                  aria-invalid={!!fieldErrors.availableFrom}
                  onChange={(e) =>
                    updateField("availableFrom", e.target.value)
                  }
                />
                {fieldErrors.availableFrom && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.availableFrom}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Checkbox
                  id="available"
                  checked={form.available}
                  onCheckedChange={(checked) =>
                    updateField("available", checked === true)
                  }
                />
                <Label htmlFor="available" className="font-medium">
                  Available for rent
                </Label>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="amenities">
                  Amenities (comma separated)
                </Label>
                <Input
                  id="amenities"
                  placeholder="Parking, Pool, Gym"
                  value={form.amenities}
                  aria-invalid={!!fieldErrors.amenities}
                  onChange={(e) => updateField("amenities", e.target.value)}
                />
                {fieldErrors.amenities && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.amenities}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label>Property Images</Label>
                <ImageDropzone
                  images={parseImages()}
                  onChange={(images) =>
                    updateField("images", images.join(","))
                  }
                  disabled={submitting}
                  maxImages={10}
                />
                {fieldErrors.images && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.images}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push("/dashboard/landlord/properties")
                }
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                )}
                {submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;
