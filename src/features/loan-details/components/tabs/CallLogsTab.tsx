// TODO(confirm structure): patch v0.3 §2 — Call Logs tab layout not observed; placeholder per v0.1 CallLogEntry model
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslation } from 'react-i18next';
import type { LoanDetails } from '@/api/types';
import { formatDateTime } from '@/utils/formatDate';

interface CallLogsTabProps {
  loan: LoanDetails;
}

export function CallLogsTab({ loan }: CallLogsTabProps) {
  const { t } = useTranslation();

  if (loan.callLog.length === 0) {
    return <Alert severity="info">{t('loanDetails.empty.callLog')}</Alert>;
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t('loanDetails.callLog.phone')}</TableCell>
          <TableCell>{t('loanDetails.callLog.direction')}</TableCell>
          <TableCell>{t('loanDetails.callLog.duration')}</TableCell>
          <TableCell>{t('loanDetails.callLog.occurredAt')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loan.callLog.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.phoneNumber}</TableCell>
            <TableCell>{entry.direction}</TableCell>
            <TableCell>{entry.durationSeconds}s</TableCell>
            <TableCell>{formatDateTime(entry.occurredAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
