import { useState } from 'react';

const FAQItem = ({ pergunta, resposta }) => {
    const [aberto, setAberto] = useState(false);

    return (
        <div
            className={`overflow-hidden rounded-xl border transition-colors ${aberto
                ? 'border-[#1f8fe5]/35 bg-white shadow-sm'
                : 'border-slate-200 bg-slate-50'
                }`}
        >
            <button
                type="button"
                onClick={() => setAberto((valorAtual) => !valorAtual)}
                className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left text-sm transition-colors ${aberto
                    ? 'text-gray-900'
                    : 'text-slate-700 hover:text-gray-900'
                    }`}
                aria-expanded={aberto}
            >
                <span className="font-semibold">{pergunta}</span>

                <i
                    className={`pi ${aberto ? 'pi-chevron-up' : 'pi-chevron-down'
                        } text-xs ${aberto ? 'text-[#1f8fe5]' : 'text-slate-700'}`}
                    aria-hidden="true"
                />
            </button>

            {aberto && (
                <div className="border-t border-[#1f8fe5]/15 bg-white px-5 py-4 text-sm leading-6 text-slate-600">
                    {resposta}
                </div>
            )}
        </div>
    );
};

export default FAQItem;
