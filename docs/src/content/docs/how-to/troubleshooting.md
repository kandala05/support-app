---
title: Troubleshooting
description: Common issues and solutions for Support App
---

This guide covers common issues you might encounter and how to resolve them.

## Development Issues

### LocalStack Won't Start

**Symptoms**: `docker-compose up` fails or services show as "unavailable"

**Solutions**:

1. Check Docker is running:
   ```bash
   docker info
   ```

2. Ensure sufficient resources (Docker Desktop):
   - Memory: 4GB minimum
   - CPU: 2 cores minimum

3. Clear Docker state:
   ```bash
   docker-compose down -v
   docker system prune -f
   docker-compose up -d
   ```

4. Check for port conflicts:
   ```bash
   lsof -i :4566
   ```

### Database Connection Refused

**Symptoms**: `ECONNREFUSED` errors when connecting to PostgreSQL

**Solutions**:

1. Verify LocalStack is running:
   ```bash
   curl http://localhost:4566/_localstack/health
   ```

2. Check DATABASE_URL:
   ```bash
   echo $DATABASE_URL
   # Should be: postgresql://postgres:postgres@localhost:5432/support_app
   ```

3. Wait for RDS to initialize (can take 30-60 seconds):
   ```bash
   # Watch logs
   docker-compose logs -f localstack | grep rds
   ```

### SST Dev Mode Issues

**Symptoms**: `sst dev` crashes or doesn't start

**Solutions**:

1. Clear SST cache:
   ```bash
   rm -rf .sst
   ```

2. Check Node.js version:
   ```bash
   node --version
   # Should be 20+
   ```

3. Reinstall dependencies:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

4. Check for TypeScript errors:
   ```bash
   pnpm tsc --noEmit
   ```

### Build Failures

**Symptoms**: `pnpm build` fails with errors

**Solutions**:

1. Clear build cache:
   ```bash
   rm -rf .next .astro dist
   ```

2. Check for missing dependencies:
   ```bash
   pnpm install
   ```

3. Verify environment variables:
   ```bash
   # All required vars should be set
   env | grep -E "(DATABASE|COGNITO|AWS)"
   ```

## Application Issues

### Authentication Not Working

**Symptoms**: Login fails or tokens invalid

**Solutions**:

1. For LocalStack, ensure Cognito is mocked:
   ```bash
   curl http://localhost:4566/_localstack/health | jq .services.cognito
   ```

2. Check Cognito environment variables:
   ```bash
   echo $COGNITO_USER_POOL_ID
   echo $COGNITO_CLIENT_ID
   ```

3. Clear browser storage:
   - Open DevTools > Application > Storage > Clear site data

### API Returns 500 Errors

**Symptoms**: API calls fail with internal server errors

**Solutions**:

1. Check server logs:
   ```bash
   # SST dev logs
   npx sst dev

   # Or check CloudWatch (AWS)
   aws logs tail /aws/lambda/support-app-...
   ```

2. Verify database connection:
   ```bash
   npx drizzle-kit studio
   # Should open without errors
   ```

3. Check for schema mismatches:
   ```bash
   npx drizzle-kit push
   ```

### Documentation Search Not Working

**Symptoms**: Smart sidebar shows no results

**Solutions**:

1. Ensure search endpoint is running:
   ```bash
   curl http://localhost:3000/api/docs/search \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"query": "timeout"}'
   ```

2. Check ANTHROPIC_API_KEY (if using AI search):
   ```bash
   echo $ANTHROPIC_API_KEY | head -c 10
   # Should show: sk-ant-...
   ```

## Deployment Issues

### AWS Deployment Fails

**Symptoms**: `sst deploy` fails

**Solutions**:

1. Check AWS credentials:
   ```bash
   aws sts get-caller-identity
   ```

2. Verify Cloudflare API token (for DNS):
   ```bash
   # Set in SST config
   npx sst secret list
   ```

3. Check for resource conflicts:
   ```bash
   # View existing resources
   npx sst console
   ```

### DNS Not Resolving

**Symptoms**: Custom domain not working after deployment

**Solutions**:

1. DNS propagation takes time (up to 48 hours)

2. Check Cloudflare DNS records:
   ```bash
   dig platform.happycloud.com
   ```

3. Verify SSL certificate:
   ```bash
   curl -vI https://platform.happycloud.com/support/
   ```

### Lambda Cold Starts

**Symptoms**: First request is slow (5-10 seconds)

**Solutions**:

1. Enable provisioned concurrency (costs more):
   ```typescript
   // In SST config
   new sst.aws.Function("Api", {
     // ...
     provisioned: 1
   });
   ```

2. Reduce bundle size:
   ```bash
   # Check bundle
   npx @next/bundle-analyzer
   ```

## Performance Issues

### Slow Database Queries

**Symptoms**: API responses take > 1 second

**Solutions**:

1. Add database indexes:
   ```sql
   CREATE INDEX idx_issues_customer ON issues(customer_id);
   CREATE INDEX idx_issues_created ON issues(created_at DESC);
   ```

2. Check query plans:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM issues WHERE customer_id = '...';
   ```

3. Use connection pooling (RDS Proxy in production)

### Large Bundle Size

**Symptoms**: Initial page load slow

**Solutions**:

1. Analyze bundle:
   ```bash
   ANALYZE=true pnpm build
   ```

2. Use dynamic imports:
   ```typescript
   const Chart = dynamic(() => import('./Chart'), { ssr: false });
   ```

3. Check for duplicate dependencies:
   ```bash
   npx depcheck
   ```

## Getting Help

If you can't resolve an issue:

1. Check existing [GitHub Issues](https://github.com/kandala05/support-app/issues)
2. Search the [Team Playbook](https://kandala05.github.io/team-playbook/)
3. Create a new issue with:
   - Error message (full stack trace)
   - Steps to reproduce
   - Environment (Node version, OS, etc.)
   - Relevant configuration

## Related Documents

- [Local Setup](/support-app/how-to/local-setup/) - Development environment
- [Deploy to AWS](/support-app/how-to/deploy-to-aws/) - Deployment guide
- [Infrastructure](/support-app/reference/infrastructure/) - SST configuration
