---
title: "Tutorial: Submitting Your First Issue"
description: Learn how to submit and track an issue through the Support App
---

This tutorial walks you through submitting your first support issue using the Support App.

## What You'll Learn

- How to navigate the issue submission form
- How to select the right customer and environment
- How to categorize issues by plane
- How to use the smart documentation sidebar
- How to track your submitted issue

## Prerequisites

- Access to Support App (login credentials)
- Knowledge of which customer/environment has the issue

## Step 1: Access the Issue Submission Form

Navigate to the Support App and click **"Submit Issue"** or go directly to:

```
https://platform.happycloud.com/support/issues/new
```

You'll see the multi-step form wizard.

## Step 2: Select Customer and Environment

The first step gathers context about where the issue occurred.

### Select Customer

Click on the customer card where the issue occurred:

- **Customer Alpha**
- **Customer Beta**

### Select Environment

After selecting a customer, the available environments appear. Each shows a type badge:

| Badge | Environment Type |
|-------|-----------------|
| 🔵 dev | Development |
| 🟣 qa | Quality Assurance |
| 🟡 staging | Staging |
| 🔴 production | Production |

Select the specific environment (e.g., `alpha-qa-01`).

### Enter Your WebEx Handle

Enter your email or WebEx handle so the team knows who submitted the issue.

Click **Continue** to proceed.

## Step 3: Categorize the Issue

Select the platform area (plane) where the issue occurred.

### Select Primary Plane

Choose the main category:

| Plane | Use When |
|-------|----------|
| **App CI/CD** | Build, test, deployment pipeline issues |
| **EKS** | Kubernetes cluster, pods, services |
| **Observability** | Logging, monitoring, alerting |
| **Infrastructure CI/CD** | Terraform, infrastructure provisioning |

### Add Related Planes (Optional)

If the issue spans multiple areas, select additional planes.

Click **Continue** to proceed.

## Step 4: Provide Issue Details

Now describe the issue in detail.

### Select Context (if applicable)

For certain planes, you'll see a context dropdown:

**App CI/CD Example:**
- Pipeline Stage: Build, Test, SAST Scan, Deployment, etc.

**EKS Example:**
- Component: Cluster Config, Node Groups, IAM/RBAC, etc.

### Enter Issue Title

Write a brief, descriptive title:

✅ Good: "Pipeline timeout during SAST scan in QA"
❌ Bad: "Help needed" or "Something broke"

### Enter Description

Provide detailed information:

```
What happened:
- Describe the issue clearly

When it happened:
- Timestamp or frequency

Error messages:
- Copy exact error text

Steps to reproduce:
1. First step
2. Second step
3. Issue occurs

Expected behavior:
- What should happen instead
```

### Pipeline URL (Optional)

If relevant, paste the pipeline URL for quick access.

### Smart Documentation Sidebar

As you type your description, the **Smart Sidebar** appears with relevant documentation:

1. **Documentation suggestions** appear automatically
2. Results are categorized (How-To, Explanation, Reference, Tutorial)
3. Each shows a **relevance score** (e.g., 92% match)

**If a doc helps:**
- Click **"Mark as helpful"** - this improves future suggestions

**If you solve your issue:**
- You can close the form without submitting!
- The system tracks self-resolution

Click **Review** to proceed.

## Step 5: Review and Submit

Review all the information you entered:

| Section | Details |
|---------|---------|
| **Context** | Customer, Environment, Submitter |
| **Platform Area** | Primary plane, related planes, context |
| **Issue Details** | Title, description, pipeline URL |

### Make Corrections

Click **Back** to edit any section.

### Submit

Click **Submit Issue** to create the issue.

## Step 6: Confirmation

You'll see a confirmation screen with:

- **Issue ID** (e.g., `ISS-2024-0847`)
- Options to submit another issue or view the issue

Save the Issue ID for tracking.

## Tracking Your Issue

### View Your Issue

Navigate to:
```
https://platform.happycloud.com/support/issues/ISS-2024-0847
```

### Issue Statuses

| Status | Meaning |
|--------|---------|
| 🟢 Open | Newly submitted |
| 🔵 In Progress | Team is investigating |
| ✅ Resolved | Solution provided |
| ⬛ Closed | Issue closed |

### Getting Updates

- Check the issue page for status updates
- Resolution notes are added when solved

## Tips for Better Issues

### Be Specific

❌ "Deployment doesn't work"
✅ "Deployment fails with timeout after 25 minutes on SAST scan stage"

### Include Error Messages

Copy the exact error text - don't paraphrase.

### Provide Context

- What changed recently?
- Does it happen consistently or intermittently?
- What have you tried?

### Use the Smart Sidebar

Check suggested documentation before submitting - your answer might be there!

## Next Steps

- Try the [interactive prototype](/support-app/prototypes/phase1-basic/) to practice
- Learn about [AI Chat mode](/support-app/prototypes/phase3-chat/) for conversational submission
- Read [Phase 2: Smart Sidebar](/support-app/explanation/phases/#phase-2-smart-documentation-sidebar) to understand how suggestions work

## Related Documents

- [Phases Overview](/support-app/explanation/phases/) - All product phases
- [AI Strategy](/support-app/explanation/ai-strategy/) - How AI helps
- [Phase 1 Prototype](/support-app/prototypes/phase1-basic/) - Try it yourself
