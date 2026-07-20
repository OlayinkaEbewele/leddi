import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CopyableTextProps {
  value: string;
  label?: string;
}

export function CopyableText({ value, label }: CopyableTextProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // clipboard may be unavailable in some contexts
    }
  };

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Typography variant="body2" noWrap title={value}>
        {value}
      </Typography>
      <Tooltip title={copied ? t('copy.copied') : t('copy.copyEmail')}>
        <span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              void handleCopy();
            }}
            aria-label={label ?? t('copy.copyEmail')}
            color={copied ? 'success' : 'default'}
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
