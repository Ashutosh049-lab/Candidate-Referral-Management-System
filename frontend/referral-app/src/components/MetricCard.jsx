
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Clock, CheckCircle, Briefcase } from "lucide-react";

const MetricsCards = ({ metrics }) => {
  const statusData = [
    { name: "Pending", value: metrics.by_status.Pending, color: "#F59E0B" },
    { name: "Reviewed", value: metrics.by_status.Reviewed, color: "#3B82F6" },
    { name: "Hired", value: metrics.by_status.Hired, color: "#10B981" },
    { name: "Rejected", value: metrics.by_status.Rejected, color: "#EF4444" },
  ];

  const MetricCard = ({ icon: Icon, title, value, iconColor }) => (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );

  return (
    <div data-testid="metrics-section" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Total Referrals"
          value={metrics.total}
          iconColor="bg-primary"
        />
        <MetricCard
          icon={Clock}
          title="Pending"
          value={metrics.by_status.Pending}
          iconColor="bg-amber-500"
        />
        <MetricCard
          icon={Briefcase}
          title="Reviewed"
          value={metrics.by_status.Reviewed}
          iconColor="bg-blue-500"
        />
        <MetricCard
          icon={CheckCircle}
          title="Hired"
          value={metrics.by_status.Hired}
          iconColor="bg-emerald-500"
        />
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E4E4E7",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsCards;