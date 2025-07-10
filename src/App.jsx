import translations from "./data/translations.json";
import llmUsageData from "./data/llmUsageData.json";
import gpaData from "./data/gpaData.json";
import demographicsData from "./data/demographicsData.json";
import performanceMetrics from "./data/performanceMetrics.json";
import { useState, createContext, useContext, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Globe,
  Users,
  TrendingUp,
  BookOpen,
  GraduationCap,
  BarChart3,
  PieChartIcon,
  Table,
  Settings,
  Filter,
  ChevronRight,
  Activity,
  Award,
  Brain,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const LanguageContext = createContext();

const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
};

const sanitizeData = (data) => {
  if (!data) return [];
  return data.map((item) => ({
    ...item,
    percentage: Math.max(0, Math.min(100, Number(item.percentage) || 0)),
    students: Math.max(0, Number(item.students) || 0),
  }));
};

function Sidebar({ isOpen, setIsOpen, activeSection, setActiveSection }) {
  const { t } = useLanguage();
  const sidebarRef = useRef(null);

  const menuItems = [
    { id: "overview", label: t.overview, icon: BarChart3 },
    { id: "analytics", label: t.analytics, icon: TrendingUp },
    { id: "reports", label: t.reports, icon: Table },
    { id: "settings", label: t.settings, icon: Settings },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const firstFocusableElement = sidebarRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap
                    className="w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{t.title}</h2>
                  <p className="text-xs text-slate-400">Analytics Platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav
            className="flex-1 p-4 space-y-2"
            role="navigation"
            aria-label="Main menu"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                <item.icon className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight
                    className="w-4 h-4 ml-auto"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <div className="text-xs text-slate-400 text-center">
              <p>
                {t.lastUpdated}: <time dateTime="2025">Dec 2025</time>
              </p>
              <p className="mt-1">{t.dataSource}: Academic Registry</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  description,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-700 rounded mb-1"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <p
            className="text-3xl font-bold text-white mb-1"
            aria-label={`${title}: ${value}`}
          >
            {value}
          </p>
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-semibold ${
                change.startsWith("+") ? "text-green-400" : "text-red-400"
              }`}
              aria-label={`Change: ${change}`}
            >
              {change}
            </span>
            <span className="text-xs text-slate-500">{description}</span>
          </div>
        </div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}
        >
          <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, formatter, labelFormatter }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-xl"
        role="tooltip"
      >
        <p className="text-white font-semibold mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between space-x-4 mb-1"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="text-slate-300 text-sm">{entry.name}</span>
            </div>
            <span className="text-white font-medium">
              {formatter ? formatter(entry.value, entry.name) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function ChartContainer({ children, title, className = "" }) {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
      )}
      <div className="h-80">{children}</div>
    </div>
  );
}

function Dashboard() {
  const [language, setLanguage] = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const t = translations[language] || translations.en;

  const currentLlmData = () => {
    const data = llmUsageData[selectedFaculty] || llmUsageData.all;
    return sanitizeData(data);
  };

  const currentGpaData = () => {
    return gpaData.filter((item) => item.year <= Number.parseInt(selectedYear));
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "fr" : "en";
    setLanguage(newLanguage);
    showNotification(t.dataUpdated);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFacultyChange = (newFaculty) => {
    setSelectedFaculty(newFaculty);
    showNotification(t.filterApplied);
  };

  const faculties = [
    "all",
    "engineering",
    "business",
    "arts",
    "science",
    "medicine",
    "law",
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case "l":
            event.preventDefault();
            toggleLanguage();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleLanguage]);

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.totalStudents}
          value="2,847"
          change="+12.3%"
          icon={Users}
          color="from-blue-500 to-blue-600"
          description={t.vsLastSemester}
          isLoading={isLoading}
        />
        <StatCard
          title={t.avgImprovement}
          value="+0.6"
          change="+18.7%"
          icon={TrendingUp}
          color="from-green-500 to-green-600"
          description={t.gpaPoints}
          isLoading={isLoading}
        />
        <StatCard
          title={t.llmAdoption}
          value="73%"
          change="+25.4%"
          icon={Brain}
          color="from-purple-500 to-purple-600"
          description={t.activeUsers}
          isLoading={isLoading}
        />
        <StatCard
          title={t.satisfactionRate}
          value="4.2/5"
          change="+8.1%"
          icon={Award}
          color="from-orange-500 to-orange-600"
          description={t.userRating}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChartContainer isLoading={isLoading} error={error}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BookOpen
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold text-white">
                {t.llmUsageTitle}
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              <Filter className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <label htmlFor="faculty-select" className="sr-only">
                {t.facultyFilter}
              </label>
              <select
                id="faculty-select"
                value={selectedFaculty}
                onChange={(e) => handleFacultyChange(e.target.value)}
                className="bg-slate-700/50 border border-slate-600/50 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                aria-label={t.facultyFilter}
              >
                {faculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {t[faculty === "all" ? "allFaculties" : faculty]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentLlmData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.3}
              />
              <XAxis
                dataKey="purpose"
                stroke="#94A3B8"
                tickFormatter={(value) => t[value] || value}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                label={{
                  value: t.percentage,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    formatter={(value, name) => [
                      `${value}% (${
                        currentLlmData().find((d) => d.purpose === name)
                          ?.students || 0
                      } ${t.students})`,
                      t[name] || name,
                    ]}
                  />
                }
              />
              <Bar
                dataKey="percentage"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer isLoading={isLoading} error={error}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold text-white">{t.gpaTitle}</h3>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentGpaData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="lineGradient1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="lineGradient2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="lineGradient3" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.3}
              />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} />
              <YAxis
                domain={[2.8, 4.0]}
                stroke="#94A3B8"
                fontSize={12}
                label={{ value: t.gpa, angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    formatter={(value) => value.toFixed(2)}
                    labelFormatter={(label) => `${t.year}: ${label}`}
                  />
                }
              />
              <Legend formatter={(value) => t[value] || value} />

              <>
                <Line
                  type="monotone"
                  dataKey="university_a"
                  stroke="url(#lineGradient1)"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 5 }}
                  name="university_a"
                />
                <Line
                  type="monotone"
                  dataKey="university_b"
                  stroke="url(#lineGradient2)"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }}
                  name="university_b"
                />
                <Line
                  type="monotone"
                  dataKey="university_c"
                  stroke="url(#lineGradient3)"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 5 }}
                  name="university_c"
                />
              </>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChartContainer isLoading={isLoading} error={error}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <PieChartIcon
                className="h-5 w-5 text-purple-400"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-xl font-semibold text-white">
              {t.demographicsTitle}
            </h3>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={demographicsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {demographicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-xl">
                        <p className="text-white font-semibold">
                          {t[data.name]}
                        </p>
                        <p className="text-slate-300">
                          {data.value}% ({data.count} {t.students})
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-slate-300">{t[value]}</span>
                )}
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer isLoading={isLoading} error={error}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Activity
                className="h-5 w-5 text-orange-400"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-xl font-semibold text-white">
              {t.performanceTitle}
            </h3>
          </div>

          <div className="space-y-4 ">
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-slate-600/50`}>
                    <metric.icon
                      className={`w-5 h-5 ${metric.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium">{metric.metric}</p>
                    <p className="text-slate-400 text-sm">
                      {metric.before} → {metric.after}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">
                    {metric.improvement}
                  </p>
                  <p className="text-slate-400 text-sm">{t.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <ChartContainer
        title="Advanced Analytics"
        isLoading={isLoading}
        error={error}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentGpaData()}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.3}
            />
            <XAxis dataKey="year" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="llmUsers"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#areaGradient)"
              name="LLM Users"
            />
            <Area
              type="monotone"
              dataKey="nonLlmUsers"
              stroke="#EF4444"
              fillOpacity={0.2}
              fill="#EF4444"
              name="Non-LLM Users"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8 mb-12">
      <div className="border border-blue-200/5 rounded-xl p-5">
        <div className="flex items-center justify-between  mb-6">
          <h3 className="text-xl font-semibold text-white">
            {t.dataTableTitle}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-700">
                <th
                  className="text-left py-3 px-4 text-slate-300 font-medium"
                  scope="col"
                >
                  Purpose
                </th>
                <th
                  className="text-left py-3 px-4 text-slate-300 font-medium"
                  scope="col"
                >
                  Usage %
                </th>
                <th
                  className="text-left py-3 px-4 text-slate-300 font-medium"
                  scope="col"
                >
                  Students
                </th>
                <th
                  className="text-left py-3 px-4 text-slate-300 font-medium"
                  scope="col"
                >
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {currentLlmData().map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-700/50 hover:bg-slate-700/20"
                >
                  <td className="py-3 px-4 text-white">{t[item.purpose]}</td>
                  <td className="py-3 px-4 text-white">{item.percentage}%</td>
                  <td className="py-3 px-4 text-slate-300">{item.students}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-400 font-medium">
                      {item.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <ChartContainer>
        <h3 className="text-xl font-semibold text-white mb-6">
          Dashboard Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
            <div>
              <p className="text-white font-medium">{t.language}</p>
              <p className="text-slate-400 text-sm">
                Choose your preferred language
              </p>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${
                language === "en" ? "French" : "English"
              }`}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
          <div className="p-4 rounded-lg bg-slate-700/30">
            <h4 className="text-white font-medium mb-2">Keyboard Shortcuts</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Toggle Language</span>
                <kbd className="px-2 py-1 bg-slate-600 rounded text-xs">
                  Ctrl+L
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </ChartContainer>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "analytics":
        return renderAnalytics();
      case "reports":
        return renderReports();
      case "settings":
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {notification && (
          <div
            className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in"
            role="alert"
            aria-live="polite"
          >
            {notification}
          </div>
        )}

        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div className="lg:ml-72 min-h-screen">
          <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-30">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Open sidebar"
                  >
                    <Menu className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{t.title}</h1>
                    <p className="text-slate-400 text-sm">{t.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Switch to ${
                      language === "en" ? "French" : "English"
                    }`}
                  >
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">
                      {language.toUpperCase()}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6" role="main">
            {renderContent()}
          </main>

          <footer className="border-t mt-8 border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <div className="px-6 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <p className="text-slate-400 text-sm">{t.footer}</p>
                <a
                  href="https://james-attia.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 sm:mt-0 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                  aria-label="Visit portfolio (opens in new tab)"
                >
                  <span>{t.portfolio}</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </LanguageContext.Provider>
  );
}

export default Dashboard;
