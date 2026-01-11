import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  BarChart3, Calendar, Users, FileText, ThumbsUp, XCircle,
  Sparkles, GitBranch, Server, Eye, Database, Search,
  ExternalLink, ArrowUpRight, ArrowDownRight, Minus,
  Link2, BookOpen, Lightbulb, Activity, Target, Zap
} from 'lucide-react';

// Mock data
const MOCK_ANALYTICS = {
  summary: {
    totalIssues: 127,
    openIssues: 23,
    resolvedThisMonth: 42,
    avgResolutionTime: 4.2, // hours
    selfResolutionRate: 0.23,
    trends: {
      issuesVsLastMonth: -12, // % decrease
      resolutionTimeVsLastMonth: -8, // % improvement
      selfResolutionVsLastMonth: 15 // % increase
    }
  },
  planeDistribution: [
    { plane: 'App CI/CD', icon: GitBranch, count: 42, change: 5, color: 'from-blue-500 to-cyan-500' },
    { plane: 'EKS', icon: Server, count: 28, change: -12, color: 'from-purple-500 to-pink-500' },
    { plane: 'Observability', icon: Eye, count: 15, change: 3, color: 'from-orange-500 to-red-500' },
    { plane: 'Infrastructure CI/CD', icon: Database, count: 12, change: -8, color: 'from-green-500 to-emerald-500' }
  ],
  customerHealth: [
    { 
      customer: 'Customer Alpha', 
      openIssues: 15, 
      criticalIssues: 3, 
      trend: 'up',
      avgResolutionTime: 5.2,
      status: 'warning'
    },
    { 
      customer: 'Customer Beta', 
      openIssues: 8, 
      criticalIssues: 0, 
      trend: 'down',
      avgResolutionTime: 3.1,
      status: 'good'
    }
  ],
  docEffectiveness: [
    {
      title: 'How to Attach IAM Roles to Pods',
      type: 'how-to',
      url: 'https://happycloud.com/docs/eks/how-to/attach-iam-roles',
      helpfulMarks: 18,
      views: 45,
      effectiveness: 0.40,
      trend: 'up'
    },
    {
      title: 'Understanding Pipeline Timeouts',
      type: 'explanation',
      url: 'https://happycloud.com/docs/app-cicd/explanations/pipeline-timeouts',
      helpfulMarks: 12,
      views: 52,
      effectiveness: 0.23,
      trend: 'stable'
    },
    {
      title: 'Pipeline Stage Timeout Limits',
      type: 'reference',
      url: 'https://happycloud.com/docs/app-cicd/reference/timeout-limits',
      helpfulMarks: 3,
      views: 38,
      effectiveness: 0.08,
      trend: 'down'
    }
  ],
  insights: [
    {
      id: 1,
      type: 'pattern',
      severity: 'high',
      title: 'SAST Timeout Pattern Detected',
      description: '5 issues related to SAST scan timeouts reported this week, all in App CI/CD plane.',
      suggestion: 'Consider creating a "How to Optimize SAST Scan Performance" guide',
      affectedIssues: ['ISS-847', 'ISS-851', 'ISS-856', 'ISS-862', 'ISS-865'],
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      id: 2,
      type: 'doc_gap',
      severity: 'medium',
      title: 'Documentation Gap: EKS Autoscaling',
      description: '8 issues about EKS autoscaling with no helpful docs marked. Current docs may need improvement.',
      suggestion: 'Update "EKS Autoscaling" reference documentation or create new tutorial',
      relatedDoc: 'https://happycloud.com/docs/eks/reference/autoscaling',
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'positive',
      severity: 'low',
      title: 'Customer Beta Trending Positive',
      description: 'Issue volume down 40% this month. Recent IAM documentation updates showing impact.',
      suggestion: 'Consider sharing these docs with Customer Alpha team',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ],
  commonPatterns: [
    {
      pattern: 'IAM Role Misconfiguration',
      count: 12,
      plane: 'EKS',
      avgResolutionTime: 3.5,
      commonResolution: 'Update service account annotation with correct role ARN'
    },
    {
      pattern: 'Pipeline Timeout - Build Stage',
      count: 8,
      plane: 'App CI/CD',
      avgResolutionTime: 2.1,
      commonResolution: 'Increase timeout from 30m to 45m in pipeline config'
    },
    {
      pattern: 'Image Pull Error',
      count: 6,
      plane: 'EKS',
      avgResolutionTime: 1.8,
      commonResolution: 'Verify image pull secrets are configured correctly'
    }
  ]
};

const SIMILAR_ISSUES = [
  {
    id: 'ISS-2024-0842',
    title: 'Deployment timeout in QA environment',
    customer: 'Customer Alpha',
    environment: 'alpha-qa-01',
    plane: 'App CI/CD',
    status: 'resolved',
    similarity: 0.92,
    resolution: 'Increased timeout from 30m to 45m in deployment stage configuration',
    resolvedAt: '2 days ago'
  },
  {
    id: 'ISS-2024-0839',
    title: 'Pipeline hangs at deploy stage with timeout error',
    customer: 'Customer Beta',
    environment: 'beta-dev-02',
    plane: 'App CI/CD',
    status: 'in_progress',
    similarity: 0.87,
    assignedTo: 'Platform Team',
    createdAt: '5 days ago'
  },
  {
    id: 'ISS-2024-0831',
    title: 'Build deployment fails after 30 minutes',
    customer: 'Customer Alpha',
    environment: 'alpha-staging-01',
    plane: 'App CI/CD',
    status: 'resolved',
    similarity: 0.78,
    resolution: 'Added resource limits to deployment config to speed up deployment',
    resolvedAt: '1 week ago'
  }
];

function StatCard({ title, value, change, icon: Icon, trend }) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const trendColor = trend === 'good' 
    ? 'text-green-600' 
    : trend === 'bad' 
    ? 'text-red-600' 
    : 'text-gray-600';
  
  const TrendIcon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50`}>
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function PlaneDistributionChart({ data }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Issues by Plane (Last 30 Days)
      </h3>
      <div className="space-y-4">
        {data.map((item) => {
          const Icon = item.icon;
          const percentage = (item.count / maxCount) * 100;
          const isIncrease = item.change > 0;
          
          return (
            <div key={item.plane}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{item.plane}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                    {isIncrease ? '+' : ''}{item.change}%
                  </span>
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CustomerHealthCard({ customer }) {
  const statusConfig = {
    warning: { 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-700'
    },
    good: { 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-700'
    }
  };
  
  const config = statusConfig[customer.status];
  const TrendIcon = customer.trend === 'up' ? TrendingUp : TrendingDown;
  
  return (
    <div className={`${config.bg} border-2 ${config.border} rounded-xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900">{customer.customer}</h4>
          <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
        </div>
        <TrendIcon className={`w-5 h-5 ${config.text}`} />
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-600">Open</p>
          <p className="text-xl font-bold text-gray-900">{customer.openIssues}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Critical</p>
          <p className={`text-xl font-bold ${customer.criticalIssues > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {customer.criticalIssues}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Avg Time</p>
          <p className="text-xl font-bold text-gray-900">{customer.avgResolutionTime}h</p>
        </div>
      </div>
      
      <div className={`${config.badge} px-3 py-1 rounded-full text-xs font-semibold inline-block`}>
        {customer.status === 'warning' ? '⚠️ Needs Attention' : '✅ Healthy'}
      </div>
    </div>
  );
}

function DocEffectivenessTable({ docs }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Documentation Effectiveness
      </h3>
      <div className="space-y-3">
        {docs.map((doc, idx) => {
          const effectivenessPercent = (doc.effectiveness * 100).toFixed(0);
          const isGood = doc.effectiveness > 0.3;
          const isPoor = doc.effectiveness < 0.15;
          
          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-2 group"
                  >
                    {doc.title}
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{doc.type.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-600">Views</p>
                  <p className="text-lg font-bold text-gray-900">{doc.views}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Helpful</p>
                  <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {doc.helpfulMarks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Effectiveness</p>
                  <p className={`text-lg font-bold ${isGood ? 'text-green-600' : isPoor ? 'text-red-600' : 'text-yellow-600'}`}>
                    {effectivenessPercent}%
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${isGood ? 'bg-green-500' : isPoor ? 'bg-red-500' : 'bg-yellow-500'}`}
                  style={{ width: `${effectivenessPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          💡 <strong>Tip:</strong> Docs with &lt;15% effectiveness may need rewriting or better discoverability
        </p>
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  const Icon = insight.icon;
  
  return (
    <div className={`${insight.bg} border-2 border-gray-200 rounded-xl p-5`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`${insight.color} mt-0.5`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">{insight.title}</h4>
          <p className="text-sm text-gray-700">{insight.description}</p>
        </div>
      </div>
      
      <div className="ml-8">
        <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-1">Suggested Action:</p>
          <p className="text-sm text-gray-900">{insight.suggestion}</p>
        </div>
        
        {insight.affectedIssues && (
          <div className="flex flex-wrap gap-2">
            {insight.affectedIssues.map(issueId => (
              <span key={issueId} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 font-mono">
                {issueId}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SimilarIssuesPanel() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Duplicate Detection
        </h3>
        <p className="text-sm text-gray-600">
          Found 3 similar issues when analyzing: "Deployment pipeline timeout in QA environment"
        </p>
      </div>
      
      <div className="space-y-3">
        {SIMILAR_ISSUES.map((issue) => {
          const statusConfig = {
            resolved: { bg: 'bg-green-50', text: 'text-green-700', label: 'Resolved' },
            in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Progress' }
          };
          const config = statusConfig[issue.status];
          
          return (
            <div 
              key={issue.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-all cursor-pointer"
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-gray-600">{issue.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} font-medium`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-500">{Math.round(issue.similarity * 100)}% match</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{issue.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {issue.customer} • {issue.environment} • {issue.plane}
                  </p>
                </div>
              </div>
              
              {issue.resolution && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-xs font-semibold text-green-900 mb-1">✅ Resolution:</p>
                  <p className="text-xs text-green-800">{issue.resolution}</p>
                  <p className="text-xs text-green-600 mt-1">Resolved {issue.resolvedAt}</p>
                </div>
              )}
              
              {issue.status === 'in_progress' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-blue-800">
                    Assigned to {issue.assignedTo} • Created {issue.createdAt}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 mt-3">
                <button className="flex-1 text-xs bg-gray-900 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1">
                  <Link2 className="w-3.5 h-3.5" />
                  Link to this issue
                </button>
                <button className="flex-1 text-xs bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  View details
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-900">
          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
          <strong>AI Suggestion:</strong> This appears to be the same root cause as ISS-2024-0842. Consider linking instead of creating duplicate.
        </p>
      </div>
    </div>
  );
}

function CommonPatternsTable({ patterns }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Common Issue Patterns
      </h3>
      <div className="space-y-3">
        {patterns.map((pattern, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{pattern.pattern}</h4>
                <p className="text-xs text-gray-600 mt-1">{pattern.plane} Plane</p>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-gray-900">{pattern.count}</span>
                <span className="text-xs text-gray-600 ml-1">occurrences</span>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Common Resolution:</p>
              <p className="text-xs text-gray-900">{pattern.commonResolution}</p>
              <p className="text-xs text-gray-500 mt-2">Avg resolution time: {pattern.avgResolutionTime} hours</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Phase4Dashboard() {
  const { summary, planeDistribution, customerHealth, docEffectiveness, insights, commonPatterns } = MOCK_ANALYTICS;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Phase 4.0 - Intelligent Insights & Closed-Loop Learning</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <FileText className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Issues"
            value={summary.totalIssues}
            change={summary.trends.issuesVsLastMonth}
            icon={FileText}
            trend="good"
          />
          <StatCard
            title="Open Issues"
            value={summary.openIssues}
            icon={AlertTriangle}
          />
          <StatCard
            title="Resolved This Month"
            value={summary.resolvedThisMonth}
            change={summary.trends.issuesVsLastMonth}
            icon={CheckCircle2}
            trend="good"
          />
          <StatCard
            title="Avg Resolution Time"
            value={`${summary.avgResolutionTime}h`}
            change={summary.trends.resolutionTimeVsLastMonth}
            icon={Activity}
            trend="good"
          />
        </div>

        {/* AI Insights - Featured */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI-Generated Insights
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Plane Distribution */}
          <div className="col-span-1">
            <PlaneDistributionChart data={planeDistribution} />
          </div>

          {/* Customer Health */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Health
              </h3>
              <div className="space-y-4">
                {customerHealth.map((customer, idx) => (
                  <CustomerHealthCard key={idx} customer={customer} />
                ))}
              </div>
            </div>
          </div>

          {/* Self-Resolution Rate */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Documentation Impact
              </h3>
              
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90" width="128" height="128">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56 * summary.selfResolutionRate} ${2 * Math.PI * 56}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{(summary.selfResolutionRate * 100).toFixed(0)}%</p>
                      <p className="text-xs text-gray-600">Self-Resolved</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{summary.trends.selfResolutionVsLastMonth}% vs last month</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-900">
                    <strong>29 issues</strong> resolved using documentation without team intervention
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">
                    Average time saved: <strong>2.3 hours</strong> per self-resolved issue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation & Patterns */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <DocEffectivenessTable docs={docEffectiveness} />
          <CommonPatternsTable patterns={commonPatterns} />
        </div>

        {/* Duplicate Detection Example */}
        <SimilarIssuesPanel />
      </div>
    </div>
  );
}
