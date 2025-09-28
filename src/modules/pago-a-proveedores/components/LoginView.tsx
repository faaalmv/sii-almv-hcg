import React, { useState } from 'react';
import { Usuario } from '../types';

const BackgroundTitle: React.FC<{ isExiting: boolean }> = ({ isExiting }) => (
    <div 
        aria-hidden="true"
        className={`fixed inset-0 flex items-center justify-center -z-10 transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}
    >
        <h1 className="font-oswald text-[14vw] md:text-[16vw] font-bold text-center leading-none text-gray-900/5 select-none animate-bg-title-fade-in tracking-widest uppercase">
            Sistema de Pagos
        </h1>
    </div>
);

export const LoginView: React.FC<{ users: Usuario[]; onLogin: (user: Usuario) => void; }> = ({ users, onLogin }) => {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [isExiting, setIsExiting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.id === selectedUserId);
        if (user) {
            setIsExiting(true);
            setTimeout(() => onLogin(user), 700); // Match animation duration
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <style>{`
                @keyframes bg-title-fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; }
                }
                .animate-bg-title-fade-in {
                    animation: bg-title-fade-in 1.2s 0.3s ease-out forwards;
                    opacity: 0;
                }

                @keyframes card-land {
                    from { opacity: 0; transform: translateY(-40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-card-land {
                    animation: card-land 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
                }
                
                @keyframes card-content-cascade {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-card-content-cascade {
                    animation: card-content-cascade 0.5s ease-out forwards;
                    opacity: 0;
                }

                @keyframes card-exit {
                    to { opacity: 0; transform: scale(0.9); }
                }
                .animate-card-exit {
                    animation: card-exit 0.6s ease-in-out forwards;
                }

                /* Button fill animation */
                .submit-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #1e40af; /* bg-blue-800 */
                    z-index: 0;
                    transform: translateX(-100%);
                    transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
                }
                .submit-button.is-active::before {
                    transform: translateX(0);
                }
                .submit-button span {
                    position: relative;
                    z-index: 1;
                }
            `}</style>
            
            <BackgroundTitle isExiting={isExiting} />

            <div
                className={`w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 transition-all duration-500 ${isExiting ? 'animate-card-exit' : 'animate-card-land'}`}
                style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}
            >
                <div className="flex flex-col items-center">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsDCYV4cInnaFskCwesXruM53sVCwlZJVTcA&s"
                        alt="Logo"
                        className="w-24 h-24 mb-6 animate-card-content-cascade"
                        style={{ animationDelay: '0ms' }}
                    />
                    <h2 
                        className="text-5xl font-bold text-gray-800 mb-10 animate-card-content-cascade tracking-tight"
                        style={{ animationDelay: '150ms' }}
                    >
                        Acceso
                    </h2>

                    <form onSubmit={handleSubmit} className="w-full space-y-10">
                        <div 
                            className="relative animate-card-content-cascade"
                            style={{ animationDelay: '300ms' }}
                        >
                            <label htmlFor="user-select" className="sr-only">Seleccionar Usuario</label>
                            <select
                                id="user-select"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="appearance-none block w-full px-6 py-5 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 text-lg
                                           focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600
                                           hover:border-blue-400 hover:shadow-md
                                           transition-all duration-200 ease-out"
                            >
                                <option value="" disabled>Selecciona tu perfil...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.nombre}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedUserId}
                            className={`submit-button w-full flex justify-center py-5 px-5 border border-transparent rounded-lg shadow-sm text-lg font-medium 
                                       text-white bg-gray-300 disabled:text-gray-500
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 
                                       active:transform active:scale-97 transition-all duration-300 relative overflow-hidden
                                       animate-card-content-cascade
                                       ${selectedUserId ? 'is-active text-white' : ''}
                                       ${selectedUserId ? 'shadow-blue-500/50 hover:shadow-lg hover:-translate-y-0.5' : 'cursor-not-allowed'}`
                                    }
                            style={{ 
                                animationDelay: '450ms',
                                boxShadow: selectedUserId ? '0 4px 14px 0 rgba(59, 130, 246, 0.39)' : ''
                            }}
                        >
                            <span>Ingresar</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
