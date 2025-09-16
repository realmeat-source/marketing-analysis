
import React, { useState, useEffect, useRef } from 'react';

interface JsonInputSectionProps {
  jsonInput: string;
  setJsonInput: (value: string) => void;
  handleUpdate: () => boolean;
  error: string | null;
  reportPeriod: string;
  sellerName: string;
}

const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
        <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);


export const JsonInputSection: React.FC<JsonInputSectionProps> = ({ jsonInput, setJsonInput, handleUpdate, error, reportPeriod, sellerName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const dragCounter = useRef(0);

    const handleSubmit = () => {
        if (handleUpdate()) {
            setIsModalOpen(false);
        }
    };

    const handleExport = () => {
        const sanitizedPeriod = reportPeriod
            .replace(/ /g, '')
            .replace(/,/g, '')
            .replace(/–/g, '-');
        const filename = `dashboard-data-${sellerName}-${sanitizedPeriod}.json`;
        const filenameTxt = `dashboard-data-${sellerName}-${sanitizedPeriod}.txt`;

        try {
            const currentData = JSON.parse(jsonInput);
            const dataToExport = {
                metadata: {
                    seller: sellerName,
                    reportPeriod: reportPeriod,
                },
                data: Array.isArray(currentData.data) ? currentData.data : currentData,
            };

            const prettyJson = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([prettyJson], { type: 'application/json;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e) {
            const textContent = `// --- METADATA ---\n// Seller: ${sellerName}\n// Report Period: ${reportPeriod}\n\n// --- INVALID JSON DATA ---\n${jsonInput}`;
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filenameTxt);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.error("Exporting as plain text because the content is not valid JSON.", e);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
            }
        };
        if (isModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDraggingOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDraggingOver(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        dragCounter.current = 0;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    const content = readerEvent.target?.result;
                    if (typeof content === 'string') {
                        setJsonInput(content);
                    }
                };
                reader.readAsText(file);
            } else {
                console.warn("Invalid file type dropped. Please drop a .json file.");
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                aria-label="Update raw data"
                title="Update raw data"
            >
                <DatabaseIcon />
            </button>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 flex justify-center items-start pt-16 sm:pt-24 p-4" 
                    onClick={() => setIsModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div 
                        className="relative bg-white shadow-xl rounded-xl w-full max-w-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {isDraggingOver && (
                            <div 
                                className="absolute inset-0 bg-orange-50 bg-opacity-90 border-4 border-dashed border-orange-400 rounded-xl flex justify-center items-center z-20 pointer-events-none"
                            >
                                <p className="text-orange-600 font-bold text-xl">Drop JSON file here to update</p>
                            </div>
                        )}

                        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                <DatabaseIcon />
                                Raw Data
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-500 hover:bg-slate-200" aria-label="Close modal">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="p-4 sm:p-5">
                            <p className="mb-2 text-slate-500 text-sm">Drag and drop your JSON file here, or paste the content below.</p>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder="Paste your JSON data here..."
                                className="w-full h-64 p-3 bg-white border text-slate-800 placeholder:text-slate-400 border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none transition-shadow font-mono text-xs"
                                spellCheck="false"
                                aria-label="JSON data input"
                            />
                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                                >
                                    Update Dashboard
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors flex items-center"
                                >
                                    <ExportIcon />
                                    Export
                                </button>
                                 <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-700 rounded-md hover:bg-slate-100 transition-colors ml-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                             {error && <p className="text-red-600 mt-2 font-semibold text-sm">{error}</p>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
