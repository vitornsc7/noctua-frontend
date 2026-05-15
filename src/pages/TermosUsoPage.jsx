import React from 'react';
import { Link } from 'react-router-dom';
import FAQItem from '../components/UI/FAQItem';

export default function TermosUsoPage() {
    return (
        <div className="space-y-8">
            <div>
                <Link
                    to="/dashboard"
                    className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true" />
                    <span>Dashboard</span>
                </Link>

                <h1 className="mb-2 text-3xl font-semibold text-gray-700">
                    Termos de Uso
                </h1>

                <p className="text-gray-600">
                    Consulte as condições gerais para utilização da plataforma Noctua.
                </p>
            </div>

            <section className="space-y-3">
                <FAQItem
                    pergunta="Uso da plataforma"
                    resposta="A Noctua deve ser utilizada para fins educacionais, administrativos e de acompanhamento acadêmico, respeitando as permissões de cada perfil."
                />

                <FAQItem
                    pergunta="Responsabilidades"
                    resposta="Cada usuário é responsável pelas informações inseridas, pela confidencialidade de suas credenciais e pelo uso adequado dos recursos disponíveis."
                />

                <FAQItem
                    pergunta="Disponibilidade"
                    resposta="A plataforma pode passar por atualizações, manutenções ou ajustes para melhoria dos serviços, segurança e estabilidade."
                />

                <FAQItem
                    pergunta="Alterações dos termos"
                    resposta="Estes termos podem ser atualizados para refletir mudanças na plataforma, requisitos legais ou necessidades operacionais."
                />
            </section>
        </div>
    );
}
