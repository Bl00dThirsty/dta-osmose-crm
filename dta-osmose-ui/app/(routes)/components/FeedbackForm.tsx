"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";

const formSchema = z.object({
  feedback: z.string().min(1, {
    message: "Feedback must be at least 1 character.",
  }),
});

interface FeedbackFormProps {
  setOpen: (open: boolean) => void;
}

const FeedbackForm = ({ setOpen }: FeedbackFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    
    setTimeout(() => {
      toast.success("Merci pour votre feedback.");
      setOpen(false);
      setLoading(false);
    }, 1500); // Simule un délai d'envoi
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nous envoyer un feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Votre feedback"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Nous apprécions vos retours, ça nous aide à rendre cette application meilleure.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" variant="secondary" disabled={loading}>
            {loading ? (
              <div className="flex space-x-2">
                <Icons.spinner className="h-4 w-4 animate-spin" />
                <span>Envoie...</span>
              </div>
            ) : (
              "Soumettre"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;
