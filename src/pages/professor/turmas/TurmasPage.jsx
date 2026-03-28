import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Select } from '../../../components/UI';
import { listarTurmas } from '../../../api/turmaApi';

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
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [turnoSelecionado, setTurnoSelecionado] = useState('todos');
    const [anoSelecionado, setAnoSelecionado] = useState('todos');

    useEffect(() => {
        listarTurmas()
            .then(setTurmas)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const anosDisponiveis = [...new Set(turmas.map((t) => getAnoLetivo(t.anoLetivo)))].sort();

    const turmasFiltradas = turmas.filter((turma) => {
        const matchTurno = turnoSelecionado === 'todos' || turma.turno === turnoSelecionado;
        const matchAno = anoSelecionado === 'todos' || getAnoLetivo(turma.anoLetivo) === anoSelecionado;
        return matchTurno && matchAno;
    });

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
                    onChange={(e) => setTurnoSelecionado(e.target.value)}
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
                    onChange={(e) => setAnoSelecionado(e.target.value)}
                    leftIcon={<i className="pi pi-calendar text-sm"></i>}
                    fullWidth
                >
                    <Select.Option value="todos">Todos os anos</Select.Option>
                    {anosDisponiveis.map((ano) => (
                        <Select.Option key={ano} value={ano}>{ano}</Select.Option>
                    ))}
                </Select>
            </div>

            {loading && (
                <p className="text-sm text-gray-500">Carregando turmas...</p>
            )}

            {error && (
                <p className="text-sm text-red-500">Erro ao carregar turmas: {error}</p>
            )}

            {!loading && !error && turmasFiltradas.length === 0 && (
                <p className="text-sm text-gray-400 italic">Nenhuma turma encontrada.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {turmasFiltradas.map((turma) => (
                    <Card key={turma.id}>
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-700">{turma.nome}</h3>
                            <p className="text-gray-600 text-sm">
                                <i className="pi pi-users text-xs mr-2"></i>
                                {turma.alunosCount ?? 0} alunos
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {turma.disciplina && (
                                <Tag><i className="pi pi-book text-xs mr-2"></i>{turma.disciplina}</Tag>
                            )}
                            <Tag><i className="pi pi-clock text-xs mr-2"></i>{TURNO_DISPLAY[turma.turno] ?? turma.turno}</Tag>
                            <Tag><i className="pi pi-calendar text-xs mr-2"></i>{getAnoLetivo(turma.anoLetivo)}</Tag>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TurmasPage;
