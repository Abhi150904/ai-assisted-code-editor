import { useEffect, useState, useCallback, use } from 'react';
import { WebContainer } from '@webcontainer/api';
import { TemplateFolder } from '@/features/playground/lib/path-to-json';
import { se } from 'date-fns/locale';

interface UseWebContainerProps {
    templateData: TemplateFolder;
}
export interface UseWebContainerReturn {
    serverUrl: string | null;
    isLoading: boolean;
    error: Error | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    destroy: () => void;
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [instance, setInstance] = useState<WebContainer | null>(null);

    useEffect(() => {
        let mounted = true;
        let webContainerInstance: WebContainer | null = null;

        async function initializeWebContainer() {
            try {
                webContainerInstance = await WebContainer.boot();
                if (!mounted) {
                    // Teardown if component unmounted before state could be set
                    webContainerInstance?.teardown();
                    return;
                }
                setInstance(webContainerInstance);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to initialize WebContainer:', error);
                if (mounted){
                    setError(error instanceof Error ? error : new Error(String(error)));
                    setIsLoading(false);
                }
            }
        }
        initializeWebContainer();

        return () => {
            mounted = false;
            // Teardown the instance from state
            if (instance) {
                instance.teardown();
            }
            // Also teardown the local reference in case it wasn't set in state
            if (webContainerInstance && !instance) {
                webContainerInstance.teardown();
            }
        };
    },[])

    const writeFileSync = useCallback(async(path: string, content: string): Promise<void> => {
        if (!instance) {
            throw new Error('WebContainer instance is not initialized');
        }
        try {
            const pathParts = path.split('/')
            const folderPath = pathParts.slice(0, -1).join('/');
            if (folderPath) {
                await instance.fs.mkdir(folderPath, { recursive: true });
            }
            await instance.fs.writeFile(path, content);
        } catch (error) {
            console.error('Failed to write file:', error);
            throw error;
        }
    }, [instance]);

    const destroy = useCallback(() => {
        if (instance) {
            instance.teardown();
             setInstance(null);
             setServerUrl(null);
             setIsLoading(true);
             setError(null);
        }
    },[instance])

    return {
        destroy,
        serverUrl,
        isLoading,
        error,
        instance,
        writeFileSync
    }
}