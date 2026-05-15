import React from 'react';
import { Link } from 'react-router-dom';
import FAQItem from '../components/UI/FAQItem';

export default function PoliticaPrivacidadePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-3xl font-semibold text-gray-700">
                    Política de Privacidade
                </h1>

                <p className="text-gray-600">
                    Saiba como a Noctua trata informações pessoais e dados educacionais na plataforma.
                </p>
            </div>

            <section className="space-y-3">
                <FAQItem
                    pergunta="Coleta de informações"
                    resposta="Coletamos informações necessárias para autenticação, gestão de turmas, acompanhamento acadêmico e operação segura da plataforma."
                />

                <FAQItem
                    pergunta="Uso dos dados"
                    resposta="Os dados são utilizados para oferecer recursos educacionais, gerar análises, registrar atividades acadêmicas e melhorar a experiência dos usuários."
                />

                <FAQItem
                    pergunta="Segurança"
                    resposta="Aplicamos medidas técnicas e organizacionais para proteger as informações contra acessos não autorizados, perdas ou usos indevidos."
                />

                <FAQItem
                    pergunta="Direitos do usuário"
                    resposta="Usuários podem solicitar informações sobre seus dados, correções ou exclusões conforme as regras aplicáveis e as necessidades operacionais da instituição."
                />
            </section>
        </div>
    );
}
