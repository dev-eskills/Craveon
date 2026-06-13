import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '../api/supportApi';

export const useSupport = (isAdmin = false) => {
  const queryClient = useQueryClient();

  // User support history
  const userHistory = useQuery({
    queryKey: ['userSupportHistory'],
    queryFn: supportApi.getUserSupportHistory,
    enabled: !isAdmin,
  });

  // Admin disputes
  const adminDisputes = useQuery({
    queryKey: ['adminDisputes'],
    queryFn: supportApi.getAdminDisputes,
    enabled: isAdmin,
  });

  // Admin complaints
  const adminComplaints = useQuery({
    queryKey: ['adminComplaints'],
    queryFn: supportApi.getAdminComplaints,
    enabled: isAdmin,
  });

  // Admin feedback
  const adminFeedback = useQuery({
    queryKey: ['adminFeedback'],
    queryFn: supportApi.getAdminFeedback,
    enabled: isAdmin,
  });

  // Mutations
  const submitFeedback = useMutation({
    mutationFn: supportApi.createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSupportHistory'] });
      queryClient.invalidateQueries({ queryKey: ['adminFeedback'] });
    },
  });

  const submitComplaint = useMutation({
    mutationFn: supportApi.createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSupportHistory'] });
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
    },
  });

  const submitDispute = useMutation({
    mutationFn: supportApi.createDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSupportHistory'] });
      queryClient.invalidateQueries({ queryKey: ['adminDisputes'] });
    },
  });

  const updateComplaint = useMutation({
    mutationFn: supportApi.updateComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['userSupportHistory'] });
    },
  });

  const updateDispute = useMutation({
    mutationFn: supportApi.updateDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDisputes'] });
      queryClient.invalidateQueries({ queryKey: ['userSupportHistory'] });
    },
  });

  return {
    // User data
    history: userHistory.data,
    isHistoryLoading: userHistory.isLoading,
    refetchHistory: userHistory.refetch,

    // Admin data
    disputes: adminDisputes.data?.disputes || [],
    isDisputesLoading: adminDisputes.isLoading,
    refetchDisputes: adminDisputes.refetch,

    complaints: adminComplaints.data?.complaints || [],
    isComplaintsLoading: adminComplaints.isLoading,
    refetchComplaints: adminComplaints.refetch,

    feedbacks: adminFeedback.data?.feedbacks || [],
    isFeedbacksLoading: adminFeedback.isLoading,
    refetchFeedbacks: adminFeedback.refetch,

    // Mutations
    submitFeedbackFn: submitFeedback.mutateAsync,
    isFeedbackSubmitting: submitFeedback.isPending,

    submitComplaintFn: submitComplaint.mutateAsync,
    isComplaintSubmitting: submitComplaint.isPending,

    submitDisputeFn: submitDispute.mutateAsync,
    isDisputeSubmitting: submitDispute.isPending,

    updateComplaintFn: updateComplaint.mutateAsync,
    isComplaintUpdating: updateComplaint.isPending,

    updateDisputeFn: updateDispute.mutateAsync,
    isDisputeUpdating: updateDispute.isPending,
  };
};
