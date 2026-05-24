import client from './client';

export const getLimites = () => client.get('/professores/limites');

export const atualizarLimites = (data) => client.put('/professores/limites', data);

export const getAvisosPendentes = () => client.get('/professores/avisos');

export const getDashboardMetricas = () => client.get('/professores/metricas');
