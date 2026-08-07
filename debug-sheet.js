const https = require('https');

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1pH0ZzPfwNNvvFpDR8N7eDtqeXKd1KcDKNRz4ca42T9U/export?format=csv&gid=350123385';

function fetchCSV(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchCSV(res.headers.location).then(resolve).catch(reject);
                return;
            }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function debug() {
    const csv = await fetchCSV(SHEET_URL);
    
    console.log('=== RAW CSV DATA ===');
    console.log('Total length:', csv.length);
    console.log('');
    
    const lines = csv.split('\n');
    console.log('Total lines:', lines.length);
    console.log('');
    
    // Show first 30 lines
    console.log('=== FIRST 30 LINES ===');
    for (let i = 0; i < Math.min(30, lines.length); i++) {
        console.log(`Line ${i}: [${lines[i].substring(0, 150)}]`);
    }
    
    console.log('');
    console.log('=== TRYING TO PARSE ===');
    
    const dayMap = {
        'sat': 'Saturday', 'sun': 'Sunday', 'mon': 'Monday',
        'tue': 'Tuesday', 'wed': 'Wednesday', 'thu': 'Thursday', 'fri': 'Friday'
    };
    
    const timeSlots = [];
    let currentDay = '';
    let routineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parse
        const cells = line.split(',').map(c => c.trim().replace(/^"(.*)"$/, '$1'));
        
        if (cells.length === 0) continue;
        
        // Check for time slots header
        if (cells[0] === 'Day' && cells[1] === 'Room') {
            for (let k = 2; k < cells.length; k++) {
                if (cells[k].includes(':')) timeSlots.push(cells[k]);
            }
            console.log('Found time slots:', timeSlots);
            continue;
        }
        
        const first = cells[0].toLowerCase();
        
        // Day header
        if (dayMap[first]) {
            currentDay = dayMap[first];
            console.log(`\n--- Processing day: ${currentDay} ---`);
            continue;
        }
        
        // Data row
        if (currentDay && cells.length >= 3 && cells[1]) {
            const room = cells[1];
            
            for (let j = 2; j < cells.length && j-2 < timeSlots.length; j++) {
                const data = cells[j]?.trim();
                if (!data || data === '') continue;
                
                console.log(`  Room: ${room}, Time: ${timeSlots[j-2]}, Data: ${data}`);
                
                // Parse data
                let clean = data.replace(/^\(/, '').replace(/\)$/, '').replace(/[()]/g, '');
                const parts = clean.split('/');
                
                if (parts.length >= 2) {
                    const batchPart = parts[0].trim();
                    const course = parts[1].trim();
                    const teacher = parts[2]?.trim() || '';
                    
                    const batches = batchPart.split('+').map(b => b.trim()).filter(Boolean);
                    
                    console.log(`    Batches: [${batches}], Course: ${course}, Teacher: ${teacher}`);
                    
                    batches.forEach(batch => {
                        routineCount++;
                        console.log(`    ✅ Added: ${currentDay} | ${timeSlots[j-2]} | Batch ${batch} | ${course} | ${room} | ${teacher}`);
                    });
                } else {
                    console.log(`    ⚠️ Could not parse: ${data}`);
                }
            }
        }
    }
    
    console.log(`\n\n=== TOTAL ROUTINES PARSED: ${routineCount} ===`);
}

debug().catch(console.error);
