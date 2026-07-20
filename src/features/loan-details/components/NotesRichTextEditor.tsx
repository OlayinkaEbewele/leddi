import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useRef } from 'react';
import { dm } from '@/theme/darkModeTokens';
import { borderSubtle, textPrimary } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';

interface NotesRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/** React 19–compatible rich text editor (contentEditable). Content stored as HTML and sanitized on render. */
export function NotesRichTextEditor({ value, onChange, placeholder }: NotesRichTextEditorProps) {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const editorRef = useRef<HTMLDivElement>(null);
  const skipSyncRef = useRef(false);

  const editorBg = isDark ? dm.surface0 : '#E8F4FC';
  const toolbarBg = isDark ? dm.surface1 : '#EEF6FC';

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const emitChange = useCallback(() => {
    skipSyncRef.current = true;
    onChange(editorRef.current?.innerHTML ?? '');
  }, [onChange]);

  const exec = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    emitChange();
  };

  return (
    <Box
      sx={{
        border: `1px solid ${borderSubtle}`,
        borderRadius: '10px',
        overflow: 'hidden',
        bgcolor: editorBg,
      }}
    >
      <Stack
        direction="row"
        spacing={0.25}
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: toolbarBg,
          borderBottom: `1px solid ${borderSubtle}`,
          flexWrap: 'wrap',
        }}
      >
        <ToolbarButton onClick={() => exec('bold')} label="Bold" isDark={isDark}>
          <FormatBoldIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')} label="Italic" isDark={isDark}>
          <FormatItalicIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')} label="Underline" isDark={isDark}>
          <FormatUnderlinedIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertUnorderedList')} label="Bullet list" isDark={isDark}>
          <FormatListBulletedIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')} label="Numbered list" isDark={isDark}>
          <FormatListNumberedIcon fontSize="small" />
        </ToolbarButton>
      </Stack>

      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        onInput={emitChange}
        data-placeholder={placeholder}
        sx={{
          minHeight: 180,
          p: 2,
          outline: 'none',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          bgcolor: editorBg,
          color: textPrimary,
          '&:empty::before': {
            content: 'attr(data-placeholder)',
            color: isDark ? dm.textMuted : 'text.disabled',
            pointerEvents: 'none',
          },
          '& p': { m: 0, mb: 1 },
        }}
      />
    </Box>
  );
}

function ToolbarButton({
  children,
  onClick,
  label,
  isDark,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  isDark: boolean;
}) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      aria-label={label}
      sx={{
        borderRadius: '6px',
        color: isDark ? dm.textSecondary : 'text.secondary',
        '&:hover': { bgcolor: isDark ? dm.surface2 : 'action.hover' },
      }}
    >
      {children}
    </IconButton>
  );
}
