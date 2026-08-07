const https = require('https');
const http = require('http');

// The published URL from your sheet
const PUBLISHED_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQovxGy5N4TVqkJESrtQaaW20hhzqyppbgDKsiZs11fJp7pQoDfnaYjjhG5xcL6wXkijYF4Hi8FO36g/pub?gid=350123385&single=true&output=csv';

function fetchWithRedirect(url, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (res) => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Location: ${res.headers.location || 'none'}`);
            
            // Handle redirect
            if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) && res.headers.location) {
                if (maxRedirects > 0) {
                    console.log(`Following redirect to: ${res.headers.location}`);
                    fetchWithRedirect(res.headers.location, maxRedirects - 1)
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(new Error('Too many redirects'));
                }
                return;
            }
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function testSheet() {
    console.log('Testing Google Sheet connection...\n');
    
    // Try different URL formats
    const urls = [
        {
            name: 'Published URL',
            url: PUBLISHED_URL
        },
        {
            name: 'Direct export (original)',
            url: 'https://docs.google.com/spreadsheets/d/1pH0ZzPfwNNvvFpDR8N7eDtqeXKd1KcDKNRz4ca42T9U/export?format=csv&gid=350123385'
        },
        {
            name: 'Published without gid',
            url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQovxGy5N4TVqkJESrtQaaW20hhzqyppbgDKsiZs11fJp7pQoDfnaYjjhG5xcL6wXkijYF4Hi8FO36g/pub?output=csv'
        }
    ];
    
    for (const { name, url } of urls) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Testing: ${name}`);
        console.log(`URL: ${url}`);
        console.log('-'.repeat(60));
        
        try {
            const data = await fetchWithRedirect(url);
            
            if (data && data.length > 0) {
                console.log(`✅ SUCCESS! Got ${data.length} characters`);
                console.log('\nFirst 300 characters:');
                console.log(data.substring(0, 300));
                
                // Check if it's CSV or HTML
                if (data.startsWith('<!DOCTYPE') || data.startsWith('<html')) {
                    console.log('\n❌ Got HTML instead of CSV. Sheet might not be published correctly.');
                } else {
                    console.log('\n✅ Looks like valid CSV data!');
                    const rows = data.split('\n');
                    console.log(`Number of rows: ${rows.length}`);
                    console.log('\nFirst 5 rows:');
                    rows.slice(0, 5).forEach((row, i) => {
                        console.log(`Row ${i}: ${row.substring(0, 150)}`);
                    });
                }
            } else {
                console.log('❌ Empty response');
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n\n📋 Instructions to fix:');
    console.log('1. Open your Google Sheet');
    console.log('2. File → Share → Publish to web');
    console.log('3. Select the sheet that contains routine data');
    console.log('4. Choose "Comma-separated values (.csv)"');
    console.log('5. Click Publish');
    console.log('6. Copy the new URL and update it in backend/server.js');
}

testSheet();
