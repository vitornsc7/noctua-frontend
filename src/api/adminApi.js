import client from './client';

export const buscarMonitoramentoAdmin = () => client.get('/admins/monitoramento');