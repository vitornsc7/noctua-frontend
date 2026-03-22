import React, { useState } from 'react';
import { Card, Tag, Select } from '../components/UI';
import calendarIcon from '../assets/calendar.svg';

const TurmasPage = () => {
    const instituicoes = [
        { id: 'todas', nome: 'Todas as instituições' },
        { id: 'inst1', nome: 'Colégio São Paulo' },
        { id: 'inst2', nome: 'Escola Municipal Centro' },
        { id: 'inst3', nome: 'Instituto Educacional Norte' },
    ];

    const [instituicaoSelecionada, setInstituicaoSelecionada] = useState('todas');
    const [periodoSelecionado, setPeriodoSelecionado] = useState('todos');
    const [anoSelecionado, setAnoSelecionado] = useState('todos');

    const turmas = [
        { id: 1, nome: '1º Ano - A', alunos: 28, status: 'Ativa', instituicaoId: 'inst1', turno: 'Matutino' },
        { id: 2, nome: '1º Ano - B', alunos: 32, status: 'Ativa', instituicaoId: 'inst1', turno: 'Vespertino' },
        { id: 3, nome: '2º Ano - A', alunos: 25, status: 'Ativa', instituicaoId: 'inst2', turno: 'Matutino' },
        { id: 4, nome: '2º Ano - B', alunos: 18, status: 'Inativa', instituicaoId: 'inst3', turno: 'Vespertino' },
    ];

    const turmasFiltradas = instituicaoSelecionada === 'todas'
        ? turmas
        : turmas.filter(turma => turma.instituicaoId === instituicaoSelecionada);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">Turmas</h1>
                <p className="text-gray-600">Gerencie suas turmas</p>
            </div>

            <div className="flex flex-col md:flex-row md:gap-2 gap-4">
                <Select
                    label="Filtrar por instituição"
                    value={instituicaoSelecionada}
                    onChange={(e) => setInstituicaoSelecionada(e.target.value)}
                    leftIcon={<i className="pi pi-building text-sm"></i>}
                    fullWidth
                >
                    {instituicoes.map((inst) => (
                        <Select.Option key={inst.id} value={inst.id}>
                            {inst.nome}
                        </Select.Option>
                    ))}
                </Select>

                <Select
                    label="Filtrar por período"
                    value={periodoSelecionado}
                    onChange={(e) => setPeriodoSelecionado(e.target.value)}
                    leftIcon={<i className="pi pi-clock text-sm"></i>}
                    fullWidth
                >
                    <Select.Option value="todos">Todos os períodos</Select.Option>
                    <Select.Option value="matutino">Matutino</Select.Option>
                    <Select.Option value="vespertino">Vespertino</Select.Option>
                </Select>

                <Select
                    label="Filtrar por ano"
                    value={anoSelecionado}
                    onChange={(e) => setAnoSelecionado(e.target.value)}
                    leftIcon={
                        <img src={calendarIcon} alt="" className="w-4 h-4 text-gray-500" />
                    }
                    fullWidth
                >
                    <Select.Option value="todos">Todos os anos</Select.Option>
                    <Select.Option value="2025">2025</Select.Option>
                    <Select.Option value="2026">2026</Select.Option>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {turmasFiltradas.map((turma) => (
                    <Card key={turma.id}>
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{turma.nome}</h3>
                            <p className="text-gray-600 text-sm">
                                <i className="pi pi-users text-xs mr-2"></i>
                                {turma.alunos} alunos
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag>{instituicoes.find(inst => inst.id === turma.instituicaoId)?.nome}</Tag>
                            <Tag><i className="pi pi-clock text-xs mr-2"></i>{turma.turno}</Tag>
                            <Tag><img src={calendarIcon} alt="" className="w-3 h-3 inline mr-2" />2026</Tag>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TurmasPage;