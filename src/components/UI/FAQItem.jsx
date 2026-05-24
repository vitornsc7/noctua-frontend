import { useState } from 'react';

const FAQItem = ({ pergunta, resposta }) => {
    const [aberto, setAberto] = useState(false);

    return (
        <div
            className={`overflow-hidden rounded-xl border transition-colors ${aberto
                ? 'bg-slate-50'
                : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
        >
            <button
                type="button"
                onClick={() => setAberto((valorAtual) => !valorAtual)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors sm:gap-4 sm:px-5 ${aberto
                    ? 'text-gray-900'
                    : 'text-slate-700 hover:text-gray-900'
                    }`}
                aria-expanded={aberto}
            >
                <span className="min-w-0">{pergunta}</span>

                <i
                    className={`pi ${aberto ? 'pi-chevron-up' : 'pi-chevron-down'
                        } shrink-0 text-xs ${aberto ? 'text-secondary' : 'text-slate-700'}`}
                    aria-hidden="true"
                />
            </button>

            {aberto && (
                <div className="border-t border-secondary/15 bg-white px-4 py-4 text-sm leading-6 text-slate-600 sm:px-5">
                    {resposta}
                </div>
            )}
        </div>
    );
};

export default FAQItem;
