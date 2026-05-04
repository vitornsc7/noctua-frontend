import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Select, Pageable, useToast } from '../../../components/UI';
import { listarTurmas, buscarFiltrosTurmas } from '../../../api/turmaApi';

const PAGE_SIZE = 10;

const TURNO_DISPLAY = {
    MATUTINO: 'Matutino',
    VESPERTINO: 'Vespertino',
    NOTURNO: 'Noturno',
    INTEGRAL: 'Integral',
};

const getAnoLetivo = (anoLetivo) => {
    if (Array.isArray(anoLetivo)) return String(anoLetivo[0]);
    if (typeof anoLetivo === 'string') return anoLetivo.substring(0, 4);
    return String(anoLetivo);
};

const TurmasPage = () => {
    const { showError } = useToast();
    const [turmas, setTurmas] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const [anosDisponiveis, setAnosDisponiveis] = useState([]);
    const [instituicoesDisponiveis, setInstituicoesDisponiveis] = useState([]);

    const [turnoSelecionado, setTurnoSelecionado] = useState('todos');
    const [anoSelecionado, setAnoSelecionado] = useState('todos');
    const [instituicaoSelecionada, setInstituicaoSelecionada] = useState('todos');

    useEffect(() => {
        buscarFiltrosTurmas()
            .then((data) => {
                const anos = data.anos ?? [];
                setAnosDisponiveis(anos);
                setInstituicoesDisponiveis(data.instituicoes ?? []);
                if (anos.length > 0) {
                    const maisRecente = anos.reduce((a, b) => (Number(a) > Number(b) ? a : b));
                    setAnoSelecionado(String(maisRecente));
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);

        listarTurmas({ page, size: PAGE_SIZE, turno: turnoSelecionado, anoLetivo: anoSelecionado, instituicao: instituicaoSelecionada })
            .then((data) => {
                setTurmas(data.content);
                setTotalElements(data.totalElements);
            })
            .catch((err) => showError('Erro ao carregar turmas', err.message))
            .finally(() => setLoading(false));
    }, [page, turnoSelecionado, anoSelecionado, instituicaoSelecionada]);

    const handleFilterChange = (setter) => (e) => {
        setPage(0);
        setter(e.target.value);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-700 mb-2">Turmas</h1>
                    <p className="text-gray-600">Gerencie suas turmas</p>
                </div>

                <Link
                    to="/turmas/cadastro"
                    className="pt-1 text-sm text-gray-600 underline underline-offset-4 hover:text-gray-700 transition"
                >
                    Nova turma
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:gap-2 gap-4">
                <Select
                    label="Filtrar por turno"
                    value={turnoSelecionado}
                    onChange={handleFilterChange(setTurnoSelecionado)}
                    leftIcon={<i className="pi pi-clock text-sm"></i>}
                    fullWidth
                >
                    <Select.Option value="todos">Todos os turnos</Select.Option>
                    <Select.Option value="MATUTINO">Matutino</Select.Option>
                    <Select.Option value="VESPERTINO">Vespertino</Select.Option>
                    <Select.Option value="NOTURNO">Noturno</Select.Option>
                    <Select.Option value="INTEGRAL">Integral</Select.Option>
                </Select>

                <Select
                    label="Filtrar por ano"
                    value={anoSelecionado}
                    onChange={handleFilterChange(setAnoSelecionado)}
                    leftIcon={<i className="pi pi-calendar text-sm"></i>}
                    fullWidth
                >
                    <Select.Option value="todos">Todos os anos</Select.Option>
                    {anosDisponiveis.map((ano) => (
                        <Select.Option key={ano} value={String(ano)}>{ano}</Select.Option>
                    ))}
                </Select>

                {instituicoesDisponiveis.length > 0 && (
                    <Select
                        label="Filtrar por instituição"
                        value={instituicaoSelecionada}
                        onChange={handleFilterChange(setInstituicaoSelecionada)}
                        leftIcon={<i className="pi pi-building text-sm"></i>}
                        fullWidth
                    >
                        <Select.Option value="todos">Todas as instituições</Select.Option>
                        {instituicoesDisponiveis.map((inst) => (
                            <Select.Option key={inst} value={inst}>{inst}</Select.Option>
                        ))}
                    </Select>
                )}
            </div>

            <div className="relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
                    </div>
                ) : (
                    <>
                        {turmas.length === 0 && (
                            <p className="text-sm text-gray-400 italic">Turmas não encontradas.</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {turmas.map((turma) => (
                                <Link key={turma.id} to={`/turmas/${turma.id}`} className="block">
                                    <Card className="hover:border-gray-300 transition-colors cursor-pointer">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-700">{turma.nome}</h3>
                                            <p className="text-gray-600 text-sm shrink-0 ml-2">
                                                <i className="pi pi-users text-xs mr-2"></i>
                                                {turma.alunosCount ?? 0} alunos
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {turma.disciplina && (
                                                <Tag maxChars={20}><i className="pi pi-book text-xs mr-2"></i>{turma.disciplina}</Tag>
                                            )}
                                            {turma.instituicao && (
                                                <Tag maxChars={20}><i className="pi pi-building text-xs mr-2"></i>{turma.instituicao}</Tag>
                                            )}
                                            <Tag><i className="pi pi-clock text-xs mr-2"></i>{TURNO_DISPLAY[turma.turno] ?? turma.turno}</Tag>
                                            <Tag><i className="pi pi-calendar text-xs mr-2"></i>{getAnoLetivo(turma.anoLetivo)}</Tag>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {totalElements > PAGE_SIZE && (
                <Pageable
                    page={page}
                    pageSize={PAGE_SIZE}
                    totalItems={totalElements}
                    currentItemsCount={turmas.length}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default TurmasPage;
