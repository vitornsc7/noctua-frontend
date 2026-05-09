import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '../../../../components/UI';
import { TURNO_DISPLAY, PERIODICIDADE_DISPLAY, normalizeNumber } from '../../../../utils/displayMaps';

const getAno = (anoLetivo) => {
    if (!anoLetivo) return '';
    if (typeof anoLetivo === 'string') return anoLetivo.slice(0, 4);
    if (Array.isArray(anoLetivo)) return String(anoLetivo[0]);
    return String(anoLetivo);
};

const TurmaTags = ({ turma }) => {
    if (!turma) return null;

    const ano = getAno(turma.anoLetivo);
    const periodicidade = PERIODICIDADE_DISPLAY[Number(turma.qtdePeriodos)] ?? PERIODICIDADE_DISPLAY[turma.qtdePeriodos];
    const turno = TURNO_DISPLAY[turma.turno] ?? turma.turno;
    const alunosCount = turma.alunosCount ?? turma.alunos?.length ?? 0;
    const mediaMinima = normalizeNumber(turma.mediaMinima);

    return (
        <div className="flex flex-wrap gap-2">
            {ano && <Tag>{ano}</Tag>}
            {periodicidade && <Tag>{periodicidade}</Tag>}
            {turno && <Tag>{turno}</Tag>}
            {turma.disciplina && <Tag>{turma.disciplina}</Tag>}
            <Tag>{alunosCount} Aluno(s)</Tag>
            <Tag>Média mínima: {mediaMinima}</Tag>
            {turma.instituicao && <Tag>{turma.instituicao}</Tag>}
        </div>
    );
};

TurmaTags.propTypes = {
    turma: PropTypes.object,
};

export default TurmaTags;
