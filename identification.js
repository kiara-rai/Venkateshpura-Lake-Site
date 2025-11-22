document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const resultsArea = document.getElementById('results-area');
    resultsArea.innerHTML = '<h3>Identifying... please wait.</h3>'; // Show loading state

    try {
        const formData = new FormData(form);
        
        // 1. Send the file to your deployed Render backend
        // NOTE: Use the full URL of your deployed Render service if testing locally
        // or a relative path (/api/identify) if your frontend is served from the same domain.
        const RENDER_BASE_URL = "https://venkateshpura-chatbot.onrender.com"; // <-- PASTE YOUR ACTUAL RENDER URL HERE!

        const response = await fetch(`${RENDER_BASE_URL}/api/identify`, {
            method: 'POST',
            body: formData 
        });

        // Check if the server responded successfully (status 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            resultsArea.innerHTML = `<h3>Error: ${errorData.detail || 'Server failed to process the request.'}</h3>`;
            return;
        }

        const data = await response.json();

        // 2. Display the results or the "no match" message
        if (data.scientificName) {
            resultsArea.innerHTML = `
                <h3>✅ Identification Successful</h3>
                <p><strong>Common Name:</strong> ${data.commonName}</p>
                <p><strong>Scientific Name:</strong> <em>${data.scientificName}</em></p>
                <p><strong>Confidence:</strong> ${data.confidence}%</p>
                <hr>
                <h4>Contribution to the Ecosystem</h4>
                <p>${data.contribution}</p>
            `;
        } else {
            resultsArea.innerHTML = `<h3>${data.message || 'No species could be identified. Please try a clearer photo.'}</h3>`;
        }

    } catch (error) {
        // Catch network errors (e.g., server offline, CORS issue)
        console.error('Network or processing error:', error);
        resultsArea.innerHTML = '<h3>Connection Error: Could not reach the identification service.</h3>';
    }
});