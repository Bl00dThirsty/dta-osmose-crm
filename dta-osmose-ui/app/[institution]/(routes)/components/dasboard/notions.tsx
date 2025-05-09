import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { LightbulbIcon } from "lucide-react";
import Link from "next/link";

const NotionsBox = () => {

  return (
    <Link href={"/secondBrain"}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notions</CardTitle>
          <LightbulbIcon className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium">
            {"non disponible"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NotionsBox;
