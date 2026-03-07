import React, { useState } from "react";
import { Button, Input, Select, Card, Tag, useToast } from "../components/UI";

const HomePage = () => {
    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState("");
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        showSuccess('Formulário enviado!', 'Seus dados foram processados corretamente.');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-semibold text-gray-800 mb-2">Noctua - Componentes UI</h1>
                <p className="text-gray-600">Biblioteca de componentes reutilizáveis com Tailwind CSS</p>
            </div>

            <Card
                header={
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Botões</h2>
                        <p className="text-gray-600">Demonstração de diferentes estilos de botões</p>
                    </div>
                }>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary">
                            <i className="pi pi-check text-sm"></i>
                            Confirmar
                        </Button>
                        <Button variant="outline">Cancelar</Button>
                        <Button
                            variant="primary"
                            leftIcon={<i className="pi pi-search text-sm"></i>}
                        >
                            Buscar
                        </Button>
                    </div>
                </div>
            </Card>

            <Card header={<h2 className="text-xl font-semibold text-gray-800">Tags</h2>}>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Tag>Bimestral</Tag>
                        <Tag leftIcon={<i className="pi pi-sun text-xs"></i>}>Matutino</Tag>
                    </div>
                </div>
            </Card>

            <Card
                header={<h2 className="text-xl font-semibold text-gray-800">Formulário</h2>}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button">Cancelar</Button>
                        <Button variant="primary" type="submit" form="demo-form">
                            Enviar
                        </Button>
                    </div>
                }
            >
                <form id="demo-form" onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome completo"
                        placeholder="Digite seu nome"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        leftIcon={<i className="pi pi-user text-sm"></i>}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="seu@email.com"
                        leftIcon={<i className="pi pi-envelope text-sm"></i>}
                        helperText="Nunca compartilharemos seu email"
                        required
                    />

                    <Input
                        label="Senha"
                        type="password"
                        placeholder="Digite sua senha"
                        leftIcon={<i className="pi pi-lock text-sm"></i>}
                        required
                    />

                    <Select
                        label="Categoria"
                        placeholder="Selecione uma categoria"
                        value={selectValue}
                        onChange={(e) => setSelectValue(e.target.value)}
                        leftIcon={<i className="pi pi-list text-sm"></i>}
                        required
                    >
                        <Select.Option value="tecnologia">Tecnologia</Select.Option>
                        <Select.Option value="design">Design</Select.Option>
                        <Select.Option value="marketing">Marketing</Select.Option>
                        <Select.Option value="vendas">Vendas</Select.Option>
                    </Select>

                    <Input
                        label="Campo com erro"
                        placeholder="Demonstração de erro"
                        error="Este campo contém um erro de validação"
                        leftIcon={<i className="pi pi-exclamation-circle text-sm"></i>}
                    />
                </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card variant="default">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Card Padrão</h3>
                    <p className="text-gray-600">Card normal com borda</p>
                </Card>

                <Card variant="flat">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Card Plano</h3>
                    <p className="text-gray-600">Card sem borda</p>
                </Card>
            </div>

            <Card header={<h2 className="text-xl font-semibold text-gray-800">Toast Notifications</h2>}>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="primary"
                        onClick={() => showSuccess('Sucesso!', 'Operação concluída com êxito.')}
                    >
                        Sucesso
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => showError('Erro!', 'Algo deu errado.')}
                    >
                        Erro
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => showWarning('Atenção!', 'Verifique os dados.')}
                    >
                        Aviso
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => showInfo('Informação', 'Dados atualizados.')}
                    >
                        Informação
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default HomePage;
