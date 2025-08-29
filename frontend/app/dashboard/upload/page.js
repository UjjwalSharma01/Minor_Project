'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  CloudUpload,
  FileType,
  Calendar,
  HardDrive
} from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'
import { LoadingSpinner } from '@/components/loading-states'
import { AnimatedButton, ProgressButton } from '@/components/micro-interactions'

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (fileList) => {
    const validFiles = []
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = ['.log', '.txt', '.csv', '.json']

    Array.from(fileList).forEach((file) => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!allowedTypes.includes(fileExtension)) {
        alert(`Invalid file type: ${file.name}. Please upload .log, .txt, .csv, or .json files.`)
        return
      }
      
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum size is 50MB.`)
        return
      }

      const fileInfo = {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: fileExtension,
        status: 'ready', // ready, uploading, success, error
        uploadedAt: null,
        preview: null
      }

      // Generate preview for small text files
      if (file.size < 1024 * 1024 && (fileExtension === '.log' || fileExtension === '.txt')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target.result.substring(0, 500)
          setFiles(prev => prev.map(f => 
            f.id === fileInfo.id ? { ...f, preview } : f
          ))
        }
        reader.readAsText(file)
      }

      validFiles.push(fileInfo)
    })

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const uploadFiles = async () => {
    setUploading(true)
    setUploadProgress(0)

    // Simulate upload process
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading' } : f
      ))

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: 'success', 
          uploadedAt: new Date().toISOString() 
        } : f
      ))

      setUploadProgress(((i + 1) / files.length) * 100)
    }

    setUploading(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    switch (type) {
      case '.log':
        return FileText
      case '.txt':
        return FileText
      case '.csv':
        return FileType
      case '.json':
        return FileType
      default:
        return FileText
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Upload DNS Logs
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Upload your DNS log files for analysis. Supported formats: .log, .txt, .csv, .json
              </p>
            </motion.div>

            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8"
            >
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-slate-500 bg-slate-50 dark:bg-slate-800/50'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <CloudUpload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Drop your DNS log files here
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  or click to browse and select files
                </p>
                
                <input
                  type="file"
                  multiple
                  accept=".log,.txt,.csv,.json"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block"
                >
                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    className="cursor-pointer flex items-center"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Select Files
                  </AnimatedButton>
                </label>
                
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Maximum file size: 50MB • Supported formats: .log, .txt, .csv, .json
                </div>
              </div>
            </motion.div>

            {/* File List */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Selected Files ({files.length})
                    </h2>
                    {files.length > 0 && !uploading && (
                      <AnimatedButton
                        onClick={uploadFiles}
                        disabled={files.every(f => f.status === 'success')}
                        variant="primary"
                        className="flex items-center"
                      >
                        <CloudUpload className="h-4 w-4 mr-2" />
                        Upload All
                      </AnimatedButton>
                    )}
                    {uploading && (
                      <ProgressButton
                        progress={uploadProgress}
                        isActive={uploading}
                        className="bg-blue-500 text-white flex items-center"
                      >
                        <LoadingSpinner size="sm" text="" />
                        <span className="ml-2">Uploading... {Math.round(uploadProgress)}%</span>
                      </ProgressButton>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Upload Progress
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-slate-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {files.map((fileInfo, index) => {
                      const FileIcon = getFileIcon(fileInfo.type)
                      return (
                        <motion.div
                          key={fileInfo.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                              <FileIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {fileInfo.name}
                              </p>
                              {fileInfo.status === 'success' && (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                              {fileInfo.status === 'error' && (
                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              )}
                              {fileInfo.status === 'uploading' && (
                                <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(fileInfo.size)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {fileInfo.type.toUpperCase().substring(1)}
                              </span>
                              {fileInfo.uploadedAt && (
                                <span className="text-xs text-green-600 dark:text-green-400">
                                  Uploaded {new Date(fileInfo.uploadedAt).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {fileInfo.preview && (
                              <button
                                title="Preview"
                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeFile(fileInfo.id)}
                              title="Remove"
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Stats */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="glass rounded-xl p-6 text-center">
                  <HardDrive className="h-8 w-8 text-slate-600 dark:text-slate-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Size
                  </div>
                </div>
                
                <div className="glass rounded-xl p-6 text-center">
                  <FileText className="h-8 w-8 text-slate-600 dark:text-slate-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {files.filter(f => f.status === 'success').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Uploaded
                  </div>
                </div>
                
                <div className="glass rounded-xl p-6 text-center">
                  <Calendar className="h-8 w-8 text-slate-600 dark:text-slate-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {files.filter(f => f.status === 'ready').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Pending
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
