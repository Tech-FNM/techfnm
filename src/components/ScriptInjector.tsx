import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CustomScripts {
  head: string;
  bodyTop: string;
  bodyBottom: string;
  footer: string;
}

export default function ScriptInjector() {
  useEffect(() => {
    let isMounted = true;

    const fetchAndInject = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('content')
          .eq('id', 'custom_scripts')
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.error('Error fetching injected scripts:', error);
          return;
        }

        // Cleanup any previously injected tags
        cleanInjectedTags();

        if (data && data.content) {
          const scripts: CustomScripts = {
            head: data.content.head || '',
            bodyTop: data.content.bodyTop || '',
            bodyBottom: data.content.bodyBottom || '',
            footer: data.content.footer || '',
          };

          // 1. Inject Head Scripts
          if (scripts.head.trim()) {
            injectHtmlString(scripts.head, document.head);
          }

          // 2. Inject Body Top Scripts
          if (scripts.bodyTop.trim()) {
            injectHtmlString(scripts.bodyTop, document.body, 'start');
          }

          // 3. Inject Body Bottom Scripts
          if (scripts.bodyBottom.trim()) {
            injectHtmlString(scripts.bodyBottom, document.body, 'end');
          }

          // 4. Inject Footer Scripts
          if (scripts.footer.trim()) {
            // Find footers or append to body end
            const footerEl = document.querySelector('footer') || document.body;
            injectHtmlString(scripts.footer, footerEl, 'end');
          }
        }
      } catch (err) {
        console.error('Failed to run script injection:', err);
      }
    };

    fetchAndInject();

    return () => {
      isMounted = false;
      cleanInjectedTags();
    };
  }, []);

  const cleanInjectedTags = () => {
    const elements = document.querySelectorAll('[data-injected="true"]');
    elements.forEach((el) => {
      el.parentNode?.removeChild(el);
    });
  };

  const injectHtmlString = (html: string, target: Element, position: 'start' | 'end' = 'end') => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Combine nodes from both doc head and doc body (DOMParser separates them during parsing)
      const nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));
      
      // Reversing for 'start' position injection so they maintain original layout sequence
      const nodesToInject = position === 'start' ? nodes.reverse() : nodes;

      nodesToInject.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const originalEl = node as HTMLElement;
          const tagName = originalEl.tagName.toLowerCase();
          
          const newEl = document.createElement(tagName);
          
          // Copy all attributes
          Array.from(originalEl.attributes).forEach((attr) => {
            newEl.setAttribute(attr.name, attr.value);
          });
          
          // Identify it as injected to clean up later
          newEl.setAttribute('data-injected', 'true');
          
          // Handling Script tag separately since browsers don't execute script tags unless created dynamically
          if (tagName === 'script') {
            if (originalEl.getAttribute('src')) {
              newEl.setAttribute('src', originalEl.getAttribute('src') || '');
            } else {
              newEl.textContent = originalEl.textContent;
            }
          } else {
            newEl.innerHTML = originalEl.innerHTML;
          }

          if (position === 'start') {
            target.insertBefore(newEl, target.firstChild);
          } else {
            target.appendChild(newEl);
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          // Wrap text nodes in span and inject
          const span = document.createElement('span');
          span.setAttribute('data-injected', 'true');
          span.textContent = node.textContent;
          if (position === 'start') {
            target.insertBefore(span, target.firstChild);
          } else {
            target.appendChild(span);
          }
        }
      });
    } catch (err) {
      console.error('Error parsing and injecting code snippet:', err);
    }
  };

  return null; // This rendering component is headless and performs utility actions in background
}
