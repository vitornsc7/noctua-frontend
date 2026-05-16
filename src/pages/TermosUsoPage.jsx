import React from 'react';
import FAQItem from '../components/UI/FAQItem';

const Section = ({ title, children }) => (
    <FAQItem
        pergunta={title}
        resposta={
        <div className="space-y-3 leading-relaxed">
            {children}
        </div>
        }
    />
);

const BulletList = ({ items }) => (
    <ul className="ml-6 list-disc space-y-2">
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ul>
);

const NumberList = ({ items }) => (
    <ol className="ml-6 list-decimal space-y-2">
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ol>
);

export default function TermosUsoPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-3xl font-semibold text-gray-700">
                    Termos de Uso
                </h1>

                <p className="text-gray-600">
                    Consulte as condições gerais para utilização da plataforma Noctua.
                </p>
            </div>

            <section className="space-y-2 text-justify">
                <Section title="Apresentação">
                    <p>
                        O Noctua é um sistema web de apoio pedagógico desenvolvido com o objetivo de auxiliar professores na organização, visualização e interpretação de dados acadêmicos relacionados ao desempenho de turmas e estudantes.
                    </p>
                    <p>
                        A plataforma permite o cadastro de turmas, alunos, avaliações, notas e frequência, além da utilização de recursos de inteligência artificial para apoio operacional e pedagógico.
                    </p>
                    <p>
                        O sistema possui caráter exclusivamente auxiliar e não substitui sistemas institucionais oficiais de gestão escolar, tampouco o julgamento técnico, pedagógico ou profissional do professor.
                    </p>
                </Section>

                <Section title="Aceitação dos termos">
                    <p>
                        Ao utilizar o sistema, o usuário declara estar ciente e de acordo com os presentes Termos de Uso e com a Política de Privacidade do Noctua.
                    </p>
                    <p>
                        O uso continuado da plataforma implica concordância com as regras e condições descritas neste documento.
                    </p>
                </Section>

                <Section title="Perfis de usuário">
                    <p>O sistema possui os seguintes perfis de acesso:</p>
                    <BulletList
                        items={[
                            'Professor: usuário responsável pelo gerenciamento pedagógico das informações acadêmicas cadastradas na plataforma.',
                            'Administrador: usuário responsável pela administração técnica da plataforma e gerenciamento do uso de recursos de inteligência artificial.',
                        ]}
                    />
                    <p>O usuário Professor poderá:</p>
                    <BulletList
                        items={[
                            'cadastrar turmas;',
                            'cadastrar alunos;',
                            'lançar notas;',
                            'registrar frequência;',
                            'gerar relatórios;',
                            'utilizar funcionalidades de inteligência artificial.',
                        ]}
                    />
                    <p>
                        O Administrador não possui permissão para alterar dados pedagógicos cadastrados pelo Professor.
                    </p>
                </Section>

                <Section title="Responsabilidade sobre os dados">
                    <p>
                        O usuário é integralmente responsável pelas informações inseridas no sistema, incluindo:
                    </p>
                    <BulletList
                        items={[
                            'dados acadêmicos;',
                            'nomes de estudantes;',
                            'registros de frequência;',
                            'avaliações;',
                            'imagens enviadas para processamento automatizado.',
                        ]}
                    />
                    <p>
                        O usuário declara possuir legitimidade e base legal para utilização e tratamento das informações inseridas na plataforma, responsabilizando-se pela conformidade do uso com a legislação aplicável.
                    </p>
                </Section>

                <Section title="Uso da inteligência artificial">
                    <p>
                        O Noctua utiliza recursos de inteligência artificial fornecidos por serviços da Google, por meio da Gemini API, exclusivamente para auxiliar funcionalidades de importação automatizada de dados no sistema.
                    </p>
                    <p>A inteligência artificial poderá realizar:</p>
                    <BulletList
                        items={[
                            'reconhecimento textual de imagens;',
                            'extração automatizada de informações;',
                            'organização preliminar de dados acadêmicos.',
                        ]}
                    />
                    <p>
                        As funcionalidades de IA possuem caráter exclusivamente assistivo e não substituem a validação humana das informações processadas.
                    </p>
                    <p>O usuário reconhece que:</p>
                    <NumberList
                        items={[
                            'os resultados gerados podem conter inconsistências, imprecisões ou erros;',
                            'o processamento ocorre de forma automatizada por serviço tecnológico de terceiros;',
                            'os dados importados devem ser revisados e confirmados manualmente antes de sua utilização definitiva na plataforma.',
                        ]}
                    />
                    <p>
                        O Noctua não realiza decisões pedagógicas automatizadas sem supervisão humana.
                    </p>
                    <p>
                        As informações, análises e funcionalidades disponibilizadas pela plataforma não substituem a autonomia pedagógica, a análise crítica ou o julgamento profissional do professor.
                    </p>
                </Section>

                <Section title="Importação de listas de alunos por imagem">
                    <p>
                        A plataforma poderá permitir o envio de imagens contendo listas de chamada, documentos acadêmicos ou registros escolares para extração automatizada de informações.
                    </p>
                    <p>Ao utilizar esta funcionalidade, o usuário declara:</p>
                    <BulletList
                        items={[
                            'possuir autorização para utilização dos dados contidos nas imagens;',
                            'compreender que o processamento poderá utilizar serviços externos de inteligência artificial;',
                            'responsabilizar-se pela conferência dos dados extraídos.',
                        ]}
                    />
                </Section>

                <Section title="Condutas proibidas">
                    <p>É proibido ao usuário:</p>
                    <BulletList
                        items={[
                            'utilizar a plataforma para finalidades ilícitas ou não autorizadas;',
                            'inserir informações falsas, inexatas ou enganosas;',
                            'tentar acessar áreas restritas, contas de terceiros ou funcionalidades não autorizadas;',
                            'realizar ações que comprometam a estabilidade, disponibilidade ou segurança da plataforma;',
                            'utilizar, compartilhar ou tratar dados acadêmicos sem autorização ou base legal adequada;',
                            'utilizar mecanismos automatizados para explorar vulnerabilidades ou contornar medidas de segurança do sistema.',
                        ]}
                    />
                </Section>

                <Section title="Disponibilidade do sistema">
                    <p>
                        O Noctua poderá passar por atualizações, manutenções ou interrupções temporárias necessárias ao funcionamento da plataforma.
                    </p>
                    <p>O sistema não garante disponibilidade ininterrupta dos serviços.</p>
                </Section>

                <Section title="Limitação de responsabilidade">
                    <p>
                        O Noctua atua como ferramenta de apoio pedagógico e operacional, não sendo responsável por decisões tomadas exclusivamente com base nas informações disponibilizadas pela plataforma.
                    </p>
                    <p>
                        O sistema não garante ausência absoluta de falhas, indisponibilidades, inconsistências ou erros operacionais.
                    </p>
                </Section>

                <Section title="Propriedade intelectual">
                    <p>Todos os elementos relacionados ao sistema Noctua, incluindo:</p>
                    <BulletList
                        items={[
                            'código-fonte;',
                            'identidade visual;',
                            'logotipo;',
                            'interface;',
                            'documentação;',
                            'elementos gráficos;',
                        ]}
                    />
                    <p>
                        são protegidos pela legislação aplicável de propriedade intelectual.
                    </p>
                </Section>

                <Section title="Alterações nos termos">
                    <p>
                        Os presentes Termos poderão ser atualizados para adequações técnicas, legais ou operacionais.
                    </p>
                    <p>
                        Recomenda-se ao usuário a consulta periódica deste documento para ciência das eventuais atualizações.
                    </p>
                </Section>

                <Section title="Contato">
                    <p>
                        Em caso de dúvidas relacionadas a estes Termos de Uso, o usuário poderá entrar em contato pelos canais oficiais disponibilizados pela plataforma.
                    </p>
                    <p>
                        E-mail para contato:{' '}
                        <a
                            href="mailto:contato.noctua.br@gmail.com"
                            className="font-medium text-gray-700 underline transition-colors hover:text-gray-900"
                        >
                            contato.noctua.br@gmail.com
                        </a>
                        .
                    </p>
                </Section>
            </section>
        </div>
    );
}
