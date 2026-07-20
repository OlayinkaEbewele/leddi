import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import type { LoanDetails, LoanDocument } from '@/api/types';
import { formatDisplayDate } from '@/utils/formatDate';
import { formatFileSize } from '@/utils/formatFileSize';
import { TabListCard } from './shared/TabListCard';

interface FilesTabProps {
  loan: LoanDetails;
}

function fileIcon(doc: LoanDocument) {
  if (doc.fileType === 'pdf') return <PictureAsPdfOutlinedIcon fontSize="small" />;
  if (doc.fileType === 'zip') return <FolderZipOutlinedIcon fontSize="small" />;
  return <InsertDriveFileOutlinedIcon fontSize="small" />;
}

export function FilesTab({ loan }: FilesTabProps) {
  const { t } = useTranslation();

  if (loan.documents.length === 0) {
    return <Alert severity="info">{t('loanDetails.empty.documents')}</Alert>;
  }

  return (
    <Stack spacing={0}>
      {loan.documents.map((doc) => {
        const sizeLabel = doc.fileSizeBytes
          ? formatFileSize(doc.fileSizeBytes)
          : t('loanDetails.files.unknownSize');

        return (
          <TabListCard
            key={doc.id}
            icon={fileIcon(doc)}
            title={doc.fileName}
            subtitle={`${sizeLabel} · ${formatDisplayDate(doc.uploadedAt)}`}
            actionLabel={t('loanDetails.files.download')}
            onAction={() => {
              window.open(doc.url, '_blank');
            }}
          />
        );
      })}
    </Stack>
  );
}
