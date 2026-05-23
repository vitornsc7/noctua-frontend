import FAQItem from '../FAQItem';
import noctuaDoubt from '../../../assets/noctua-doubt.png';

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
        <section id="faq" className="relative z-10 bg-[#f6f7f9] px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pb-10">
            <div className="mx-auto grid w-full max-w-[1220px] gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:items-start lg:gap-16">
                <div className="order-2 grid min-w-0 gap-3 lg:order-1">
                    {perguntasFrequentes.map((item) => (
                        <FAQItem
                            key={item.pergunta}
                            pergunta={item.pergunta}
                            resposta={item.resposta}
                        />
                    ))}
                </div>

                <div className="order-1 flex min-w-0 flex-col items-start lg:sticky lg:top-24 lg:order-2">
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1f8fe5]">
                        Perguntas frequentes
                    </span>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl md:text-[2.75rem]">
                        Tire suas dúvidas sobre a Noctua
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-7 text-gray-500 sm:mt-5 sm:text-lg sm:leading-8">
                        Encontre respostas rápidas sobre o funcionamento da Noctua, seus indicadores e o uso da plataforma no dia a dia pedagógico.
                    </p>

                    <img
                        src={noctuaDoubt}
                        alt="Noctua com dúvida"
                        className="mt-5 hidden w-full max-w-[340px] self-center object-contain md:block lg:max-w-[420px] lg:self-end xl:max-w-[520px] xl:translate-x-[calc((100vw-1220px)/2+2.5rem)]"
                    />
                </div>
            </div>
        </section>
    );
}
