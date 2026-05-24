import FAQItem from '../FAQItem';
import noctuaDoubt from '../../../assets/noctua-looking-right.svg';

const perguntasFrequentes = [
    {
        pergunta: 'O que é a Noctua?',
        resposta:
            'A Noctua é um sistema web de apoio pedagógico criado para ajudar professores a organizar dados de turmas, alunos, avaliações, notas e frequência em um só lugar.',
    },
    {
        pergunta: 'Para quem a Noctua foi desenvolvida?',
        resposta:
            'A Noctua foi pensada para professores que desejam acompanhar o desempenho de suas turmas de forma mais clara, especialmente quando utilizam planilhas, registros paralelos ou sistemas institucionais com pouca análise pedagógica.',
    },
    {
        pergunta: 'A Noctua substitui o sistema oficial da escola?',
        resposta:
            'Não. A Noctua é uma ferramenta complementar de apoio ao professor. Ela auxilia na organização e interpretação pedagógica dos dados, mas não substitui registros oficiais da instituição.',
    },
    {
        pergunta: 'A Noctua é gratuita?',
        resposta:
            'Sim. Atualmente, a Noctua está sendo disponibilizada gratuitamente em sua primeira versão pública.',
    },
    {
        pergunta: 'Por que a Noctua está gratuita neste momento?',
        resposta:
            'Neste momento, a plataforma é oferecida gratuitamente para ampliar o acesso de professores às funcionalidades da Noctua e permitir a evolução contínua do sistema a partir das necessidades observadas no contexto educacional. Futuramente, poderão ser adotados modelos de assinatura com valores acessíveis, especialmente considerando a realidade da educação pública.',
    },
    {
        pergunta: 'Preciso instalar algum programa para usar a Noctua?',
        resposta:
            'Não. A Noctua funciona diretamente pelo navegador, sem necessidade de instalação.',
    },
    {
        pergunta: 'Preciso estar vinculado a uma escola para usar?',
        resposta:
            'Não. O professor pode utilizar a plataforma de forma independente.',
    },
    {
        pergunta: 'Que dados posso organizar na Noctua?',
        resposta:
            'Você pode organizar informações de turmas, alunos, avaliações, notas e frequência.',
    },
    {
        pergunta: 'A inteligência artificial substitui o professor?',
        resposta:
            'Não. A IA atua apenas como apoio à interpretação dos dados e à organização de informações. As decisões pedagógicas continuam sendo responsabilidade do professor.',
    },
    {
        pergunta: 'Os indicadores da Noctua têm valor oficial?',
        resposta:
            'Não. Os indicadores possuem finalidade analítica e de apoio pedagógico, sem substituir critérios, registros ou avaliações oficiais da instituição de ensino.',
    },
    {
        pergunta: 'Posso personalizar os critérios dos indicadores pedagógicos?',
        resposta:
            'Sim. Parte dos intervalos e classificações utilizados pela Noctua pode ser ajustada pelo professor, permitindo adaptar os indicadores pedagógicos às necessidades da turma e da instituição. Critérios definidos por legislação educacional permanecem fixos.',
    },
];

export default function FaqLandingPage() {
    return (
        <section id="faq" className="bg-[#F6F6F8]">
            <div className="mx-auto max-w-6xl px-8 py-16">
                <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
                    <div className="lg:sticky lg:top-24 lg:w-72 lg:shrink-0">
                        <h2 className="text-2xl font-semibold text-gray-700">Perguntas frequentes</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Encontre respostas sobre o funcionamento da Noctua, seus indicadores e o uso da plataforma no dia a dia pedagógico.
                        </p>
                        <img
                            src={noctuaDoubt}
                            alt="Noctua com dúvida"
                            className="mt-6 hidden w-full max-w-[220px] object-contain lg:block"
                        />
                    </div>

                    <div className="grid min-w-0 flex-1 gap-3">
                        {perguntasFrequentes.map((item) => (
                            <FAQItem
                                key={item.pergunta}
                                pergunta={item.pergunta}
                                resposta={item.resposta}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
