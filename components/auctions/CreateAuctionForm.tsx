"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UploadResponse {
  success: boolean;
  paths?: string[];
  error?: string;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startPrice: z.number().min(1, "Starting price must be greater than 0"),
  endTime: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, "End time must be in the future"),
  itemType: z.enum(["IRON", "METAL", "ALUMINIUM"], {
    required_error: "Please select an item type",
  }),
  images: z
    .array(z.any())
    .refine(
      (files) => files.every((file) => file instanceof File),
      "Invalid file format"
    )
    .refine((files) => files.length >= 1, "At least one image is required")
    .refine(
      (files) => files.every((file) => file.size <= 4 * 1024 * 1024),
      "File size must be less than 4MB"
    ),
});

type FormData = z.infer<typeof formSchema> & {
  itemType: "IRON" | "METAL" | "ALUMINIUM";
};

export function CreateAuctionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startPrice: 0,
      endTime: "",
      images: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log(
        "[Form Submission] Initial data:",
        JSON.stringify(data, null, 2)
      );

      // Upload images
      const uploadFormData = new FormData();
      data.images.forEach((file: File) => {
        console.log("[Form Submission] Adding file:", file.name, file.size);
        uploadFormData.append("files", file);
      });
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload images");
      }

      const uploadResult: UploadResponse = await uploadResponse.json();
      console.log("[Form Submission] Upload response:", uploadResult);
      const imagePaths = uploadResult.paths;

      // Submit auction data
      const auctionResponse = await fetch("/api/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: imagePaths,
          startPrice: Number(data.startPrice),
        }),
      });

      if (!auctionResponse.ok) {
        const errorData = await auctionResponse.json();
        throw new Error(errorData.error || "Failed to create auction");
      }

      toast.success("Auction created successfully!");
      router.push("/auctions");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Auction</CardTitle>
        <CardDescription>
          Fill in the details below to create your auction. All fields are
          required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter auction title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IRON">Iron</SelectItem>
                      <SelectItem value="METAL">Metal</SelectItem>
                      <SelectItem value="ALUMINIUM">Aluminium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, 16)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auction Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </div>
              ) : (
                "Create Auction"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
