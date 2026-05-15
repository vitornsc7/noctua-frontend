import client from './client';

export const buscarMonitoramentoAdmin = () => client.get('/admins/monitoramento');

export const buscarLogsAdmin = (professorId) => {
    const params = new URLSearchParams();
    if (professorId) params.append('professorId', professorId);
    const query = params.toString();
    return client.get(`/admins/logs${query ? `?${query}` : ''}`);
};