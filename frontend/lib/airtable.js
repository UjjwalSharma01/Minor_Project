// Airtable API Integration

const AIRTABLE_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;

/**
 * Fetches all tables from the Airtable base
 * @param {string} baseId - The Airtable base ID
 * @returns {Promise<Array>} Array of table metadata
 */
export async function getBaseTables(baseId) {
  try {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tables: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tables || [];
  } catch (error) {
    console.error('Error fetching Airtable tables:', error);
    throw error;
  }
}

/**
 * Fetches all records from a specific table
 * @param {string} baseId - The Airtable base ID
 * @param {string} tableId - The table ID or name
 * @returns {Promise<Object>} Records and field metadata
 */
export async function getTableRecords(baseId, tableId) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch records: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      records: data.records || [],
      offset: data.offset || null,
    };
  } catch (error) {
    console.error('Error fetching Airtable records:', error);
    throw error;
  }
}

/**
 * Fetches all records with pagination support
 * @param {string} baseId - The Airtable base ID
 * @param {string} tableId - The table ID or name
 * @returns {Promise<Array>} All records from the table
 */
export async function getAllTableRecords(baseId, tableId) {
  let allRecords = [];
  let offset = null;

  try {
    do {
      const url = offset
        ? `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}?offset=${offset}`
        : `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch records: ${response.statusText}`);
      }

      const data = await response.json();
      allRecords = [...allRecords, ...(data.records || [])];
      offset = data.offset || null;
    } while (offset);

    return allRecords;
  } catch (error) {
    console.error('Error fetching all Airtable records:', error);
    throw error;
  }
}

/**
 * Extracts unique field names from records
 * @param {Array} records - Array of Airtable records
 * @returns {Array} Array of field names
 */
export function extractFieldNames(records) {
  if (!records || records.length === 0) return [];
  
  const fieldSet = new Set();
  records.forEach(record => {
    if (record.fields) {
      Object.keys(record.fields).forEach(field => fieldSet.add(field));
    }
  });
  
  return Array.from(fieldSet);
}

/**
 * Formats field value for display
 * @param {any} value - The field value
 * @returns {string} Formatted value
 */
export function formatFieldValue(value) {
  if (value === null || value === undefined) return '-';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
