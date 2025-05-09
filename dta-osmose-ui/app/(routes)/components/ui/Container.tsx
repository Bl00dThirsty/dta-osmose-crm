// Container.tsx
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface ContainerProps {
  title: string;
  description: string;
  visibility?: string;
  children: React.ReactNode;
}

const Container = ({
  title,
  description,
  visibility,
  children,
}: ContainerProps) => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 h-full">
      <Heading
        title={title}
        description={description}
        visibility={visibility}
      />
      <Separator />
      <div className="text-sm h-full pb-32 space-y-5">
        {children}
      </div>
    </div>
  );
};

export default Container;
