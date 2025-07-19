import { useState } from 'react';
import { AdminAnalyticsApi } from '@/services/adminAnalyticsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const AdminApiTestComponent: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');

  const testApi = async () => {
    setStatus('testing');
    setMessage('Testing connection...');
    
    try {
      // Get the API configuration
      const config = AdminAnalyticsApi.getConfig();
      setApiUrl(config.baseURL);
      
      console.log('Testing connection to:', config.baseURL);
      
      // Test the connection
      const result = await AdminAnalyticsApi.testConnection();
      
      if (result.success) {
        setStatus('success');
        setMessage(`✅ ${result.message}`);
      } else {
        setStatus('error');
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Admin API Connection Test
        </CardTitle>
        <CardDescription>
          Test connectivity to the admin analytics backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>API URL:</strong> 
          </p>
          <code className="block p-2 bg-muted rounded text-xs break-all">
            {apiUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}
          </code>
        </div>
        
        {message && (
          <Alert variant={status === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={testApi} 
          disabled={status === 'testing'}
          className="w-full"
        >
          {status === 'testing' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <p><strong>Environment Variables:</strong></p>
          <ul className="list-disc pl-4 space-y-1">
            <li>VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL || 'Not set'}</li>
            <li>NODE_ENV: {import.meta.env.NODE_ENV || 'Not set'}</li>
            <li>MODE: {import.meta.env.MODE || 'Not set'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
