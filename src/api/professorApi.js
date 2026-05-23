import client from './client';

export const getLimites = () => client.get('/professores/limites');

export const atualizarLimites = (data) => client.put('/professores/limites', data);
