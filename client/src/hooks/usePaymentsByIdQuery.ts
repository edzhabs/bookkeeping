import CONSTANTS from "@/constants/constants";
import {
  fetchOtherPaymentsByID,
  fetchTuitionPaymentsByID,
} from "@/services/payments";
import { IPaymentsID } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";

export const useTuitionPaymentsByIdQuery = (paramsID: string | undefined) =>
  useQuery<{
    data: IPaymentsID[] | undefined;
  }>({
    queryKey: [
      CONSTANTS.QUERYKEY.PAYMENTS,
      CONSTANTS.QUERYKEY.TUITIONS,
      paramsID,
    ],
    queryFn: () => fetchTuitionPaymentsByID(paramsID),
  });

export const useOtherPaymentsByIdQuery = (paramsID: string | undefined) =>
  useQuery<{
    data: IPaymentsID[] | undefined;
  }>({
    queryKey: [
      CONSTANTS.QUERYKEY.PAYMENTS,
      CONSTANTS.QUERYKEY.OTHERS,
      paramsID,
    ],
    queryFn: () => fetchOtherPaymentsByID(paramsID),
  });
