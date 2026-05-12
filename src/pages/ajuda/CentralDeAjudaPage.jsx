import FAQItem from '../../components/UI/FAQItem';

export default function CentralDeAjudaPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-3xl font-semibold text-gray-700">
                    Central de Ajuda
                </h1>

                <p className="text-gray-600">
                    Encontre respostas, orientações e suporte para utilizar a plataforma.
                </p>
            </div>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase text-gray-700">
                    Turmas e alunos
                </h2>

                <FAQItem
                    pergunta="Pergunta 1."
                    resposta="Resposta 1."
                />

                <FAQItem
                    pergunta="Pergunta 2."
                    resposta="Resposta 2."
                />

                <FAQItem
                    pergunta="Pergunta 3."
                    resposta="Resposta 3."
                />
            </section>
        </div>
    );
}