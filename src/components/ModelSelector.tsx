import { useTheme } from '../context/ThemeContext';
import { OllamaModel } from '../hooks/useChat';

interface ModelSelectorProps {
    models: OllamaModel[];
    selectedModel: string;
    onSelect: (model: string) => void;
    disabled?: boolean;
}

export function ModelSelector({ models, selectedModel, onSelect, disabled }: ModelSelectorProps) {
    const { currentTheme, themeName } = useTheme();
    const colors = currentTheme.colors;
    const isRetro = themeName === 'retro';

    return (
        <div style={{
            padding: '8px 12px',
            borderTop: `1px solid ${colors.border}`,
        }}>
            <label style={{
                display: 'block',
                fontSize: isRetro ? '8px' : '11px',
                color: colors.textSecondary,
                marginBottom: '6px',
                textTransform: isRetro ? 'uppercase' : 'none',
            }}>
                {isRetro ? '> MODEL' : 'Model'}
            </label>
            <select
                value={selectedModel}
                onChange={(e) => onSelect(e.target.value)}
                disabled={disabled || models.length === 0}
                style={{
                    width: '100%',
                    padding: isRetro ? '6px 8px' : '8px 12px',
                    backgroundColor: colors.bgCard,
                    border: `1px solid ${colors.border}`,
                    borderRadius: currentTheme.borderRadius,
                    color: colors.textPrimary,
                    fontSize: isRetro ? '9px' : '13px',
                    fontFamily: currentTheme.fontFamily,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23${colors.textSecondary.slice(1)}' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '16px',
                    ...(isRetro && {
                        boxShadow: 'inset -2px -2px #1a1a1a, inset 2px 2px #4a5568',
                    }),
                }}
            >
                {models.length === 0 ? (
                    <option value="">No models available</option>
                ) : (
                    models.map((model) => (
                        <option key={model.name} value={model.name}>
                            {model.name}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
}
