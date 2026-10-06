/**
 * Utility to trigger emergency dial pad on native devices / mobile browsers.
 * Uses anchor-click and direct location fallback for maximum browser & iframe compatibility.
 */
export const triggerEmergencyDialPad = (phoneNumber: string = '112') => {
  try {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const telUrl = `tel:${cleanNumber}`;
    
    // Method 1: Programmatic anchor element click (works inside iframes and WebViews)
    const link = document.createElement('a');
    link.href = telUrl;
    link.setAttribute('rel', 'noopener noreferrer');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Clean up after a short tick
    setTimeout(() => {
      try {
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch {
        // ignore cleanup error
      }
    }, 500);
  } catch (err) {
    console.error('Failed to trigger emergency dial pad:', err);
    try {
      window.location.href = `tel:${phoneNumber}`;
    } catch {
      // ignore
    }
  }
};
