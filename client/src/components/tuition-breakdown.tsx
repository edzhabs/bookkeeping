interface Props {
  enrollment_fee: number;
  monthly_tuition: number;
  misc_fee: number;
  pta_fee: number;
  lms_books_fee: number;
  isRankOne: boolean;
  rankOneDiscountAmount: number;
  siblingDiscountAmount: number;
  fullYearDiscountAmount: number;
  scholarDiscountAmount: number;
  discountAmount: number;
  totalAmount: number;
}
const TuitionBreakdown = ({
  discountAmount,
  enrollment_fee,
  totalAmount,
  isRankOne,
  lms_books_fee,
  misc_fee,
  monthly_tuition,
  pta_fee,
  rankOneDiscountAmount,
  fullYearDiscountAmount,
  scholarDiscountAmount,
  siblingDiscountAmount,
}: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm">Enrollment Fee:</p>
        <p className="text-sm font-medium">
          ₱{enrollment_fee.toLocaleString()}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">Tuition Fee (10 months):</p>
        <p className="text-sm font-medium">
          ₱{monthly_tuition.toLocaleString()}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">Miscellaneous Fee:</p>
        <p className="text-sm font-medium">₱{misc_fee.toLocaleString()}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">PTA Fee:</p>
        <p className="text-sm font-medium">₱{pta_fee.toLocaleString()}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">Quipper LMS and Books:</p>
        <p className="text-sm font-medium">
          {isRankOne ? (
            <span className="custom-line-through">
              ₱{lms_books_fee.toLocaleString()}
            </span>
          ) : (
            `₱${lms_books_fee.toLocaleString()}`
          )}
        </p>
      </div>

      {/* Discount Breakdown */}
      {rankOneDiscountAmount > 0 && (
        <div className="flex justify-between text-green-600">
          <p className="text-sm">Rank One Discount:</p>
          <p className="text-sm font-medium">
            - ₱{rankOneDiscountAmount.toLocaleString()}
          </p>
        </div>
      )}
      {siblingDiscountAmount > 0 && (
        <div className="flex justify-between text-green-600">
          <p className="text-sm">Sibling Discount (5%):</p>
          <p className="text-sm font-medium">
            - ₱{siblingDiscountAmount.toLocaleString()}
          </p>
        </div>
      )}
      {fullYearDiscountAmount > 0 && (
        <div className="flex justify-between text-green-600">
          <p className="text-sm">Full Year Discount:</p>
          <p className="text-sm font-medium">
            - ₱{fullYearDiscountAmount.toLocaleString()}
          </p>
        </div>
      )}
      {scholarDiscountAmount > 0 && (
        <div className="flex justify-between text-green-600">
          <p className="text-sm">Scholar Discount:</p>
          <p className="text-sm font-medium">
            - ₱{scholarDiscountAmount.toLocaleString()}
          </p>
        </div>
      )}

      {discountAmount > 0 && (
        <div className="flex justify-between font-medium text-green-600 border-t border-dashed pt-1">
          <p className="text-sm">Total Discount:</p>
          <p className="text-sm">- ₱{discountAmount.toLocaleString()}</p>
        </div>
      )}

      <div className="border-t pt-2 flex justify-between text-blue-500">
        <p className="text-lg font-bold">Total Tuition:</p>
        <p className="text-lg font-bold text-blue-500">
          ₱{totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TuitionBreakdown;
