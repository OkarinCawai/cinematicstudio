import { supabase } from '@/lib/supabase';

export default async function TestDbPage() {
    let status = 'loading';
    let errorMessage = '';

    try {
        // Try to get a session (stateless check if using anon key, but confirms client config)
        // Or better, just a simple query. `auth.getSession()` might be empty but not error.

        const { error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;

        status = 'success';
    } catch (err: any) {
        status = 'error';
        errorMessage = err.message || JSON.stringify(err);
    }

    return (
        <div className="p-10 font-sans">
            <h1>Supabase Connection Status</h1>
            {status === 'success' && (
                <div data-testid="success">
                    <h2>✓ Connection Successful</h2>
                    <p>Server-side check passed.</p>
                </div>
            )}
            {status === 'error' && (
                <div data-testid="error">
                    <h2>✗ Connection Failed</h2>
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    );
}

