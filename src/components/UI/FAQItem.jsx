import { useState } from 'react';

const FAQItem = ({ pergunta, resposta }) => {
    const [aberto, setAberto] = useState(false);

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <button
                type="button"
                onClick={() => setAberto((valorAtual) => !valorAtual)}
                className="flex w-full items-center justify-between px-5 py-3 text-left text-sm text-slate-700"
                aria-expanded={aberto}
            >
                <span>{pergunta}</span>

                <i
                    className={`pi ${aberto ? 'pi-chevron-up' : 'pi-chevron-down'
                        } text-xs`}
                    aria-hidden="true"
                />
            </button>

            {aberto && (
                <div className="border-t border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
                    {resposta}
                </div>
            )}
        </div>
    );
};

export default FAQItem;