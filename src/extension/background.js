const sendMetrics = async () => {
    chrome.tabs.query({}, (tabs) => {
      const tabCount = tabs.length; 
      const metrics = tabs.map(tab => ({
        domain: new URL(tab.url).hostname, 
        timestamp: new Date().toISOString() 
      }));
  
      fetch('http://localhost:3000/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tabCount, metrics })
      })
      .then(response => response.json())
      .then(data => console.log('Metrics sent successfully:', data))
      .catch((error) => console.error('Error sending metrics:', error));
    });
  };
  
  chrome.tabs.onCreated.addListener((tab) => {
    console.log(tab);
    
    console.log('New tab created:', tab);
    sendMetrics();
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') { 
      console.log('Tab updated:', tab);
      sendMetrics(); 
    }
  });

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log('Tab closed:', tabId);
    sendMetrics(); 
});
  
  sendMetrics();
  