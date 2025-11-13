# Guia de Utilização das Variáveis de Estilização

## Variáveis CSS Disponíveis

O projeto possui 3 temas (default, light e dark) com as seguintes variáveis CSS:

### Lista de Variáveis

| Variável CSS | Descrição | Uso Recomendado |
|--------------|-----------|-----------------|
| `--color-primary` | Cor primária do texto | Textos principais, títulos |
| `--color-secondary` | Cor secundária | Textos auxiliares, legendas |
| `--color-bg` | Cor de fundo principal | Background de páginas e seções |
| `--color-accent` | Cor de destaque | Links, botões, elementos interativos |
| `--color-accent-light` | Variante clara do accent | Hover states, backgrounds sutis |
| `--color-accent-dark` | Variante escura do accent | Hover em links, elementos ativos |
| `--color-bg-light` | Cor de fundo secundária | Cards, seções alternadas |

## Como Usar com Tailwind CSS

As variáveis foram configuradas no `tailwind.config.js` e podem ser usadas diretamente como classes:

### Classes Tailwind Disponíveis

#### Cores de Texto
```jsx
<h1 className="text-primary">Título Principal</h1>
<p className="text-secondary">Texto secundário</p>
<a className="text-accent">Link com destaque</a>
<span className="text-accentDark">Texto escuro</span>
<span className="text-accentLight">Texto claro</span>
```

#### Cores de Fundo
```jsx
<div className="bg-bg">Fundo principal</div>
<div className="bg-bgLight">Fundo secundário</div>
<div className="bg-accent">Fundo com accent</div>
<div className="bg-accentLight">Fundo accent claro</div>
<div className="bg-accentDark">Fundo accent escuro</div>
```

#### Cores de Borda
```jsx
<div className="border border-primary">Borda primária</div>
<div className="border border-accent">Borda accent</div>
<div className="border-l-4 border-accentDark">Borda esquerda escura</div>
```

## Exemplos Práticos

### Botão com Hover
```jsx
<button className="bg-accent hover:bg-accentDark text-primary px-4 py-2 rounded">
  Clique Aqui
</button>
```

### Card
```jsx
<div className="bg-bgLight p-6 rounded-lg shadow-md">
  <h3 className="text-primary text-xl font-bold mb-2">Título do Card</h3>
  <p className="text-secondary">Descrição do conteúdo</p>
</div>
```

### Link com Hover
```jsx
<a className="text-accent hover:text-accentDark underline">
  Saiba mais
</a>
```

### Seção com Background
```jsx
<section className="bg-bg min-h-screen">
  <div className="bg-bgLight p-8 rounded">
    <h2 className="text-primary text-2xl">Seção</h2>
    <p className="text-secondary">Conteúdo</p>
  </div>
</section>
```

### Lista com Destaque
```jsx
<ul className="space-y-2">
  <li className="text-primary hover:text-accent cursor-pointer">
    Item 1
  </li>
  <li className="text-primary hover:text-accent cursor-pointer">
    Item 2
  </li>
</ul>
```

## Temas Disponíveis

### theme-default
- Cores neutras e discretas
- Fundo claro (#F6F7F9)
- Texto escuro (#222222)

### theme-light
- Tom claro e sóbrio
- Fundo claro (#F6F7F9)
- Texto mais escuro (#16181d)

### theme-dark
- Tom escuro e sóbrio
- Fundo escuro (#23272F)
- Texto claro (#ECEFF4)

## Uso Direto das Variáveis CSS

Se precisar usar as variáveis diretamente no CSS ou em estilos inline:

```css
/* Em arquivos CSS */
.meu-elemento {
  color: var(--color-primary);
  background-color: var(--color-bg);
  border-color: var(--color-accent);
}

/* Com hover */
.meu-link:hover {
  color: var(--color-accent-dark);
}
```

```jsx
// Em estilos inline (React)
<div style={{ 
  color: 'var(--color-primary)', 
  backgroundColor: 'var(--color-bg)' 
}}>
  Conteúdo
</div>
```

## Dicas de Uso

1. **Sempre use as variáveis** ao invés de cores fixas para garantir que os temas funcionem
2. **Combine cores de forma consistente**: `text-primary` com `bg-bg`, `text-accent` para destaques
3. **Use hover states** com `accentDark` para melhor UX: `text-accent hover:text-accentDark`
4. **Backgrounds alternativos**: Use `bg-bgLight` para criar contraste com `bg-bg`
5. **Textos secundários**: Use `text-secondary` para informações menos importantes

## Estrutura dos Arquivos

- **src/themes.css**: Define as variáveis CSS para cada tema
- **tailwind.config.js**: Mapeia as variáveis para classes Tailwind
- **src/App.jsx**: Controla qual tema está ativo via classe no body
