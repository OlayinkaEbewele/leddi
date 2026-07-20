import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loanActionsApi } from '@/api';
import type { LoanNote, RestructureRequestPayload } from '@/api/types';

export function useLoanActions(acquireId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['loanDetails', acquireId] });
  };

  const addNote = useMutation({
    mutationFn: (note: Pick<LoanNote, 'type' | 'content' | 'channel' | 'appSource'>) =>
      loanActionsApi.addNote(acquireId, note),
    onSuccess: invalidate,
  });

  const addPtp = useMutation({
    mutationFn: (ptp: { amount: number; promisedDate: string }) =>
      loanActionsApi.addPtp(acquireId, ptp),
    onSuccess: invalidate,
  });

  const requestStatusUpdate = useMutation({
    mutationFn: ({ newStatus, reason }: { newStatus: string; reason: string }) =>
      loanActionsApi.requestStatusUpdate(acquireId, newStatus, reason),
    onSuccess: invalidate,
  });

  const requestAssetRecovery = useMutation({
    mutationFn: (reason: string) => loanActionsApi.requestAssetRecovery(acquireId, reason),
    onSuccess: invalidate,
  });

  const cancelAssetRecovery = useMutation({
    mutationFn: () => loanActionsApi.cancelAssetRecovery(acquireId),
    onSuccess: invalidate,
  });

  const requestRestructure = useMutation({
    mutationFn: (payload: RestructureRequestPayload) =>
      loanActionsApi.requestRestructure(acquireId, payload),
    onSuccess: invalidate,
  });

  const generateStatement = useMutation({
    mutationFn: (dateRange: { from: string; to: string }) =>
      loanActionsApi.generateStatement(acquireId, dateRange),
  });

  const generateSettlementQuote = useMutation({
    mutationFn: () => loanActionsApi.generateSettlementQuote(acquireId),
    onSuccess: invalidate,
  });

  const generateTerminationLetter = useMutation({
    mutationFn: () => loanActionsApi.generateTerminationLetter(acquireId),
  });

  const updateCustomerContact = useMutation({
    mutationFn: (contact: { phone?: string; email?: string }) =>
      loanActionsApi.updateCustomerContact(acquireId, contact),
    onSuccess: invalidate,
  });

  const addAlternativePhoneNumber = useMutation({
    mutationFn: (entry: { number: string; label?: string }) =>
      loanActionsApi.addAlternativePhoneNumber(acquireId, entry),
    onSuccess: invalidate,
  });

  const deleteAlternativePhoneNumber = useMutation({
    mutationFn: (number: string) => loanActionsApi.deleteAlternativePhoneNumber(acquireId, number),
    onSuccess: invalidate,
  });

  const addAlternativeEmail = useMutation({
    mutationFn: (email: string) => loanActionsApi.addAlternativeEmail(acquireId, email),
    onSuccess: invalidate,
  });

  const addAlternativeAddress = useMutation({
    mutationFn: (address: string) => loanActionsApi.addAlternativeAddress(acquireId, address),
    onSuccess: invalidate,
  });

  return {
    addNote,
    addPtp,
    requestStatusUpdate,
    requestAssetRecovery,
    cancelAssetRecovery,
    requestRestructure,
    generateStatement,
    generateSettlementQuote,
    generateTerminationLetter,
    updateCustomerContact,
    addAlternativePhoneNumber,
    deleteAlternativePhoneNumber,
    addAlternativeEmail,
    addAlternativeAddress,
  };
}
