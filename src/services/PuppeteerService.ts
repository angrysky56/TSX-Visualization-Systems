import { useState } from 'react';

export interface PuppeteerActionConfig {
  type: 'click' | 'fill' | 'select' | 'hover' | 'evaluate';
  selector?: string;
  value?: string;
  script?: string;
}

export const usePuppeteerActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAction = async (config: PuppeteerActionConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      switch (config.type) {
        case 'click':
          await window.puppeteer_click({ selector: config.selector! });
          break;
        case 'fill':
          await window.puppeteer_fill({ 
            selector: config.selector!,
            value: config.value!
          });
          break;
        case 'select':
          await window.puppeteer_select({
            selector: config.selector!,
            value: config.value!
          });
          break;
        case 'hover':
          await window.puppeteer_hover({ selector: config.selector! });
          break;
        case 'evaluate':
          await window.puppeteer_evaluate({ script: config.script! });
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { executeAction, isLoading, error };
};
