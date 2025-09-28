
import React, { useState } from 'react';
import { type ComplianceLog, type ComplianceStatus } from '../types';
import { ComplianceLogItem } from './ComplianceLogItem';
import { COMPLIANCE_DATA } from '../constants';

const ComplianceTracker: React.FC = () => {
    const [logs, setLogs] = useState<ComplianceLog[]>(COMPLIANCE_DATA);

    const handleUpdateLog = (logId: string, value: number, action?: string) => {
        setLogs(prevLogs => prevLogs.map(log => {
            if (log.id === logId) {
                return { 
                    ...log, 
                    currentValue: value, 
                    status: action ? ComplianceStatus.ActionTaken : ComplianceStatus.InRange, // Simplified logic
                    actionTaken: action 
                };
            }
            return log;
        }));
    };

    const completedLogs = logs.filter(log => log.currentValue !== null);
    const pendingLogs = logs.filter(log => log.currentValue === null);

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tracker de Cumplimiento (NOM-251)</h1>
            
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Registros Pendientes</h2>
                <div className="space-y-4">
                    {pendingLogs.length > 0 ? (
                        pendingLogs.map(log => (
                            <ComplianceLogItem key={log.id} log={log} onUpdate={handleUpdateLog} />
                        ))
                    ) : (
                        <p className="text-gray-500">No hay registros pendientes.</p>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-green-700 mb-4">Registros Completados Hoy</h2>
                <div className="space-y-3">
                    {completedLogs.length > 0 ? (
                        completedLogs.map(log => (
                            <div key={log.id} className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-green-800">{log.item}</p>
                                        <p className="text-sm text-green-700">Registrado: <span className="font-bold">{log.currentValue}{log.unit}</span></p>
                                    </div>
                                    {log.actionTaken && (
                                        <p className="text-sm text-orange-600 font-semibold bg-orange-100 px-3 py-1 rounded-full">Acción: {log.actionTaken}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay registros completados hoy.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplianceTracker;
