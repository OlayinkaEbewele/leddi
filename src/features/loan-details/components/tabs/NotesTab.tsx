import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { getDashboardActionButtonSx } from '@/features/dashboard/dashboardTheme';
import { dm } from '@/theme/darkModeTokens';
import { borderSubtle, dashboardGreen, pageBackground, surface, textMuted } from '@/theme/theme';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { NotesRichTextEditor } from '../NotesRichTextEditor';
import {
  NOTE_CHANNEL_OPTIONS,
  NOTE_TEMPLATE_OPTIONS,
  type NoteChannelValue,
  type NoteTemplateValue,
} from './noteTemplates';

interface NotesTabProps {
  loan: LoanDetails;
  onAddNote: (note: { content: string; channel: string }) => Promise<void>;
  isAdding: boolean;
}

interface FormErrors {
  channel?: boolean;
  template?: boolean;
  subject?: boolean;
  content?: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function NotesTab({ loan, onAddNote, isAdding }: NotesTabProps) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const sendButtonSx = getDashboardActionButtonSx(mode);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<NoteChannelValue | ''>('');
  const [template, setTemplate] = useState<NoteTemplateValue | ''>('');
  const [emailSubject, setEmailSubject] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sourceTab, setSourceTab] = useState(0);
  const [sendError, setSendError] = useState<string | null>(null);

  const filteredNotes = loan.notes.filter((n) =>
    sourceTab === 0 ? n.appSource === 'PRIME' : n.appSource === 'NEST',
  );

  const handleTemplateChange = (value: NoteTemplateValue | '') => {
    setTemplate(value);
    setErrors((e) => ({ ...e, template: false }));
    if (value) {
      const match = NOTE_TEMPLATE_OPTIONS.find((opt) => opt.value === value);
      if (match) setContent(match.html);
    }
  };

  const resetForm = () => {
    setContent('');
    setChannel('');
    setTemplate('');
    setEmailSubject('');
    setAttachments([]);
    setErrors({});
  };

  const handleSend = async () => {
    setSendError(null);
    const nextErrors: FormErrors = {
      channel: !channel,
      template: !template,
      subject: channel === 'EMAIL' && !emailSubject.trim(),
      content: !stripHtml(content),
    };
    setErrors(nextErrors);
    if (nextErrors.channel || nextErrors.template || nextErrors.subject || nextErrors.content) {
      return;
    }

    try {
      await onAddNote({ content, channel });
      resetForm();
    } catch {
      setSendError(t('loanDetails.notes.sendError'));
    }
  };

  const handleAttachments = (files: FileList | null) => {
    if (!files) return;
    setAttachments(Array.from(files).map((f) => f.name));
  };

  return (
    <Stack spacing={2.5}>
      <NotesRichTextEditor
        value={content}
        onChange={(html) => {
          setContent(html);
          if (stripHtml(html)) {
            setErrors((e) => ({ ...e, content: false }));
          }
        }}
        placeholder={t('loanDetails.notes.editorPlaceholder')}
      />
      {errors.content && <FieldError message={t('loanDetails.notes.contentRequired')} />}

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', lg: 'flex-start' }}
      >
        <FormControl size="small" sx={{ minWidth: 140, flex: 1 }} error={errors.channel}>
          <InputLabel>{t('loanDetails.notes.selectChannel')}</InputLabel>
          <Select
            label={t('loanDetails.notes.selectChannel')}
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value as NoteChannelValue);
              setErrors((prev) => ({ ...prev, channel: false }));
            }}
          >
            {NOTE_CHANNEL_OPTIONS.map((c) => (
              <MenuItem key={c} value={c}>
                {t(`loanDetails.notes.channel.${c.toLowerCase()}`)}
              </MenuItem>
            ))}
          </Select>
          {errors.channel && <FieldError message={t('loanDetails.notes.channelRequired')} />}
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160, flex: 1 }} error={errors.template}>
          <InputLabel>{t('loanDetails.notes.template')}</InputLabel>
          <Select
            label={t('loanDetails.notes.template')}
            value={template}
            onChange={(e) => {
              handleTemplateChange(e.target.value as NoteTemplateValue | '');
            }}
          >
            {NOTE_TEMPLATE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {t(`loanDetails.notes.templates.${opt.value}`)}
              </MenuItem>
            ))}
          </Select>
          {errors.template && <FieldError message={t('loanDetails.notes.templateRequired')} />}
        </FormControl>

        <Box sx={{ flex: 2, minWidth: 0 }}>
          <TextField
            size="small"
            fullWidth
            label={t('loanDetails.notes.emailSubject')}
            placeholder={t('loanDetails.notes.emailSubjectPlaceholder')}
            value={emailSubject}
            onChange={(e) => {
              setEmailSubject(e.target.value);
              setErrors((prev) => ({ ...prev, subject: false }));
            }}
            error={errors.subject}
          />
          {errors.subject && <FieldError message={t('loanDetails.notes.subjectRequired')} />}
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<SendOutlinedIcon />}
          onClick={() => void handleSend()}
          disabled={isAdding}
          sx={{
            alignSelf: { lg: 'flex-start' },
            mt: { lg: 0.25 },
            flexShrink: 0,
            ...sendButtonSx,
          }}
        >
          {t('loanDetails.notes.send')}
        </Button>
      </Stack>

      {sendError && (
        <Alert severity="error" onClose={() => setSendError(null)}>
          {sendError}
        </Alert>
      )}

      <Box>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            handleAttachments(e.target.files);
          }}
        />
        <Button
          variant="text"
          size="small"
          startIcon={<AttachFileOutlinedIcon />}
          onClick={() => {
            fileInputRef.current?.click();
          }}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: isDark ? dm.accent : dashboardGreen,
          }}
        >
          {t('loanDetails.notes.addAttachments')}
        </Button>
        {attachments.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {attachments.join(', ')}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          border: `1px solid ${borderSubtle}`,
          borderRadius: '10px',
          overflow: 'hidden',
          bgcolor: isDark ? surface : 'transparent',
        }}
      >
        <Tabs
          value={sourceTab}
          onChange={(_, v: number) => {
            setSourceTab(v);
          }}
          sx={{
            bgcolor: isDark ? dm.surface0 : pageBackground,
            borderBottom: `1px solid ${borderSubtle}`,
            minHeight: 44,
            px: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              minHeight: 40,
              borderRadius: '8px 8px 0 0',
              color: isDark ? dm.textSecondary : textMuted,
            },
            '& .MuiTab-root.Mui-selected': {
              bgcolor: isDark ? dm.accent : '#E8F4FC',
              color: isDark ? dm.textPrimary : dashboardGreen,
            },
          }}
        >
          <Tab label={t('loanDetails.notes.primeNotes')} />
          <Tab label={t('loanDetails.notes.nestComments')} />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
          <Divider sx={{ mb: 2, '&::before, &::after': { borderColor: borderSubtle } }}>
            <Typography variant="caption" sx={{ color: textMuted, fontWeight: 600, px: 1 }}>
              {t('loanDetails.notes.sectionDivider')}
            </Typography>
          </Divider>

          {filteredNotes.length === 0 ? (
            <Alert severity="info">{t('loanDetails.empty.notes')}</Alert>
          ) : (
            <Stack spacing={2.5}>
              {filteredNotes.map((note) => (
                <Box key={note.id}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isDark ? dm.accent : dashboardGreen,
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: 'italic', fontWeight: 700, fontSize: '0.8125rem' }}
                      >
                        {note.createdBy} @ {formatNoteTimestamp(note.createdAt)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        / {note.channel}
                      </Typography>
                      <Box
                        sx={{ typography: 'body2', color: 'text.secondary', '& p': { mb: 1 } }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }}
                      />
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Stack>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
      <ErrorOutlineIcon sx={{ fontSize: 14, color: 'error.main' }} />
      <Typography variant="caption" color="error">
        {message}
      </Typography>
    </Stack>
  );
}

function formatNoteTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return format(d, 'EEE MMM dd yyyy HH:mm:ss') + ' GMT+0100 (West Africa Time)';
  } catch {
    return iso;
  }
}
