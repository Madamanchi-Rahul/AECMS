import { getDashboardData } from "./action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { validateRequest } from "@/auth";

export default async function DashboardPage() {
  const { data: dashboards, error } = await getDashboardData();

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-red-500 bg-red-50 rounded-lg p-4">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Event Dashboards</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your events
          </p>
        </div>
        <Link href="/events/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards?.map((dashboard) => (
          <Card
            key={dashboard.dashboard_id}
            className="hover:shadow-lg transition-all duration-300 group"
          >
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">
                {dashboard.event.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(dashboard.event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {dashboard.event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {dashboard.event.location}
                  </div>
                )}
                <Link
                  href={`/dashboard/${dashboard.dashboard_id}`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {dashboards?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">No events found</p>
            <Link href="/events/create">
              <Button>Create your first event</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
