import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Loader2, Server, GitBranch, Eye, Database, Network, Shield } from 'lucide-react';

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
  },
  { 
    id: 'p3', 
    name: 'Observability', 
    slug: 'observability',
    description: 'Logging, monitoring, and alerting',
    icon: Eye,
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'p4', 
    name: 'Infrastructure CI/CD', 
    slug: 'infra-cicd',
    description: 'Infrastructure provisioning and management',
    icon: Database,
    color: 'from-green-500 to-emerald-500'
  }
];

const PLANE_CONTEXTS = {
  'app-cicd': {
    key: 'pipeline_stage',
    label: 'Pipeline Stage',
    options: [
      'Source Checkout',
      'Dependency Resolution',
      'Build/Compile',
      'Unit Tests',
      'Code Linting',
      'SonarQube Scan',
      'SAST Scan',
      'Dependency Vulnerability Scan',
      'Container Image Build',
      'Artifact Publishing',
      'Infrastructure Provisioning',
      'Database Migration',
      'Application Deployment',
      'Integration Tests',
      'Regression Tests',
      'DAST Scan',
      'Performance Tests',
      'Smoke Tests',
      'Health Checks'
    ]
  },
  'eks': {
    key: 'eks_component',
    label: 'EKS Component',
    options: [
      'Cluster Configuration',
      'Node Groups',
      'Fargate Profiles',
      'Networking/VPC',
      'IAM/RBAC',
      'Add-ons (EBS CSI, EFS, etc.)',
      'Ingress/Load Balancer',
      'Pod Security',
      'Resource Quotas',
      'Autoscaling',
      'Logging',
      'Metrics'
    ]
  }
};

const ENV_TYPE_COLORS = {
  dev: 'bg-blue-100 text-blue-700 border-blue-200',
  qa: 'bg-purple-100 text-purple-700 border-purple-200',
  staging: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  production: 'bg-red-100 text-red-700 border-red-200'
};

export default function IssueSubmissionFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerId: '',
    environmentId: '',
    submitterHandle: '',
    primaryPlaneId: '',
    secondaryPlaneIds: [],
    context: '',
    title: '',
    description: '',
    pipelineUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCustomer = CUSTOMERS.find(c => c.id === formData.customerId);
  const availableEnvironments = formData.customerId ? ENVIRONMENTS[formData.customerId] : [];
  const selectedEnvironment = availableEnvironments.find(e => e.id === formData.environmentId);
  const selectedPrimaryPlane = PLANES.find(p => p.id === formData.primaryPlaneId);
  const selectedSecondaryPlanes = PLANES.filter(p => formData.secondaryPlaneIds.includes(p.id));

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Submitted</h2>
            <p className="text-gray-600 mb-6">Your issue has been created successfully.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Issue ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900">ISS-2024-0847</p>
            </div>
            <button 
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormData({
                  customerId: '',
                  environmentId: '',
                  submitterHandle: '',
                  primaryPlaneId: '',
                  secondaryPlaneIds: [],
                  context: '',
                  title: '',
                  description: '',
                  pipelineUrl: ''
                });
              }}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Submit Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Submit Support Issue</h1>
          <p className="text-gray-600 text-lg">Help us track and resolve your platform issues</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Context' },
              { num: 2, label: 'Category' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Review' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s.num 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <p className={`text-sm mt-2 font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-500'}`}>
                    {s.label}
                  </p>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all ${
                    step > s.num ? 'bg-gray-900' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Step 1: Customer & Environment */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Context</h2>
                <p className="text-gray-600">Select the customer and environment where the issue occurred</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Customer</label>
                <div className="grid grid-cols-2 gap-3">
                  {CUSTOMERS.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => setFormData({ ...formData, customerId: customer.id, environmentId: '' })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.customerId === customer.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{customer.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {formData.customerId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Environment</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableEnvironments.map(env => (
                      <button
                        key={env.id}
                        onClick={() => setFormData({ ...formData, environmentId: env.id })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.environmentId === env.id
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 mb-2">{env.name}</p>
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${ENV_TYPE_COLORS[env.type]}`}>
                          {env.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.environmentId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Your WebEx Handle</label>
                  <input
                    type="text"
                    value={formData.submitterHandle}
                    onChange={(e) => setFormData({ ...formData, submitterHandle: e.target.value })}
                    placeholder="e.g., john.doe@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all"
                  />
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.customerId || !formData.environmentId || !formData.submitterHandle}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Plane Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Platform Area</h2>
                <p className="text-gray-600">Choose the primary area where the issue occurred</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Primary Plane *</label>
                <div className="grid grid-cols-2 gap-4">
                  {PLANES.map(plane => {
                    const Icon = plane.icon;
                    return (
                      <button
                        key={plane.id}
                        onClick={() => setFormData({ ...formData, primaryPlaneId: plane.id })}
                        className={`group relative p-6 rounded-xl border-2 transition-all text-left overflow-hidden ${
                          formData.primaryPlaneId === plane.id
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${plane.color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plane.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-bold text-gray-900 mb-1">{plane.name}</p>
                        <p className="text-sm text-gray-600">{plane.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.primaryPlaneId && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Related Planes <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PLANES.filter(p => p.id !== formData.primaryPlaneId).map(plane => {
                      const Icon = plane.icon;
                      const isSelected = formData.secondaryPlaneIds.includes(plane.id);
                      return (
                        <button
                          key={plane.id}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              secondaryPlaneIds: isSelected
                                ? formData.secondaryPlaneIds.filter(id => id !== plane.id)
                                : [...formData.secondaryPlaneIds, plane.id]
                            });
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                            isSelected
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plane.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <p className="font-semibold text-sm text-gray-900">{plane.name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.primaryPlaneId}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Issue Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Details</h2>
                <p className="text-gray-600">Provide specific information about the issue</p>
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
                <label className="block text-sm font-semibold text-gray-900 mb-3">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Pipeline URL <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.pipelineUrl}
                  onChange={(e) => setFormData({ ...formData, pipelineUrl: e.target.value })}
                  placeholder="https://concourse.example.com/teams/..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 outline-none transition-all"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!formData.title || !formData.description || (selectedPrimaryPlane && PLANE_CONTEXTS[selectedPrimaryPlane.slug] && !formData.context)}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Review
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
                <p className="text-gray-600">Please review your issue before submitting</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Context</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Customer:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedCustomer?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Environment:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{selectedEnvironment?.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${ENV_TYPE_COLORS[selectedEnvironment?.type]}`}>
                          {selectedEnvironment?.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Submitter:</span>
                      <span className="text-sm font-mono text-gray-900">{formData.submitterHandle}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Platform Area</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedPrimaryPlane && (
                        <>
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedPrimaryPlane.color} flex items-center justify-center`}>
                            {React.createElement(selectedPrimaryPlane.icon, { className: "w-4 h-4 text-white" })}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{selectedPrimaryPlane.name}</p>
                            <p className="text-xs text-gray-600">Primary</p>
                          </div>
                        </>
                      )}
                    </div>
                    {selectedSecondaryPlanes.length > 0 && (
                      <div className="pl-10 space-y-1">
                        {selectedSecondaryPlanes.map(plane => (
                          <p key={plane.id} className="text-sm text-gray-600">+ {plane.name}</p>
                        ))}
                      </div>
                    )}
                    {formData.context && (
                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">{PLANE_CONTEXTS[selectedPrimaryPlane.slug]?.label}:</span>
                        <p className="text-sm font-medium text-gray-900">{formData.context}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Issue Details</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                    </div>
                    {formData.pipelineUrl && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Pipeline URL:</p>
                        <a href={formData.pipelineUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                          {formData.pipelineUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Issue
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
