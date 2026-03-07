import React from 'react';
import { Card, Tag } from '../components/UI';

const TurmasPage = () => {
    // dados de exemplo que a gente pode usar pra carregar as turmas, depois a gente pode substituir por dados reais vindo da API
    const turmas = [
        { id: 1, nome: 'Matemática Básica', alunos: 28, status: 'Ativa' },
        { id: 2, nome: 'Português Avançado', alunos: 32, status: 'Ativa' },
        { id: 3, nome: 'História do Brasil', alunos: 25, status: 'Ativa' },
        { id: 4, nome: 'Física Experimental', alunos: 18, status: 'Inativa' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">Turmas</h1>
                <p className="text-gray-600">Gerencie suas turmas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {turmas.map((turma) => (
                    <Card key={turma.id}>
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{turma.nome}</h3>
                            <Tag>{turma.status}</Tag>
                        </div>
                        <p className="text-gray-600 text-sm">
                            <i className="pi pi-users text-xs mr-2"></i>
                            {turma.alunos} alunos
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TurmasPage;
