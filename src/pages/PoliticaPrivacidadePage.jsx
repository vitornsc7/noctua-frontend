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

            <section className="space-y-2 text-justify">
                <Section title="Sobre esta Política de Privacidade">
                    <p>
                        A presente Política de Privacidade descreve como o sistema Noctua realiza o tratamento de dados pessoais no contexto da utilização da plataforma.
                    </p>
                    <p>
                        O tratamento de dados pessoais ocorre em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) e demais normas aplicáveis à proteção de dados pessoais.
                    </p>
                </Section>

                <Section title="Quais dados coletamos e para qual finalidade">
                    <p>O Noctua poderá realizar o tratamento dos seguintes dados pessoais:</p>

                    <p className="font-semibold text-gray-700">Dados de identificação</p>
                    <BulletList
                        items={[
                            'nome;',
                            'endereço de e-mail;',
                            'informações de autenticação.',
                        ]}
                    />

                    <p className="font-semibold text-gray-700">Dados acadêmicos</p>
                    <BulletList
                        items={[
                            'turmas;',
                            'registros de frequência;',
                            'notas;',
                            'avaliações;',
                            'informações relacionadas ao desempenho acadêmico.',
                        ]}
                    />

                    <p className="font-semibold text-gray-700">Dados enviados pelo usuário</p>
                    <BulletList
                        items={[
                            'imagens contendo listas de alunos;',
                            'documentos acadêmicos;',
                            'registros escolares enviados para processamento automatizado.',
                        ]}
                    />

                    <p>Os dados poderão ser utilizados para:</p>
                    <BulletList
                        items={[
                            'autenticação de usuários;',
                            'gerenciamento acadêmico;',
                            'organização pedagógica;',
                            'geração de relatórios;',
                            'importação automatizada de dados;',
                            'funcionamento e segurança da plataforma.',
                        ]}
                    />
                </Section>

                <Section title="Como os dados são coletados">
                    <p>Os dados poderão ser coletados:</p>
                    <BulletList
                        items={[
                            'mediante cadastro realizado pelo usuário;',
                            'por inserção manual de informações acadêmicas;',
                            'pelo envio de imagens e documentos;',
                            'durante a utilização das funcionalidades da plataforma;',
                            'por registros técnicos necessários ao funcionamento e segurança do sistema.',
                        ]}
                    />
                </Section>

                <Section title="Uso de inteligência artificial">
                    <p>
                        O Noctua utiliza recursos de inteligência artificial fornecidos por serviços da Google, por meio da Gemini API, para auxiliar funcionalidades de importação automatizada de dados acadêmicos.
                    </p>
                    <p>O processamento poderá envolver:</p>
                    <BulletList
                        items={[
                            'reconhecimento textual de imagens;',
                            'extração automatizada de informações;',
                            'organização preliminar de dados acadêmicos.',
                        ]}
                    />
                    <p>
                        As funcionalidades de inteligência artificial possuem caráter exclusivamente assistivo e não substituem a validação humana das informações processadas.
                    </p>
                    <p>O usuário reconhece que:</p>
                    <BulletList
                        items={[
                            'os resultados gerados podem conter inconsistências;',
                            'o processamento poderá ocorrer por serviço tecnológico de terceiros;',
                            'os dados extraídos devem ser revisados antes da confirmação final no sistema.',
                        ]}
                    />
                    <p>
                        O Noctua não realiza decisões pedagógicas automatizadas sem supervisão humana.
                    </p>
                </Section>

                <Section title="Compartilhamento de dados">
                    <p>Os dados pessoais poderão ser compartilhados:</p>
                    <BulletList
                        items={[
                            'com serviços tecnológicos necessários ao funcionamento da plataforma;',
                            'com provedores de serviços de inteligência artificial;',
                            'para cumprimento de obrigação legal ou regulatória;',
                            'mediante determinação judicial ou requisição de autoridade competente.',
                        ]}
                    />
                    <p>O Noctua não comercializa dados pessoais dos usuários.</p>
                </Section>

                <Section title="Direitos do titular dos dados">
                    <p>Nos termos da LGPD, o titular dos dados poderá solicitar:</p>
                    <BulletList
                        items={[
                            'confirmação da existência de tratamento;',
                            'acesso aos dados pessoais;',
                            'correção de dados incompletos, inexatos ou desatualizados;',
                            'anonimização, bloqueio ou eliminação de dados;',
                            'portabilidade dos dados, quando aplicável;',
                            'revogação do consentimento, quando aplicável.',
                        ]}
                    />
                </Section>

                <Section title="Como exercer seus direitos">
                    <p>
                        O titular dos dados poderá exercer seus direitos mediante solicitação pelos canais oficiais disponibilizados pela plataforma.
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

                <Section title="Retenção e armazenamento dos dados">
                    <p>Os dados pessoais poderão ser armazenados:</p>
                    <BulletList
                        items={[
                            'enquanto a conta permanecer ativa;',
                            'pelo período necessário ao cumprimento das finalidades da plataforma;',
                            'para atendimento de obrigações legais ou regulatórias;',
                            'para o exercício regular de direitos em processos administrativos, judiciais ou arbitrais.',
                        ]}
                    />
                    <p>
                        A retenção dos dados observará o disposto na Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018), especialmente o art. 16, que autoriza a conservação de dados pessoais em determinadas hipóteses legais.
                    </p>
                </Section>

                <Section title="Segurança das informações">
                    <p>
                        O Noctua adota medidas técnicas e administrativas destinadas à proteção dos dados pessoais contra acessos não autorizados, perda, destruição, alteração ou qualquer forma de tratamento inadequado ou ilícito.
                    </p>
                    <p>
                        O acesso às informações será restrito aos usuários autorizados e aos serviços estritamente necessários ao funcionamento da plataforma.
                    </p>
                </Section>

                <Section title="Responsabilidade do usuário">
                    <p>O usuário é responsável:</p>
                    <BulletList
                        items={[
                            'pela veracidade das informações inseridas na plataforma;',
                            'pela legitimidade do tratamento dos dados cadastrados;',
                            'pela conferência das informações processadas por inteligência artificial;',
                            'pela utilização adequada da plataforma em conformidade com a legislação aplicável.',
                        ]}
                    />
                </Section>

                <Section title="Alterações desta Política de Privacidade">
                    <p>
                        A presente Política de Privacidade poderá ser atualizada para adequações técnicas, operacionais ou legais.
                    </p>
                    <p>
                        Recomenda-se ao usuário a consulta periódica deste documento para ciência das eventuais atualizações.
                    </p>
                </Section>

                <Section title="Contato">
                    <p>
                        Em caso de dúvidas relacionadas a esta Política de Privacidade ou ao tratamento de dados pessoais realizado pelo Noctua, o usuário poderá entrar em contato por meio do seguinte endereço eletrônico:
                    </p>
                    <p>
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
