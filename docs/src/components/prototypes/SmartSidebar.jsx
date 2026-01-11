import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Loader2, Server, GitBranch, Eye, Database, BookOpen, Lightbulb, FileText, GraduationCap, ExternalLink, ChevronDown, ChevronUp, ThumbsUp, X, Search } from 'lucide-react';

// Mock data
const CUSTOMERS = [
  { id: '1', name: 'Customer Alpha' },
  { id: '2', name: 'Customer Beta' }
];

const ENVIRONMENTS = {
  '1': [
    { id: 'e1', name: 'alpha-dev-01', type: 'dev' },
    { id: 'e2', name: 'alpha-qa-01', type: 'qa' },
    { id: 'e3', name: 'alpha-staging-01', type: 'staging' },
    { id: 'e4', name: 'alpha-prod-01', type: 'production' }
  ],
  '2': [
    { id: 'e5', name: 'beta-dev-02', type: 'dev' },
    { id: 'e6', name: 'beta-qa-02', type: 'qa' },
    { id: 'e7', name: 'beta-prod-02', type: 'production' }
  ]
};

const PLANES = [
  { 
    id: 'p1', 
    name: 'App CI/CD', 
    slug: 'app-cicd',
    description: 'Application build, test, and deployment pipelines',
    icon: GitBranch,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'p2', 
    name: 'EKS', 
    slug: 'eks',
    description: 'Kubernetes cluster configuration and operations',
    icon: Server,
    color: 'from-purple-500 to-pink-500'
  }
];

const PLANE_CONTEXTS = {
  'app-cicd': {
    key: 'pipeline_stage',
    label: 'Pipeline Stage',
    options: [
      'Source Checkout',
      'Build/Compile',
      'Unit Tests',
      'SonarQube Scan',
      'SAST Scan',
      'Container Image Build',
      'Application Deployment',
      'Integration Tests',
      'Smoke Tests'
    ]
  },
  'eks': {
    key: 'eks_component',
    label: 'EKS Component',
    options: [
      'Cluster Configuration',
      'Node Groups',
      'IAM/RBAC',
      'Ingress/Load Balancer',
      'Pod Security',
      'Autoscaling'
    ]
  }
};

const ENV_TYPE_COLORS = {
  dev: 'bg-blue-100 text-blue-700 border-blue-200',
  qa: 'bg-purple-100 text-purple-700 border-purple-200',
  staging: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  production: 'bg-red-100 text-red-700 border-red-200'
};

// Mock documentation results
const MOCK_DOCS = {
  'timeout': [
    {
      id: '1',
      type: 'explanation',
      title: 'Understanding Pipeline Timeouts',
      excerpt: 'Pipeline timeouts occur when a stage exceeds its configured execution limit. Common causes include network latency, resource constraints, or misconfigured retry logic.',
      url: 'https://happycloud.com/docs/app-cicd/explanations/pipeline-timeouts',
      relevance: 0.92,
      plane: 'App CI/CD'
    },
    {
      id: '2',
      type: 'how-to',
      title: 'How to Configure Pipeline Timeout Settings',
      excerpt: 'Learn how to adjust timeout values in your pipeline configuration. Navigate to your pipeline YAML and set the timeout parameter under the stage configuration.',
      url: 'https://happycloud.com/docs/app-cicd/how-to/configure-timeouts',
      relevance: 0.88,
      plane: 'App CI/CD'
    },
    {
      id: '3',
      type: 'reference',
      title: 'Pipeline Stage Timeout Limits',
      excerpt: 'Default timeout values: Build stage - 30min, Test stage - 45min, Deploy stage - 60min. Maximum configurable timeout is 4 hours.',
      url: 'https://happycloud.com/docs/app-cicd/reference/timeout-limits',
      relevance: 0.75,
      plane: 'App CI/CD'
    }
  ],
  'iam role': [
    {
      id: '4',
      type: 'explanation',
      title: 'EKS IAM Roles and Service Accounts',
      excerpt: 'EKS uses IAM roles for service accounts (IRSA) to provide fine-grained permissions to pods. This allows pods to interact with AWS services securely without sharing credentials.',
      url: 'https://happycloud.com/docs/eks/explanations/iam-roles',
      relevance: 0.95,
      plane: 'EKS'
    },
    {
      id: '5',
      type: 'how-to',
      title: 'How to Attach IAM Roles to Pods',
      excerpt: 'Step-by-step guide to creating and attaching IAM roles to your Kubernetes pods using service accounts and OIDC provider configuration.',
      url: 'https://happycloud.com/docs/eks/how-to/attach-iam-roles',
      relevance: 0.89,
      plane: 'EKS'
    },
    {
      id: '6',
      type: 'tutorial',
      title: 'Tutorial: Setting up IRSA for S3 Access',
      excerpt: 'Complete walkthrough of creating an IAM role with S3 permissions and attaching it to a pod that needs to read from S3 buckets.',
      url: 'https://happycloud.com/docs/eks/tutorials/irsa-s3-access',
      relevance: 0.82,
      plane: 'EKS'
    }
  ],
  'deployment fail': [
    {
      id: '7',
      type: 'how-to',
      title: 'How to Troubleshoot Deployment Failures',
      excerpt: 'Check deployment logs, verify resource availability, ensure image pull secrets are configured, and validate manifests for syntax errors.',
      url: 'https://happycloud.com/docs/app-cicd/how-to/troubleshoot-deployments',
      relevance: 0.91,
      plane: 'App CI/CD'
    },
    {
      id: '8',
      type: 'reference',
      title: 'Common Deployment Error Codes',
      excerpt: 'ERR_IMG_PULL: Image not found or unauthorized. ERR_RESOURCE: Insufficient cluster resources. ERR_MANIFEST: Invalid Kubernetes manifest syntax.',
      url: 'https://happycloud.com/docs/app-cicd/reference/error-codes',
      relevance: 0.86,
      plane: 'App CI/CD'
    }
  ]
};

const DIATAXIS_CONFIG = {
  'how-to': {
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    label: 'How-To Guides'
  },
  'explanation': {
    icon: Lightbulb,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    label: 'Explanations'
  },
  'reference': {
    icon: FileText,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Reference'
  },
  'tutorial': {
    icon: GraduationCap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    label: 'Tutorials'
  }
};

function DocSnippet({ doc, onMarkHelpful, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const [markedHelpful, setMarkedHelpful] = useState(false);
  const config = DIATAXIS_CONFIG[doc.type];
  const Icon = config.icon;

  return (
    <div className={`border-2 ${config.border} ${config.bg} rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-3 flex-1">
          <div className={`${config.color} mt-0.5`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold ${config.color} uppercase tracking-wide`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-500">• {Math.round(doc.relevance * 100)}% match</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">{doc.title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {doc.excerpt}
              {!expanded && doc.excerpt.length > 150 && '...'}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Read full article
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <span className="text-gray-300">•</span>
        <button
          onClick={() => {
            setMarkedHelpful(true);
            onMarkHelpful(doc.id);
          }}
          disabled={markedHelpful}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${
            markedHelpful 
              ? 'text-green-600' 
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${markedHelpful ? 'fill-current' : ''}`} />
          {markedHelpful ? 'Marked helpful' : 'Mark as helpful'}
        </button>
      </div>
    </div>
  );
}

function SmartSidebar({ query, plane, onMarkHelpful, onDismiss }) {
  const [isSearching, setIsSearching] = useState(false);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (query.length < 3) {
      setDocs([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    const timer = setTimeout(() => {
      // Simple mock search logic
      const lowerQuery = query.toLowerCase();
      let results = [];
      
      if (lowerQuery.includes('timeout')) {
        results = MOCK_DOCS['timeout'];
      } else if (lowerQuery.includes('iam') || lowerQuery.includes('role')) {
        results = MOCK_DOCS['iam role'];
      } else if (lowerQuery.includes('deploy') || lowerQuery.includes('fail')) {
        results = MOCK_DOCS['deployment fail'];
      }
      
      setDocs(results);
      setIsSearching(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);

  const groupedDocs = docs.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {});

  if (query.length < 3 && !isSearching) {
    return (
      <div className="bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Start typing your issue description</p>
          <p className="text-xs mt-1">Relevant docs will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Related Documentation
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          {isSearching ? 'Searching...' : `${docs.length} results found`}
        </p>
      </div>

      <div className="p-4">
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No matching documentation found</p>
            <p className="text-xs mt-1">Try describing your issue differently</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(DIATAXIS_CONFIG).map(([type, config]) => {
              const typeDocs = groupedDocs[type] || [];
              if (typeDocs.length === 0) return null;

              return (
                <div key={type}>
                  <h4 className={`text-xs font-bold uppercase tracking-wide mb-3 ${config.color} flex items-center gap-2`}>
                    {React.createElement(config.icon, { className: 'w-4 h-4' })}
                    {config.label}
                  </h4>
                  <div className="space-y-3">
                    {typeDocs.map(doc => (
                      <DocSnippet
                        key={doc.id}
                        doc={doc}
                        onMarkHelpful={onMarkHelpful}
                        onDismiss={() => onDismiss(doc.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Phase2SmartSidebar() {
  const [step, setStep] = useState(3); // Start at step 3 to show the smart sidebar
  const [formData, setFormData] = useState({
    customerId: '1',
    environmentId: 'e2',
    submitterHandle: 'john.doe@company.com',
    primaryPlaneId: 'p1',
    secondaryPlaneIds: [],
    context: 'Application Deployment',
    title: '',
    description: '',
    pipelineUrl: ''
  });
  const [helpfulDocs, setHelpfulDocs] = useState([]);
  const [dismissedDocs, setDismissedDocs] = useState([]);

  const selectedPrimaryPlane = PLANES.find(p => p.id === formData.primaryPlaneId);

  const handleMarkHelpful = (docId) => {
    setHelpfulDocs([...helpfulDocs, { docId, timestamp: new Date(), issueContext: formData }]);
    console.log('Marked helpful:', docId, 'Context:', formData);
  };

  const handleDismissDoc = (docId) => {
    setDismissedDocs([...dismissedDocs, docId]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Submit Support Issue</h1>
              <p className="text-sm text-gray-600 mt-1">Phase 2.0 - Smart Documentation Sidebar</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {step} of 4
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Form Area - 2/3 width */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              {/* Step 3: Issue Details with Smart Sidebar */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Details</h2>
                  <p className="text-gray-600">
                    As you type, we'll suggest relevant documentation from <span className="font-mono text-sm">happycloud.com/docs</span>
                  </p>
                </div>

                {/* Context Badge */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Customer:</span>{' '}
                      <span className="font-semibold text-gray-900">Customer Alpha</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div>
                      <span className="text-gray-600">Environment:</span>{' '}
                      <span className="font-semibold text-gray-900">alpha-qa-01</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border ${ENV_TYPE_COLORS['qa']}`}>
                        qa
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div>
                      <span className="text-gray-600">Plane:</span>{' '}
                      <span className="font-semibold text-gray-900">App CI/CD</span>
                    </div>
                  </div>
                </div>

                {selectedPrimaryPlane && PLANE_CONTEXTS[selectedPrimaryPlane.slug] && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      {PLANE_CONTEXTS[selectedPrimaryPlane.slug].label} *
                    </label>
                    <select
                      value={formData.context}
                      onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all bg-white"
                    >
                      <option value="">Select {PLANE_CONTEXTS[selectedPrimaryPlane.slug].label.toLowerCase()}...</option>
                      {PLANE_CONTEXTS[selectedPrimaryPlane.slug].options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Issue Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Description *
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (Start typing to see relevant docs →)
                    </span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Try typing: 'My deployment pipeline keeps timing out during the build stage' or 'IAM role permissions not working for my pod'"
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Include error messages, expected vs actual behavior, and steps to reproduce
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Pipeline URL <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.pipelineUrl}
                    onChange={(e) => setFormData({ ...formData, pipelineUrl: e.target.value })}
                    placeholder="https://concourse.happycloud.com/teams/..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    disabled={!formData.title || !formData.description}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Review
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Sidebar - 1/3 width */}
          <div className="col-span-1">
            <div className="sticky top-6 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <SmartSidebar
                query={formData.description}
                plane={selectedPrimaryPlane?.slug}
                onMarkHelpful={handleMarkHelpful}
                onDismiss={handleDismissDoc}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Debug info */}
      {helpfulDocs.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg max-w-xs">
          <p className="text-xs font-semibold text-green-900 mb-1">Helpful Docs Tracked:</p>
          <p className="text-xs text-green-700">
            {helpfulDocs.length} doc{helpfulDocs.length !== 1 ? 's' : ''} marked helpful
          </p>
          <p className="text-xs text-green-600 mt-1">
            💾 This data would be persisted to track documentation effectiveness
          </p>
        </div>
      )}
    </div>
  );
}
