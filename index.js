const XLSX = require('xlsx');
const fs = require('fs');

// Function to read and parse an Excel file
function readExcelFile(filePath) {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet);
    } catch (error) {
        console.error(`Error reading file: ${filePath}`, error);
        return [];
    }
}

// Function to normalize the data from different structures
function normalizeData(record, codeField, nameField) {
    const code = record[codeField];
    const name = record[nameField];

    if (code && name) {
        return {
            "代码": String(code).trim(),
            "名称": String(name).trim()
        };
    }
    return null;
}

// Main logic
function main() {
    const dataA = readExcelFile('A股列表.xlsx');
    const dataG = readExcelFile('GPLIST.xls');

    const normalizedA = dataA.map(record => normalizeData(record, 'A股代码', 'A股简称')).filter(Boolean);
    const normalizedG = dataG.map(record => normalizeData(record, 'A股代码', '证券简称')).filter(Boolean);

    const combinedData = [...normalizedA, ...normalizedG];

    // Remove duplicates based on '代码'
    const uniqueData = Array.from(new Map(combinedData.map(item => [item['代码'], item])).values());

    try {
        fs.writeFileSync('result.json', JSON.stringify(uniqueData, null, 2), 'utf-8');
        console.log('Successfully created result.json');
    } catch (error) {
        console.error('Error writing JSON file:', error);
    }
}

main();
