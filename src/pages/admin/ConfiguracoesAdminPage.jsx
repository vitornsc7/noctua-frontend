import { Card } from '../../components/UI';

export default function ConfiguracoesAdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-gray-800">Configurações</h1>
                <p className="mt-2 text-sm text-gray-500">Espaço reservado para configurações exclusivas do administrador.</p>
            </div>

            <Card variant="accent">
                <div className="space-y-2">
                    <p className="text-base font-medium text-gray-700">Configurações administrativas</p>
                    <p className="text-sm text-gray-500">Esta área pode receber permissões, preferências operacionais e controles globais do sistema.</p>
                </div>
            </Card>
        </div>
    );
}