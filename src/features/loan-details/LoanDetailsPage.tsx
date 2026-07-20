import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import type { ActionKey } from '@/auth/roles';
import { pagePaddingX } from '@/theme/theme';
import { LoanActionsDrawer } from './components/LoanActionsDrawer';
import { LoanDetailsInfoPanel } from './components/LoanDetailsInfoPanel';
import { LoanDetailsRequestPanels } from './components/LoanDetailsRequestPanels';
import { LoanDetailsRightPanel } from './components/LoanDetailsRightPanel';
import { LoanDetailsSidebar } from './components/LoanDetailsSidebar';
import { LoanDetailsStickyBar } from './components/LoanDetailsStickyBar';
import { LoanDetailsTabPanel } from './components/LoanDetailsTabPanel';
import { CapturePtpModal } from './components/modals/CapturePtpModal';
import { GenerateStatementModal } from './components/modals/GenerateStatementModal';
import { SettlementQuoteModal } from './components/modals/SettlementQuoteModal';
import { CallLogsTab } from './components/tabs/CallLogsTab';
import { FilesTab } from './components/tabs/FilesTab';
import { NotesTab } from './components/tabs/NotesTab';
import { PaymentsTab } from './components/tabs/PaymentsTab';
import { PromisesTab } from './components/tabs/PromisesTab';
import { ReceiptsTab } from './components/tabs/ReceiptsTab';
import { ScheduleTab } from './components/tabs/ScheduleTab';
import { useLoanActions } from './hooks/useLoanActions';
import { useLoanDetailsQuery } from './hooks/useLoanDetailsQuery';

const TAB_KEYS = [
  'schedule',
  'payments',
  'promises',
  'notes',
  'files',
  'receipts',
  'call-logs',
] as const;

type TabKey = (typeof TAB_KEYS)[number];

const TAB_LABEL_KEYS = [
  'loanDetails.tabs.schedule',
  'loanDetails.tabs.payments',
  'loanDetails.tabs.promises',
  'loanDetails.tabs.notes',
  'loanDetails.tabs.files',
  'loanDetails.tabs.receipts',
  'loanDetails.tabs.callLogs',
] as const;

function tabIndexFromParam(tab?: string): number {
  if (!tab) return 0;
  if (tab === 'activities') return 0;
  const idx = TAB_KEYS.indexOf(tab as TabKey);
  return idx >= 0 ? idx : 0;
}

export function LoanDetailsPage() {
  const { t } = useTranslation();
  const { acquireId = '', tab } = useParams<{ acquireId: string; tab?: string }>();
  const navigate = useNavigate();
  const { data: loan, isLoading, isError, refetch, isFetching } = useLoanDetailsQuery(acquireId);
  const { addNote, addPtp, generateSettlementQuote } = useLoanActions(acquireId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingDrawerAction, setPendingDrawerAction] = useState<ActionKey | null>(null);
  const [capturePtpOpen, setCapturePtpOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(false);
  const [statementSuccess, setStatementSuccess] = useState(false);

  const tabIndex = useMemo(() => tabIndexFromParam(tab), [tab]);
  const tabLabels = TAB_LABEL_KEYS.map((key) => t(key));

  const handleTabChange = (newIndex: number) => {
    const tabKey = TAB_KEYS[newIndex] ?? 'schedule';
    navigate(`/prime/loans/${acquireId}/${tabKey}`);
  };

  const handleAction = useCallback((actionKey: ActionKey) => {
    if (actionKey === 'ADD_PTP') {
      setCapturePtpOpen(true);
      return;
    }
    if (actionKey === 'GENERATE_STATEMENT') {
      setStatementSuccess(false);
      setStatementOpen(true);
      return;
    }
    if (actionKey === 'GENERATE_SETTLEMENT_QUOTE') {
      setSettlementOpen(true);
      return;
    }
    setPendingDrawerAction(actionKey);
    setDrawerOpen(true);
  }, []);

  const activityContent = useMemo(() => {
    if (!loan) return null;
    switch (tabIndex) {
      case 0:
        return <ScheduleTab loan={loan} onRefresh={() => void refetch()} />;
      case 1:
        return <PaymentsTab loan={loan} />;
      case 2:
        return (
          <PromisesTab
            loan={loan}
            onReload={() => void refetch()}
            isCapturing={addPtp.isPending}
            onCapturePtp={async (ptp) => {
              await addPtp.mutateAsync(ptp);
            }}
          />
        );
      case 3:
        return (
          <NotesTab
            loan={loan}
            isAdding={addNote.isPending}
            onAddNote={async ({ content, channel }) => {
              await addNote.mutateAsync({
                type: 'GENERAL',
                content,
                channel,
                appSource: 'PRIME',
              });
            }}
          />
        );
      case 4:
        return <FilesTab loan={loan} />;
      case 5:
        return <ReceiptsTab loan={loan} />;
      case 6:
        return <CallLogsTab loan={loan} />;
      default:
        return null;
    }
  }, [loan, tabIndex, refetch, addPtp, addNote]);

  return (
    <Box>
      {isError && (
        <Box sx={{ px: pagePaddingX, pt: pagePaddingX }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void refetch()}>
                {t('loans.retry')}
              </Button>
            }
            sx={{ mb: 2 }}
          >
            {t('loanDetails.error')}
          </Alert>
        </Box>
      )}

      {!isLoading && !isError && !loan && (
        <Box sx={{ px: pagePaddingX, p: pagePaddingX }}>
          <Alert severity="warning">{t('loanDetails.notFound')}</Alert>
        </Box>
      )}

      {loan && (
        <>
          <LoanDetailsStickyBar
            loan={loan}
            onReload={() => void refetch()}
            onAction={handleAction}
            onMoreActions={() => setDrawerOpen(true)}
            reloading={isFetching}
          />

          <Box sx={{ px: pagePaddingX, pb: pagePaddingX, pt: 0 }}>
            <LoanActionsDrawer
              loan={loan}
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              hideTrigger
              initialAction={pendingDrawerAction}
              onInitialActionConsumed={() => setPendingDrawerAction(null)}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 2.5,
                alignItems: 'flex-start',
              }}
            >
              <LoanDetailsSidebar loan={loan} />

              <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <LoanDetailsInfoPanel loan={loan} />
                <LoanDetailsRequestPanels loan={loan} />
                <LoanDetailsTabPanel
                  tabIndex={tabIndex}
                  onTabChange={handleTabChange}
                  tabLabels={tabLabels}
                >
                  {activityContent}
                </LoanDetailsTabPanel>
              </Box>

              <LoanDetailsRightPanel loan={loan} />
            </Box>
          </Box>

          <CapturePtpModal
            open={capturePtpOpen}
            onClose={() => setCapturePtpOpen(false)}
            isSubmitting={addPtp.isPending}
            onSubmit={async (data) => {
              await addPtp.mutateAsync(data);
              setCapturePtpOpen(false);
            }}
          />

          <GenerateStatementModal
            open={statementOpen}
            onClose={() => setStatementOpen(false)}
            success={statementSuccess}
            onSubmit={() => setStatementSuccess(true)}
          />

          <SettlementQuoteModal
            open={settlementOpen}
            onClose={() => setSettlementOpen(false)}
            isSubmitting={generateSettlementQuote.isPending}
            onSubmit={() => {
              void generateSettlementQuote.mutateAsync().then(() => setSettlementOpen(false));
            }}
          />
        </>
      )}
    </Box>
  );
}
