import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Checkbox, Input, NumberInput, Select, Tag, useToast } from '../../../components/UI';
import { buscarTurmaPorId, criarAvaliacao } from '../../../api/turmaApi';
import { TURNO_DISPLAY, PERIODICIDADE_DISPLAY, PERIODO_LABEL, displayLabel } from '../../../utils/displayMaps';

const TIPOS = ['Prova', 'Trabalho', 'Atividade', 'Recuperação'];

const NovaAvaliacaoPage = () => {
    const { id: turmaId } = useParams();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    const [turma, setTurma] = useState(null);
    const [loadingTurma, setLoadingTurma] = useState(true);
    const [saving, setSaving] = useState(false);

    const [tipo, setTipo] = useState('Prova');
    const [peso, setPeso] = useState('1');
    const [tema, setTema] = useState('');
    const [data, setData] = useState('');
    const [periodo, setPeriodo] = useState('');

    const [busca, setBusca] = useState('');
    const [selecionados, setSelecionados] = useState([]);

    useEffect(() => {
        buscarTurmaPorId(turmaId)
            .then((t) => {
                setTurma(t);
                if (t.qtdePeriodos) setPeriodo('1');
            })
            .catch((err) => showError('Erro ao carregar turma', err.message))
            .finally(() => setLoadingTurma(false));
    }, [turmaId, showError]);

    const alunos = (turma?.alunos ?? [])
        .filter((a) => a.ativo)
        .sort((a, b) => a.nome.localeCompare(b.nome));

    const alunosFiltrados = busca.trim()
        ? alunos.filter((a) => a.nome.toLowerCase().includes(busca.trim().toLowerCase()))
        : alunos;

    const todosSelecionados = alunos.length > 0 && alunos.every((a) => selecionados.includes(a.id));

    const toggleAluno = (alunoId) => {
        setSelecionados((prev) =>
            prev.includes(alunoId) ? prev.filter((id) => id !== alunoId) : [...prev, alunoId]
        );
    };

    const toggleTodos = () => {
        if (todosSelecionados) {
            setSelecionados([]);
        } else {
            setSelecionados(alunos.map((a) => a.id));
        }
    };

    const qtdePeriodos = turma?.qtdePeriodos ?? 4;
    const periodoLabel = PERIODO_LABEL[qtdePeriodos] ?? 'Período';
    const periodoOptions = Array.from({ length: qtdePeriodos }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1}º ${periodoLabel}`,
    }));

    const handleSalvar = async () => {
        if (!tema.trim()) return showError('Campo obrigatório', 'Informe o tema da avaliação.');
        if (!data) return showError('Campo obrigatório', 'Informe a data de aplicação.');
        if (!periodo) return showError('Campo obrigatório', 'Selecione o bimestre/trimestre.');
        if (selecionados.length === 0) return showError('Nenhum aluno selecionado', 'Selecione pelo menos um aluno.');

        try {
            setSaving(true);
            await criarAvaliacao(turmaId, { tipo, peso, tema, data, periodo, alunosIds: selecionados });
            showSuccess('Avaliação criada com sucesso');
            navigate(`/turmas/${turmaId}`, { state: { tab: 'avaliacoes' } });
        } catch (err) {
            showError('Erro ao criar avaliação', err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loadingTurma) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to={`/turmas/${turmaId}`}
                    className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true" />
                    <span>Avaliações</span>
                </Link>
                <h1 className="text-3xl font-semibold text-gray-700">Nova avaliação</h1>
            </div>

            {turma && (
                <div className="flex flex-wrap gap-2">
                    <Tag>{typeof turma.anoLetivo === 'string' ? turma.anoLetivo.slice(0, 4) : String(turma.anoLetivo?.[0] ?? '')}</Tag>
                    <Tag>{displayLabel(PERIODICIDADE_DISPLAY, qtdePeriodos)}</Tag>
                    <Tag>{displayLabel(TURNO_DISPLAY, turma.turno)}</Tag>
                    <Tag>{turma.alunosCount ?? turma.alunos?.length ?? 0} Alunos</Tag>
                    <Tag>Média mínima: {turma.mediaMinima != null ? turma.mediaMinima.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) : '—'}</Tag>
                </div>
            )}

            <div className="flex gap-6 flex-wrap lg:flex-nowrap">
                {/* Left — form */}
                <div className="flex-1 min-w-72 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <h2 className="text-base font-semibold text-gray-700">Avaliação</h2>

                    <Select
                        label="Tipo da avaliação"
                        value={tipo}
                        onChange={setTipo}
                        fullWidth
                        required
                    >
                        {TIPOS.map((t) => (
                            <Select.Option key={t} value={t}>{t}</Select.Option>
                        ))}
                    </Select>

                    <NumberInput
                        label="Peso"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        min={1}
                        max={10}
                        required
                        fullWidth
                    />

                    <Input
                        label="Tema"
                        value={tema}
                        onChange={(e) => setTema(e.target.value)}
                        placeholder="Ex: Fotossíntese"
                        required
                        fullWidth
                    />

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                label="Data de aplicação"
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                                fullWidth
                            />
                        </div>
                        <div className="flex-1">
                            <Select
                                label={periodoLabel}
                                value={periodo}
                                onChange={setPeriodo}
                                fullWidth
                                required
                            >
                                {periodoOptions.map((op) => (
                                    <Select.Option key={op.value} value={op.value}>
                                        {op.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-72 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-700">Selecionar alunos</h2>
                        <span className="text-sm text-gray-500">{alunos.length} alunos na turma</span>
                    </div>

                    <div className="relative">
                        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar aluno..."
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/30"
                        />
                    </div>

                    <div className="space-y-1 max-h-72 overflow-y-auto">
                        <Checkbox
                            label="Selecionar todos"
                            checked={todosSelecionados}
                            onChange={toggleTodos}
                            className="px-2 py-1 font-medium"
                        />

                        {alunosFiltrados.map((aluno) => (
                            <Checkbox
                                key={aluno.id}
                                label={aluno.nome}
                                checked={selecionados.includes(aluno.id)}
                                onChange={() => toggleAluno(aluno.id)}
                                className="px-2 py-1"
                            />
                        ))}

                        {alunosFiltrados.length === 0 && (
                            <p className="text-sm text-gray-400 italic px-2 py-2">Nenhum aluno encontrado.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/turmas/${turmaId}`)}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSalvar}
                    disabled={saving}
                >
                    {saving ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </div>
    );
};

export default NovaAvaliacaoPage;
