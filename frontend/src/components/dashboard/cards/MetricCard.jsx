function MetricCard({
  title,
  value,
  subtext,
  subtextColor = "text-emerald-600",
  icon,
  iconBg = "bg-indigo-50",
  iconColor = "text-indigo-600",
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <p className={`text-xs font-medium mt-1 ${subtextColor}`}>{subtext}</p>
      </div>
      <div className={`p-2.5 ${iconBg} ${iconColor} rounded-xl`}>{icon}</div>
    </div>
  );
}

export default MetricCard;
