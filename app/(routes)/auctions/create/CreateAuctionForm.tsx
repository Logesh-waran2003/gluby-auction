"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ItemType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startPrice: z.string().min(1, "Start price is required"),
  itemType: z.string().min(1, "Item type is required"),
  endTime: z.string().min(1, "End time is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export const CreateAuctionForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startPrice: "",
      itemType: "",
      endTime: "",
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          startPrice: parseFloat(values.startPrice),
          currentPrice: parseFloat(values.startPrice),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create auction");
      }

      const auction = await response.json();
      toast.success("Auction created successfully!");
      router.push(`/auctions/${auction.id}`);
    } catch (error) {
      console.error("Error creating auction:", error);
      toast.error("Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  placeholder="Enter auction description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter start price"
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
              <FormLabel>Item Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ItemType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Auction"}
        </Button>
      </form>
    </Form>
  );
};
