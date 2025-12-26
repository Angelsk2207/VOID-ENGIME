
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-12 border-b border-gray-900/30">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-xs uppercase tracking-[0.8em] text-gray-600 font-light inline-block relative">
          VOID ENGINE
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-px bg-red-900/30"></span>
        </h1>
        <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-gray-800">
          Pesquisa de Pavor Psicológico v3.0
        </p>
      </div>
    </header>
  );
};
