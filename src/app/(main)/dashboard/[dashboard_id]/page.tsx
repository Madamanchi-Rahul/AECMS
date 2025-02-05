import { getDashboardById, getEventParticipants } from "../action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Users, Star, Calendar, BarChart } from "lucide-react";
import { notFound } from "next/navigation";
import EditableEvent from "@/components/EditableEvent";
import { formatRelativeDate, formatTime } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageProps {
  params: { dashboard_id: string };
}

export default async function DashboardDetailsPage({ params }: PageProps) {
  const { data: dashboard, error } = await getDashboardById(
    (await params).dashboard_id
  );
  const { data: participants } = await getEventParticipants(
    dashboard?.event.id || ""
  );

  if (error || !dashboard) {
    return notFound();
  }

  const metrics = [
    {
      title: "Attendance",
      value: dashboard.attendance_count,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Average Rating",
      value: dashboard.average_rating?.toFixed(2) || "N/A",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Feedback Score",
      value: Number(dashboard.feedback_score).toFixed(2),
      icon: BarChart,
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen w-full p-8">
      <Link href="/dashboard">
        <Button
          variant="ghost"
          className="mb-6 -translate-x-5 flex items-center gap-2 text-lg font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboards
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{dashboard.event.title}</h1>
        <p className="text-gray-600">
          <Calendar className="inline mr-2 h-4 w-4" />
          {formatRelativeDate(new Date(dashboard.event.date))} at{" "}
          {formatTime(new Date(dashboard.event.time))}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[300px]">
              {JSON.stringify(dashboard.demographics, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Registered</span>
              <span className="font-bold">{dashboard.total_attendees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Attendance Rate</span>
              <span className="font-bold">
                {(
                  (dashboard.attendance_count / dashboard.total_attendees) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <EditableEvent event={dashboard.event} />

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Registered Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registration Type</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants?.map((participant: any) => (
                  <TableRow key={participant.user_id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                    <TableCell>{participant.phone}</TableCell>
                    <TableCell>
                      {participant.registration_type?.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        participant.registration_date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{participant.attendance_status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
