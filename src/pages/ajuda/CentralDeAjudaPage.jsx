import FAQItem from '../../components/UI/FAQItem';

const MoreActionsIcon = () => (
    <span className="mx-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white align-middle text-slate-600">
        <i className="pi pi-ellipsis-h text-xs" aria-hidden="true" />
    </span>
);

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
                    pergunta="Como cadastro uma turma?"
                    resposta="Acesse a área de turmas e selecione a opção de cadastrar nova turma. Informe os dados obrigatórios, como nome, periodicidade, ano letivo, turno, aulas previstas por período, média mínima, disciplina e instituição."
                />

                <FAQItem
                    pergunta="Quais periodicidades posso usar?"
                    resposta="A Noctua permite organizar turmas em períodos bimestrais ou trimestrais."
                />

                <FAQItem
                    pergunta="Posso copiar uma turma já existente?"
                    resposta="Sim. Ao acessar uma turma, você pode criar uma nova turma a partir dela, reaproveitando informações e ajustando apenas o que for necessário."
                />

                <FAQItem
                    pergunta="Como cadastro alunos?"
                    resposta="Dentro da turma, acesse a área de alunos e adicione os estudantes informando o nome e uma observação opcional. Também é possível adicionar alunos na segunda etapa de cadastro de turma."
                />

                <FAQItem
                    pergunta="Posso editar ou remover alunos?"
                    resposta="Sim. Você pode editar informações dos alunos ou removê-los acessando a aba de alunos, dentro de uma turma aberta."
                />

                <FAQItem
                    pergunta="Como funciona a importação com IA?"
                    resposta="Na área de alunos, você pode importar uma lista usando imagem ou PDF de até 20MB. A IA ajuda a identificar os nomes e reduzir o trabalho manual de digitação."
                />

                <FAQItem
                    pergunta="Quais arquivos posso usar na importação com IA?"
                    resposta="A importação aceita imagens e arquivos PDF, respeitando o limite de tamanho definido pela plataforma (20MB)."
                />
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase text-gray-700">
                    Avaliações e notas
                </h2>

                <FAQItem
                    pergunta="Como cadastro uma avaliação?"
                    resposta="Acesse a turma, entre na aba de avaliações e selecione a opção de nova avaliação. Informe tipo, tema, peso, data de aplicação, período e os alunos participantes."
                />

                <FAQItem
                    pergunta="Por que preciso selecionar os alunos da avaliação?"
                    resposta="Porque nem toda avaliação precisa envolver todos os alunos da turma. A seleção permite registrar avaliações específicas para determinados estudantes."
                />

                <FAQItem
                    pergunta="Como lanço notas?"
                    resposta={(
                        <>
                            Abra a avaliação cadastrada e acesse a opção de lançamento de notas, através do ícone
                            <MoreActionsIcon />
                            . Informe a nota de cada aluno ou marque que ele não compareceu/não realizou.
                        </>
                    )}
                />

                <FAQItem
                    pergunta="Posso lançar notas com vírgula?"
                    resposta="Sim. A plataforma aceita notas com vírgula ou ponto, desde que estejam dentro do intervalo permitido."
                />

                <FAQItem
                    pergunta="O que significa “Não compareceu” em uma avaliação?"
                    resposta="Essa marcação indica que o aluno não participou da avaliação, permitindo cadastrá-lo numa nova chamada."
                />

                <FAQItem
                    pergunta="Como abro uma nova chamada de uma avaliação?"
                    resposta={(
                        <>
                            A partir do momento que algum aluno não realizar uma avaliação, a opção de abrir 2ª chamada ficará disponível através do ícone
                            <MoreActionsIcon />
                            .
                        </>
                    )}
                />

                <FAQItem
                    pergunta="Por que não consigo remover alguns alunos de uma avaliação?"
                    resposta="Quando um aluno já possui nota lançada ou foi marcado como não compareceu, ele não pode ser removido daquela avaliação para preservar o histórico do registro."
                />
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase text-gray-700">
                    Faltas, médias e frequência
                </h2>

                <FAQItem
                    pergunta="Como registro faltas?"
                    resposta="Acesse a turma, entre na aba de faltas e selecione a opção de nova falta. Informe a data, o bimestre/trimestre, a quantidade de períodos faltados e selecione os alunos."
                />

                <FAQItem
                    pergunta="Posso registrar falta em data futura?"
                    resposta="Não. A Noctua não permite registrar faltas para datas futuras."
                />

                <FAQItem
                    pergunta="O que são “períodos faltados”?"
                    resposta="São as aulas ou períodos que o aluno perdeu em uma determinada data."
                />

                <FAQItem
                    pergunta="Como a média do aluno é calculada?"
                    resposta="A média é calculada com base nas avaliações e notas registradas no sistema, considerando as regras aplicadas à turma e às avaliações."
                />

                <FAQItem
                    pergunta="Como a frequência é calculada?"
                    resposta="A frequência considera a relação entre as aulas frequentadas e o total de aulas previstas."
                />

                <FAQItem
                    pergunta="Qual frequência é considerada adequada?"
                    resposta="A referência usada pela plataforma é frequência mínima de 75%."
                />
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase text-gray-700">
                    Conta, segurança e suporte
                </h2>

                <FAQItem
                    pergunta="Como altero meus dados cadastrais?"
                    resposta="Acesse a aba de configurações, em seguida, acesse o card de dados cadastrais, na opção de alterar dados."
                />

                <FAQItem
                    pergunta="Como ativo a autenticação em dois fatores?"
                    resposta="Acesse a aba de configurações, em seguida, acesse o card de segurança e siga as instruções para configurar o aplicativo autenticador com QR Code ou código manual."
                />

                <FAQItem
                    pergunta="O que faço se o código do 2FA não funcionar?"
                    resposta="Verifique se o relógio do celular está sincronizado automaticamente e use o código mais recente exibido no aplicativo autenticador."
                />

                <FAQItem
                    pergunta="Como entro em contato com o suporte?"
                    resposta="Você pode entrar em contato pelo e-mail contato.noctua.br@gmail.com."
                />
            </section>
        </div>
    );
}
