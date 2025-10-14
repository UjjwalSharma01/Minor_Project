'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllTableRecords, extractFieldNames, formatFieldValue } from '@/lib/airtable';
import { InteractiveCard } from './premium-interactions';
import { showSuccessToast, showErrorToast, showLoadingToast } from '@/lib/toast-utils';

export default function AirtableViewer({ baseId, tableName }) {
  const [records, setRecords] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef('');

  useEffect(() => {
    const fetchKey = `${baseId}-${tableName}`;
    // Prevent duplicate calls for the same baseId/tableName combination
    if (fetchingRef.current || lastFetchRef.current === fetchKey) {
      return;
    }
    fetchTableData();
  }, [baseId, tableName]);

  const fetchTableData = async () => {
    if (!baseId || !tableName) {
      setError('Base ID and Table Name are required');
      setLoading(false);
      fetchingRef.current = false;
      return;
    }

    // Prevent concurrent calls
    if (fetchingRef.current) {
      console.log('⏳ Already fetching, skipping duplicate call');
      return;
    }

    const fetchKey = `${baseId}-${tableName}`;
    fetchingRef.current = true;
    lastFetchRef.current = fetchKey;
    
    const toastId = showLoadingToast('Fetching data from Airtable...');
    setLoading(true);
    setError(null);

    try {
      console.log(`📊 Fetching data from Airtable...`);
      console.log(`Base ID: ${baseId}`);
      console.log(`Table: ${tableName}`);

      const data = await getAllTableRecords(baseId, tableName);
      const fieldNames = extractFieldNames(data);

      console.log(`✅ Successfully fetched ${data.length} records`);
      console.log(`📋 Fields detected:`, fieldNames);

      setRecords(data);
      setFields(fieldNames);
      showSuccessToast(`Loaded ${data.length} records successfully!`);
    } catch (err) {
      console.error('❌ Error fetching Airtable data:', err);
      setError(err.message || 'Failed to fetch data');
      showErrorToast('Failed to fetch data from Airtable');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    return fields.some(field => {
      const value = record.fields[field];
      if (!value) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a.fields[sortField] || '';
    const bValue = b.fields[sortField] || '';
    
    const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true });
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        />
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading data from Airtable...</p>
      </div>
    );
  }

  if (error) {
    return (
      <InteractiveCard withTilt={false} className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchTableData}
            className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </InteractiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Database Viewer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {sortedRecords.length} record{sortedRecords.length !== 1 ? 's' : ''} • {fields.length} field{fields.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={fetchTableData}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search across all fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      </div>

      {/* Table */}
      <InteractiveCard withTilt={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {fields.map((field, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(field)}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-teal-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{field}</span>
                      {sortField === field && (
                        <span className="text-teal-500">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {sortedRecords.map((record, recordIndex) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: recordIndex * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {fields.map((field, fieldIndex) => (
                      <td
                        key={fieldIndex}
                        className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                      >
                        {formatFieldValue(record.fields[field])}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {sortedRecords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm ? 'No records match your search' : 'No records found'}
            </p>
          </div>
        )}
      </InteractiveCard>
    </div>
  );
}
