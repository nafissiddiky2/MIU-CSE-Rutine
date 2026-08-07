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

function parseCSVLine(line) {
    const cells = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            cells.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    cells.push(current.trim());
    return cells;
}

async function debug() {
    const csv = await fetchCSV(SHEET_URL);
    const lines = csv.split('\n');
    
    console.log('Total lines:', lines.length);
    console.log('');
    
    const dayMap = {
        'sat': 'Saturday', 'sun': 'Sunday', 'mon': 'Monday',
        'tue': 'Tuesday', 'wed': 'Wednesday', 'thu': 'Thursday', 'fri': 'Friday'
    };
    
    const timeSlots = [];
    let currentDay = '';
    let routines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || line.trim() === '') continue;
        
        const cells = parseCSVLine(line.trim());
        if (cells.length === 0) continue;
        
        const first = cells[0].toLowerCase().trim();
        
        // Show what we're processing
        if (i < 35) {
            console.log(`Line ${i}: first="${first}", cells=${cells.length}, [${cells.slice(0,3).join(' | ')}]`);
        }
        
        // Check for teacher section
        if (first === 'abbreviation') {
            console.log(`\n🛑 Stopped at line ${i}: Found abbreviation section`);
            break;
        }
        
        // Check for separator line
        if (first.startsWith('..........') || first.includes('jannatul') || 
            first.includes('prof dr') || first.includes('lecturer')) {
            console.log(`\n🛑 Stopped at line ${i}: Found separator/teacher line`);
            break;
        }
        
        // Time slots header
        if (cells[0] === 'Day' && cells[1] === 'Room') {
            for (let k = 2; k < cells.length; k++) {
                if (cells[k].includes(':')) timeSlots.push(cells[k]);
            }
            console.log(`\n📅 Found time slots (line ${i}):`, timeSlots.join(', '));
            continue;
        }
        
        // Skip metadata
        if (first.includes('manarat') || first.includes('class routine') || 
            first.includes('updated on') || first === 'day') continue;
        
        // Day header
        if (dayMap[first]) {
            currentDay = dayMap[first];
            console.log(`\n📅 Day: ${currentDay} (line ${i})`);
            continue;
        }
        
        // Process data rows
        if (currentDay && cells.length >= 3 && cells[1] && timeSlots.length > 0) {
            const room = cells[1];
            
            for (let j = 2; j < cells.length && j-2 < timeSlots.length; j++) {
                const data = cells[j]?.trim();
                if (!data || data === '' || data.startsWith('...')) continue;
                
                // Parse the cell data
                let clean = data.replace(/^\(/, '').replace(/\)$/, '');
                const parts = clean.split('/');
                
                if (parts.length < 2) continue;
                
                let batchPart = parts[0].trim();
                let course = '', teacher = '';
                
                if (parts.length === 2) {
                    course = parts[1].trim();
                } else if (parts.length === 3) {
                    course = parts[1].trim();
                    teacher = parts[2].trim();
                } else if (parts.length === 4) {
                    course = parts[1] + '/' + parts[2];
                    teacher = parts[3].trim();
                }
                
                // Parse batch numbers with sections
                const tokens = batchPart.split('+').map(t => t.trim());
                
                for (const token of tokens) {
                    const match = token.match(/^(\d+)(\([FM]\))?/);
                    if (match) {
                        routines.push({
                            day: currentDay,
                            time: timeSlots[j-2],
                            batch: match[1],
                            batchDisplay: match[1] + (match[2] || ''),
                            section: match[2] || '',
                            course: course,
                            room: room,
                            teacher: teacher
                        });
                    }
                }
            }
        }
    }
    
    console.log(`\n\n📊 TOTAL ROUTINES: ${routines.length}`);
    console.log(`Days: ${[...new Set(routines.map(r => r.day))].join(', ')}`);
    console.log(`Batches: ${[...new Set(routines.map(r => r.batchDisplay))].sort().join(', ')}`);
    console.log(`\nSample routines:`);
    routines.slice(0, 10).forEach((r, i) => {
        console.log(`  ${i+1}. ${r.day} | ${r.time} | Batch ${r.batchDisplay} | ${r.course} | ${r.room} | ${r.teacher}`);
    });
}

debug().catch(console.error);
